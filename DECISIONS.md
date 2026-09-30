# Decisions

Each entry lists the decision, the alternatives I considered, why I chose it, and what it costs.

## 1. Keep the API at the repo root and add the frontend in `web/`

- **Alternatives:** move the starter into `api/` next to `web/`; use a workspace tool (Nx, Turborepo, Yarn workspaces).
- **Why:** the diff against the starter commit stays small and `yarn start` still works as the brief describes.
- **Cost:** the root `tsconfig.json` and `tsconfig.build.json` must exclude `web/`, otherwise `nest build` tries to compile the Next.js app.

## 2. Stricter lint: `no-explicit-any` on, `explicit-function-return-type` as an error

- **Alternatives:** keep the starter's relaxed rules and rely on review.
- **Why:** the brief assesses typing. The linter now enforces "no `any`" and "every function declares its return type" instead of me promising it.
- **Cost:** slightly more verbose code (for example `bootstrap(): Promise<void>`).

## 3. Yarn v1 through Corepack, pinned with `packageManager`

- **Alternatives:** npm; a newer Yarn.
- **Why:** the starter ships a Yarn v1 lockfile. Pinning the version means `corepack enable` gives every reviewer the same Yarn.
- **Cost:** reviewers need Corepack (bundled with Node 18+), or a global Yarn 1.

## 4. Validate `data.json` at startup with hand-written type guards

- **Alternatives:** `import data from '../data.json'` with a cast; a schema library such as zod.
- **Why:** a cast would trust the file blindly. Type guards narrow `unknown` to `User[]` with no casts and no dependency, and the app refuses to start on bad data instead of sending one customer a broken message.
- **Cost:** the error says the data is invalid, not which field. With more records or more shapes, zod would give field-level errors and one source of truth for type and validation.

## 5. A `UsersRepository` that loads the file once into a `Map`

- **Alternatives:** read the file on every request; search the array on every request.
- **Why:** the repository is the seam where a real database would go, so `CommsService` never knows about files. The `Map` gives constant-time lookup by ID.
- **Cost:** changes to `data.json` need a restart. IDs match exactly, so an upper-case UUID returns 404 (all IDs in the data are lower case).

## 6. Money as integer pence inside the API, pounds as a number in the response

- **Alternatives:** floats in pounds throughout; return a string such as `"134.00"`; return pence.
- **Why:** prices such as 62.75 are not exact in binary floating point, so all sums use integers (5550, 6275, ...). The response keeps the brief's contract: `totalPrice` is a JSON number in pounds. JSON cannot keep trailing zeros, so `134.00` is sent as `134` and the frontend formats it as `£134.00`.
- **Cost:** one conversion (`penceToPounds`) at the edge. A client that does arithmetic on `totalPrice` works with floats again; a production API would likely return pence plus a currency code.

## 7. `freeGift` is strictly greater than £120.00

- **Alternatives:** greater than or equal.
- **Why:** the brief says "exceeds 120 pounds". No combination of the current prices totals exactly £120.00, so the boundary is tested at the helper level with 11999, 12000 and 12001 pence.
- **Cost:** none.

## 8. Cat names: "A", "A and B", "A, B and C", then a literal `'s`

- **Alternatives:** Oxford comma; `'` alone after names that end in "s".
- **Why:** both follow the brief literally. 20 users have a last active cat whose name ends in "s" (for example Travis, Markus), so they get "Travis's fresh food". Modern British style guides accept that form.
- **Cost:** a copywriter might prefer "Travis' fresh food". It is a one-line change in the template if so.

## 9. Error responses: 400 for a bad ID, 404 for an unknown user, 404 for no active cats

- **Alternatives for "no active cats":** 200 with empty names (the copy would read "for 's fresh food"); 422 Unprocessable Entity; 409 Conflict.
- **Why:** `ParseUUIDPipe` rejects malformed IDs with 400 before the service runs. A user with no active cats has no next delivery, so the resource the URL names does not exist, and 404 is the honest answer. The message says which case it is (`User <id> has no active cats`). Senders (email, SMS) skip the user, and the frontend shows the same "not found" page. No user in `data.json` has zero active cats, so this path is defensive and covered by a unit test.
- **Cost:** a client cannot tell "unknown user" from "no delivery" by status code alone, only by the message. If a caller needs to act differently, a distinct status or error code would be the next step.

## 10. Thin controller, orchestrating service, pure helpers

- **Alternatives:** do the formatting and pricing inside the service method.
- **Why:** the controller only validates input and delegates. The service fetches the user, filters active cats and fills the template. Each rule (names, price, free gift) is a pure function with its own tests, so the edge cases are tested without Nest.
- **Cost:** more files for a small feature.

## 11. Next.js 15.5 (App Router) with the API call in a Server Component

