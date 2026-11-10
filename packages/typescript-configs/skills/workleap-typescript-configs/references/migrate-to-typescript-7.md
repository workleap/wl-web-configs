# Migrate to TypeScript 7

TypeScript 7 is the TypeScript compiler rewritten in Go, shipped in the regular `typescript` package (`tsc`), with much faster type-checking. `@workleap/typescript-configs` supports both TypeScript 6 and 7.

### 1. Update packages

In every `package.json` that includes `typescript`:

```bash
pnpm add -D typescript@7 @workleap/typescript-configs@latest
```

TypeScript 7.0 ships **no JavaScript API**. Projects using a tool that calls the TypeScript API (e.g. tsup) must stay on TypeScript 6. Rsbuild and Rslib (including Rslib's declaration files) work with TypeScript 7.

### 2. Remove `@typescript/native-preview`

If the project used `tsgo`, TypeScript 7 replaces it:

```bash
pnpm remove @typescript/native-preview
```

Replace `tsgo` with `tsc` in the `typecheck` scripts:

```json
{
    "typecheck": "tsc"
}
```

Remove `@typescript/native-preview*` from `minimumReleaseAgeExclude` (`pnpm-workspace.yaml`) or `minimum-release-age-exclude` (`.npmrc`).

### 3. Update removed compiler options

TypeScript 7 removes options TypeScript 6 deprecated. `"moduleResolution": "node"` / `"node10"` fails with `error TS5108`: replace it with `"NodeNext"` (with `"module": "NodeNext"`, which still emits CommonJS for a `"type": "commonjs"` package) or `"Bundler"`. Remove `ignoreDeprecations`.

### 4. VS Code

Install the `TypeScriptTeam.native-preview` extension (TypeScript 7 language service, default once installed). Remove `"typescript.experimental.useTsgo"` and a `"typescript.tsdk"` pointing to `@typescript/native-preview`.
