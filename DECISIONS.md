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
