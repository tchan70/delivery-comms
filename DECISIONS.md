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
