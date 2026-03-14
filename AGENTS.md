# AGENTS.md
## Purpose
Repository guidance for agentic coding tools working in this project.
Use this with the actual source and config files; when they disagree, follow the code/config and update this file.

## Stack Overview
- Next.js 16 App Router
- React 19
- TypeScript with `strict: true`
- Tailwind CSS v4 + `tw-animate-css` + shadcn-style primitives
- RainbowKit + wagmi + viem for wallet/blockchain flows
- Biome + Ultracite for formatting/linting
- Lefthook for pre-commit automation
- `pnpm` is the expected package manager (`pnpm-lock.yaml` exists)

## Important Paths
- `app/`: routes, layout, API handlers, global CSS
- `components/`: feature and layout components
- `components/ui/`: shared UI primitives
- `lib/`: helpers, wagmi config, contract/address utilities
- `abi/`: contract ABI JSON files
- `.env.example`: environment variable template
- `biome.jsonc`: formatter/linter rules
- `lefthook.yml`: git hook behavior

## Commands
Use `pnpm` unless the user explicitly requests something else.
- Install: `pnpm install`
- Dev server: `pnpm dev`
- Production build: `pnpm build`
- Start built app: `pnpm start`
- Lint / format check: `pnpm check` (`ultracite check`)
- Auto-fix lint / format issues: `pnpm fix` (`ultracite fix`)
- Install git hooks: `pnpm prepare`

## Test Commands
There is currently no test framework configured in `package.json`.
No Jest, Vitest, Playwright, or test scripts were found.
No `*.test.*`, `*.spec.*`, or `__tests__` files were found.

Current state:
- There is no supported `pnpm test` command.
- There is no supported single-test command.
- For validation, use `pnpm check` and `pnpm build`.
- For UI behavior, run `pnpm dev` and verify in the browser.

Do not invent a fake single-test command in status updates.
Say explicitly that single-test execution is not available in the current repo.

## Verification Order
For most changes, use this order:
1. `pnpm check`
2. `pnpm build`
3. manual verification with `pnpm dev` when UI behavior changed

## Cursor / Copilot Rules
Checked these locations:
- `.cursor/rules/`
- `.cursorrules`
- `.github/copilot-instructions.md`

Result: none of those files exist in this repository.
Agents should rely on this file, source code, and project config.

## Formatting Rules
Formatting comes from `biome.jsonc`.
- Use tabs, not spaces, for indentation.
- Use semicolons.
- Use single quotes in TS/JS.
- Use single quotes in JSX attributes.
- Keep trailing commas when Biome adds them.
- Keep imports organized; Biome assist has import organization enabled.
- Do not hand-format against the formatter.

## Import Conventions
- Prefer `import type` for type-only imports.
- Prefer named imports unless a library clearly expects default imports.
- Prefer the `@/` alias over long relative paths.
- Keep external imports before internal `@/` imports.
- Keep CSS side-effect imports near the top.
- Preserve blank-line grouping when it improves readability.

Examples used in the repo:
- `import type { Metadata } from 'next';`
- `import { Providers } from '@/components/providers';`
- `import '@rainbow-me/rainbowkit/styles.css';`

## TypeScript Guidelines
- Keep code safe under `strict` mode.
- Avoid `any`; Biome allows it, but it is not the preferred style.
- Type exported component props explicitly.
- Use runtime validation before type assertions for env-derived values.
- Narrow unknown errors before reading `.message`.
- Preserve viem address typing patterns already used in `lib/contracts.ts`.
- Prefer small, obvious types over clever generic abstractions.

Existing patterns worth copying:
- `err instanceof Error ? err.message : String(err)`
- `const value = process.env.KEY ?? ''`
- validate first, then cast to `Address`

## Naming Conventions
- React components: PascalCase (`LandingPage`, `AppShell`)
- Component files: kebab-case (`landing-page.tsx`)
- Functions/locals: camelCase
- Shared constants: UPPER_SNAKE_CASE when they are true constants (`SEPOLIA_ID`, `TOKEN_ADDRESS`)
- Booleans: descriptive `is*` / `has*` names (`isConnected`, `isWrongChain`)
- Next route handlers: framework names like `GET`, `POST`

## React / Next.js Conventions
- Add `'use client';` only when hooks, browser APIs, or client-only libraries require it.
- Keep `app/` page files thin; push substantial UI into components.
- Put shared chrome in wrappers like `AppShell` or in `app/layout.tsx`.
- Use typed `metadata` exports in layout/page files when relevant.
- Keep API routes under `app/api/**/route.ts` and return `NextResponse` objects.
- Preserve the existing App Router structure instead of introducing Pages Router patterns.

## Styling Conventions
- Tailwind is the primary styling approach.
- Reuse `cn(...)` from `lib/utils.ts` for conditional classes.
- Reuse `components/ui/` primitives before creating new low-level controls.
- Match the established visual style: dark surfaces, vivid accent colors, rounded panels, blur/glass effects.
- Preserve mobile-friendly sizing and the existing `min-h-[44px]` / `min-w-[44px]` tap-target pattern.
- Keep fonts aligned with `app/layout.tsx` and `app/globals.css`.

## Error Handling
- Catch errors where you can recover or show a useful message.
- Convert wallet/provider errors into readable UI copy.
- In API routes, return structured JSON errors with suitable status codes.
- Parse request bodies defensively.
- Do not silently swallow failures unless the fallback is intentional.

Repo examples:
- wallet switch handling in `components/chain-guard.tsx`
- JSON parse guard in `app/api/rpc/[chain]/route.ts`

## Environment Variables
Check `.env.example` before changing env usage.
Variables currently referenced by the code include:
- `NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID`
- `NEXT_PUBLIC_APP_URL`
- `NEXT_PUBLIC_TOKEN_ADDRESS`
- `NEXT_PUBLIC_TOKEN_MARKET_ADDRESS`
- `INFURA_PROJECT_ID`
- `INFURA_API_KEY`

Guidelines:
- Public browser-exposed vars must use `NEXT_PUBLIC_`.
- Trim and validate env values before use.
- Prefer safe fallbacks unless startup must fail hard.

## Lint Rule Notes
Some rules are intentionally relaxed in `biome.jsonc`.
Do not "fix" code based on assumptions from another repo.

Notable rule settings:
- `noExplicitAny`: off
- `useExhaustiveDependencies`: warn
- `noUnusedVariables`: warn
- `noArrayIndexKey`: warn
- several accessibility rules: off

Even so, prefer robust code over merely satisfying the relaxed baseline.

## Git Hook Behavior
The pre-commit hook runs `pnpm dlx ultracite fix` on staged JS/TS/JSON/CSS files and re-stages fixes.

Practical implications:
- expect formatting/import rewrites at commit time
- run `pnpm fix` before committing when possible
- re-read changed files if a hook modifies them

## Working Style for Agents
- Make small, targeted changes that match existing patterns.
- Prefer reuse over introducing new abstractions.
- Do not replace existing Chinese user-facing copy unless the task requires it.
- Keep comments sparse and only for non-obvious reasoning.
- If you add a test runner or other workflow command, update this file.