- **Alternatives:** Next.js 16; Vite + React with a client-side `fetch`.
- **Why:** the brief requires Node 18 or later, and Next.js 16 needs Node 20.9. The page fetches on the server, so the browser gets finished HTML in one request, the API needs no CORS setup, and `API_BASE_URL` never reaches the browser. `cache: 'no-store'` because prices can change.
- **Cost:** Next.js is heavier than a single-page Vite app for one page, and the page needs a Node server to run.

## 12. One `next/image`, reshaped by CSS

- **Alternatives:** two images (a circle for mobile, a panel for desktop) with one hidden by CSS.
- **Why:** a hidden `<img>` still downloads. One image with `sizes="(min-width: 768px) 324px, 56px"` lets the browser choose the file: a 128px file on a 2x phone, 750px on desktop (checked in the Network panel). `fill` sits inside a frame with a fixed size, so the image cannot shift the layout, and `priority` preloads it because it is above the fold.
The cat sits left of centre in the photo, so `object-position: 7% 50%` centres it in the mobile circle.
- **Cost:** the `sizes` string must stay in step with the CSS by hand. `object-position` is tuned to this photo, so a real per-cat photo would need a focal point from the data or a square crop.

## 13. Page states: `notFound()` for 400 and 404, `error.tsx` for everything else

- **Alternatives:** separate pages for "invalid link" and "unknown user"; retry with `reset()`.
- **Why:** to a customer, a malformed link and an unknown user mean the same thing. A 5xx, a network failure, a timeout (see §14) or an unexpected response shape (checked with a type guard) throws, and `error.tsx` offers "Try again". The button reloads the page, because Next's `reset()` only re-renders on the client and would not run the failed server fetch again.
- **Cost:** a full reload is heavier than a client-side retry.

## 14. No `loading.tsx`: the page waits for the API, then sends complete HTML

- **Alternatives:** keep `loading.tsx` (a loading card while the API answers); a `<Suspense>` boundary around the card only.
- **Why:** I first added `loading.tsx`. It makes Next stream the page shell before the API answers, and that caused two problems. `notFound()` then ran after the status line had gone, so the not-found page returned HTTP 200 (with `noindex`). Chrome's accessibility tree also showed `<main>` holding only the loading card, with the real `<article>` outside it. Without it, the server waits for the API, unknown users get a real 404 status, and the HTML has one `<main>` with one `<article>` and one `<h1>`. The page is one small API call, so the wait is short.
- **Timeout:** because nothing renders until the API answers, the fetch has a 5 second timeout (`AbortSignal.timeout(5000)` in `web/src/lib/api.ts`). A hung API now shows `error.tsx` (HTTP 500) after 5 seconds instead of a page that never loads. I checked this against a local server that never responds.
- **Cost:** no loading UI. The browser's own progress indicator shows while the API answers, and a slow API delays the first paint by up to 5 seconds. If the API gets slower, the next step is a skeleton inside `<Suspense>`, which accepts the 200 status on not-found.

## 15. CSS Modules with colour variables, and system fonts

- **Alternatives:** Tailwind; styled-components; a web font through `next/font`.
- **Why:** CSS Modules ship with Next.js, so the page needs no styling dependency. I eyedropped the colours from the Figma screenshots into CSS variables in `globals.css`. The layout is mobile first with one breakpoint at 768px. The mobile card stops at 480px and centres, so it does not stretch between 480px and 767px. The brief says fonts only need to be close, so system fonts avoid a font download.
- **Cost:** the 768px breakpoint appears in two CSS files, because CSS variables cannot be used in media queries.

## 16. The web app copies the response type and checks it at runtime

- **Alternatives:** a shared types package; OpenAPI with generated types.
- **Why:** the two apps are separate projects, and a shared package needs workspace tooling. A type guard checks the response at runtime, so a contract change fails loudly on the error page instead of rendering `undefined`.
- **Cost:** the two type definitions can drift. OpenAPI codegen is the next step (see the README).

## 17. "See details" is a `<button>`, "Edit delivery" is an `<a>`

- **Why:** the design notes say "See details" opens a modal (an action, so a button) and "Edit delivery" goes to another page (navigation, so a link). Both have TODOs, because the modal and the edit page are out of scope. CSS sets the capitals, so screen readers read "See details" and not a string of capital letters.
- **Cost:** the button does nothing yet, and the link goes to `#`.

## 18. Jest through `next/jest`, without `jest-dom`

- **Alternatives:** Vitest; adding `@testing-library/jest-dom`.
- **Why:** the API already uses Jest, so one test runner covers both apps. `getBy*` queries throw when an element is missing, so `toBeTruthy()` and `toBeNull()` are enough and the tests need one dependency fewer.
- **Cost:** failure messages are less descriptive than `toBeInTheDocument()`. The page itself is an async Server Component, which React Testing Library cannot render, so the tests cover `DeliveryCard` and the helpers, and I checked the page by hand.
