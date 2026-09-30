# Next delivery comms

A NestJS endpoint that builds a personalised "your next delivery" message for a customer, and a Next.js page that renders it.

- **API:** `GET /comms/your-next-delivery/:userId` returns `{ title, message, totalPrice, freeGift }`.
- **Web:** `/welcome/:userId` calls the API on the server and renders the Figma design on mobile and desktop.

The original brief was this README in the starter commit. See it with `git show 38f381c:README.md`.

## Run it

You need Node 22 (tested with 22.22.0) or Node 18.18+ (tested with 18.20.8), and Yarn 1 through Corepack:

```bash
corepack enable
```

**API** (repo root, port 3000):

```bash
yarn install
yarn start
```

Then open http://localhost:3000/comms/your-next-delivery/ff535484-6880-4653-b06e-89983ecf4ed5

**Web** (`web/`, port 3001, in a second terminal):

```bash
cd web
cp .env.example .env.local   # optional: API_BASE_URL defaults to http://localhost:3000
yarn install                 # on Node 18: yarn install --ignore-engines (see DECISIONS.md §19)
yarn dev
```

Then open http://localhost:3001/welcome/ff535484-6880-4653-b06e-89983ecf4ed5

`API_BASE_URL` is the only setting. The web app reads it on the server only, so it never reaches the browser.

### Users to try

| User ID | What it shows |
|---|---|
| `ff535484-6880-4653-b06e-89983ecf4ed5` | README example: 2 active cats, 1 inactive, £134.00, free gift |
| `618f4ed6-1c5b-4993-a149-f64700bf31dd` | 1 cat, £69.00, no free gift |
| `ea17433d-7527-45a5-acbc-2e2f78f95c6e` | 3 cats ("Cristina, Mariah and Rebekah"), £197.50 |
| `97f92e82-1609-4820-b658-80a2aca18b76` | £118.25, just under the free gift threshold |
| `00000000-0000-4000-8000-000000000000` | Unknown user: API 404, "not found" page |
| `not-a-uuid` | Invalid ID: API 400, "not found" page |

Stop the API to see the web error page. Its "Try again" button recovers when the API is back.

## Tests and checks

| | API (repo root) | Web (`web/`) |
|---|---|---|
| Type check | `yarn typecheck` | `yarn typecheck` |
| Lint | `yarn lint` (the starter's script, runs with `--fix`) | `yarn lint` |
| Unit tests | `yarn test` (34) | `yarn test` (21) |
| e2e tests | `yarn test:e2e` (3, supertest) | none, see "What I'd do next" |
| Build | `yarn build` | `yarn build` |

## What I built

### API

```text
src/
  users/                       data access
    user.types.ts              Cat, User, PouchSize
    parse-users.ts             type guards: narrow data.json from unknown to User[]
    users.repository.ts        loads data.json once at startup, lookup by ID
  comms/                       templating
    comms.controller.ts        route + ParseUUIDPipe
    comms.service.ts           find user, filter active cats, fill the template
    comms.types.ts             NextDeliveryResponse
    helpers/                   pure functions, each with its own spec
      format-cat-names.ts        "A", "A and B", "A, B and C"
      calculate-total-price.ts   integer pence
      qualifies-for-free-gift.ts strictly more than £120.00
      pence-to-pounds.ts
test/comms.e2e-spec.ts         200, 400, 404 through the real app and data.json
```

| Request | Response |
|---|---|
| Known user with active cats | 200 with the template filled in |
| ID is not a UUID | 400 (`ParseUUIDPipe`) |
| No user with that ID | 404 `User <id> not found` |
| User has no active cats | 404 `User <id> has no active cats` |

### Web

```text
web/src/
  app/welcome/[userId]/
    page.tsx                   Server Component: one API call on the server
    not-found.tsx              for API 400 and 404
    error.tsx                  for 5xx, network failure, 5 s timeout, bad response shape
  components/
    DeliveryCard.tsx           the Figma card; FREE GIFT tag only when freeGift is true
    CatImage.tsx               one next/image, a circle on mobile, a panel on desktop
    MessageCard.tsx            not found and error states
  lib/
    api.ts                     fetch with timeout, status handling, runtime type check
    format-price.ts            134 -> "£134.00"
```

## Key decisions

[DECISIONS.md](DECISIONS.md) lists each decision with the alternatives, the reason and the cost. The main ones:

- **Money in integer pence inside the API** (§6). The response keeps the brief's contract, a number in pounds, and the web app formats it.
- **No casts on data.json** (§4). Type guards narrow `unknown` to `User[]`, and bad data stops the app at startup.
- **404 for a user with no active cats** (§9). There is no next delivery, and the message says which case it is.
- **Server-side fetch in a Server Component** (§11). One request, no CORS, and the API URL stays on the server.
- **One image, reshaped by CSS** (§12). A phone downloads a 128px file, and the image cannot shift the layout.
- **No `loading.tsx`, and a 5 s timeout instead** (§14). Unknown users get a real 404 status, and a hung API shows the error page.
- **Node 18** (§19). The code compiles and runs on Node 18. On Node 18 the web install needs `--ignore-engines`.

## What I'd do next (in priority order)

1. **CI:** typecheck, lint, tests and build for both apps on Node 18 and 22 on every push.
2. **One contract:** generate an OpenAPI spec from the API (`@nestjs/swagger`) and the web types from it, to remove the copied type (§16).
3. **Observability:** send errors from `error.tsx` and the API to an error tracker, add structured logs with request IDs, and alert on 5xx and timeouts.
4. **Error codes:** add a machine-readable code to error bodies, so a client can tell "unknown user" from "no active cats" (§9).
5. **Page tests:** Playwright against a stub API for the 200, 404, 5xx and timeout states, with screenshots at 375, 768 and 1280px.
6. **Real data:** replace `UsersRepository` with a database, and match UUIDs without regard to case (§5).
7. **Product:** build the "See details" modal and the "Edit delivery" page, use each customer's own cat photo, and move the copy into templates that non-engineers can edit (§8, §12, §17).
8. **Money in v2 of the API:** return pence and a currency code instead of pounds (§6).

## How I used AI tools

I used Claude Code as a pair programmer, with rules I set at the start: a written plan before any code, small commits, and a stop for my review at three checkpoints (API, web, docs).

- **AI did:** read the brief and profiled `data.json` (user counts, edge cases, the £120 boundary), proposed the plan and listed open questions, wrote most of the code and tests, ran the checks, and checked the page at several widths in a browser.
- **I decided:** every open question (for example 404 for no active cats, pence inside the API, Next.js 15.5 for Node 18, CSS Modules, Jest), the rubric the code had to meet, and the image licence.
- **I checked by hand:** I read the diffs at each checkpoint and ran both apps myself. In Chrome I found four problems that the automated checks missed: the card sat outside `<main>` in the accessibility tree, the mobile card stretched between 600 and 767px, the circle crop was off-centre, and the desktop spacing was too small. After I reviewed the loading trade-off, I asked for the 5 s fetch timeout.
- **Checks that test the output against the brief:** the service and e2e tests assert the README example body character for character, and the helper tests cover every pouch size and the £120 boundary.

## Credits

Cat photo by [@daniel_zopf on Unsplash](https://unsplash.com/photos/brown-and-black-cat-on-white-textile-iQsbPwP-pYw), under the [Unsplash License](https://unsplash.com/license).
