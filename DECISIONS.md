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
