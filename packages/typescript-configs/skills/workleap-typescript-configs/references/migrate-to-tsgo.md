# Migrate to tsgo

[TypeScript Go](https://github.com/microsoft/typescript-go) (`tsgo`) is a Go reimplementation of the compiler, meant as a drop-in replacement for `tsc` at the CLI level with much faster type-checking. It is mature enough for **type-checking** and the **VS Code** language service, but **not ready for ESLint** yet.

### 1. Exclude packages from minimum release age (PNPM)

`@typescript/native-preview` is released nightly, so it never meets a `minimumReleaseAge` threshold. Add it to the exclusion list.

Monorepo — `pnpm-workspace.yaml`:

```yaml
minimumReleaseAge: 1440
minimumReleaseAgeExclude:
  - '@workleap*'
  - '@typescript/native-preview*'
```

Polyrepo — `.npmrc`:

```ini
minimum-release-age=1440
minimum-release-age-exclude=@workleap*,@typescript/native-preview*
```

The `*` suffix is required because the package installs a platform-specific binary dependency at install time.

### 2. Install the package

Add `@typescript/native-preview` as a dev dependency in **every** `package.json` that already includes `typescript`:

```bash
pnpm add -D @typescript/native-preview
```

### 3. Update typecheck scripts

Replace `tsc` with `tsgo`:

```json
{
    "typecheck": "tsgo"
}
```

### 4. VS Code

```json
// .vscode/settings.json
{
    // Comment out the existing library path until @typescript/native-preview is merged into typescript.
    // "typescript.tsdk": "node_modules\\typescript\\lib",
    "typescript.experimental.useTsgo": true,
    "typescript.tsdk": "node_modules\\@typescript\\native-preview\\lib"
}
```

If CI fails with `Unable to resolve ... platform`, temporarily disable the PNPM `minimumReleaseAge` feature.

### 5. ESLint (not ready)

`typescript-eslint` does not support the TypeScript 7.0 API yet and fails at load time with `typescript-eslint does not support TS 7.0`. Keep `typescript@6` installed for ESLint (and the VS Code language service) and let `tsgo` handle `typecheck` only.
