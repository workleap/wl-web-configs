# Migrate to TypeScript 7

[TypeScript 7](https://devblogs.microsoft.com/typescript/announcing-typescript-7-0/) is the TypeScript compiler rewritten in Go. It ships in the regular `typescript` package and type-checks much faster than TypeScript 6. `@workleap/typescript-configs` supports both TypeScript 6 and 7.

To migrate to TypeScript 7, execute the following steps :point_down:

## Update packages

In every `package.json` file that includes `typescript`, update `typescript` to version 7 and `@workleap/typescript-configs` to its latest version:

```bash
pnpm add -D typescript@7 @workleap/typescript-configs@latest
```

!!!warning
TypeScript 7.0 doesn't ship a JavaScript API. Projects using a tool that calls the TypeScript API, such as [tsup](https://tsup.egoist.dev/), must stay on TypeScript 6. [Rsbuild](https://rsbuild.rs/) and [Rslib](https://rslib.rs/), including Rslib's declaration files, work with TypeScript 7.
!!!

## Remove `@typescript/native-preview`

If the project used `tsgo` from the `@typescript/native-preview` package, TypeScript 7 replaces it. Remove the package from every `package.json` file that includes it:

```bash
pnpm remove @typescript/native-preview
```

Then, replace `tsgo` with `tsc` in the `typecheck` scripts:

```json !#2 package.json
"scripts": {
    "typecheck": "tsc"
}
```

Finally, remove `@typescript/native-preview*` from the `minimumReleaseAgeExclude` setting of the `pnpm-workspace.yaml` file (or `minimum-release-age-exclude` in the `.npmrc` file of a polyrepo).

## Update removed compiler options

TypeScript 7 removes options that TypeScript 6 deprecated. For example, `"moduleResolution": "node"` (or `"node10"`) fails with `error TS5108: Option 'moduleResolution=node10' has been removed`. Replace it with `"NodeNext"` (with `"module": "NodeNext"`), which still emits CommonJS for a package with `"type": "commonjs"`, or with `"Bundler"`.

Also remove the `ignoreDeprecations` option that silenced those deprecations.

## VS Code

Install the [TypeScriptTeam.native-preview](https://marketplace.visualstudio.com/items?itemName=TypeScriptTeam.native-preview) extension: it runs the TypeScript 7 language service and becomes the default experience once installed.

If the project's `.vscode/settings.json` file points to `@typescript/native-preview`, remove these settings:

```json .vscode/settings.json
{
    "typescript.experimental.useTsgo": true,
    "typescript.tsdk": "node_modules\\@typescript\\native-preview\\lib"
}
```

## Try it :rocket:

Run the `typecheck` script of the project. It should complete without errors, and much faster than with TypeScript 6.
