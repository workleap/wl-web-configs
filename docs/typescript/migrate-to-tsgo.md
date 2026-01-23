---
order: 60
label: Migrate to tsgo
meta:
    title: Migrate to tsgo - TypeScript
toc:
    depth: 2
---

# Migrate to tsgo

[TypeScript Go](https://github.com/microsoft/typescript-go) is a reimplementation of the [TypeScript](https://www.typescriptlang.org/) compiler written in Go, designed to dramatically improve performance and scalability compared to the current JavaScript-based compiler. It aims to be a drop-in replacement for `tsc` at the CLI level, providing much faster type-checking, lower memory usage, and better parallelism, especially on large codebases and in CI environments. While still being experimental, and not yet a full replacement for the JavaScript compiler APIs used by tooling like [ESLint](https://eslint.org/), it is already mature enough to be used reliably for type-checking and VS Code built-in [language service](https://code.visualstudio.com/api/language-extensions/language-server-extension-guide).

## Typechecking

:large_green_circle: Mature enough to serve as a drop-in replacement.

To migrate to `tsgo` for typechecking, execute the following steps :point_down:

### Exclude packages from minimum release age

First, if your package manager is [PNPM](https://pnpm.io/) and you have enabled the [minimumReleaseAge]() feature, add the `tsgo` packages to the exclusion list. These packages are released nightly and will never meet the minimum age threshold.

For a monorepo, open `pnpm-workspace.yaml` and add `@typescript/native-preview*` to `minimumReleaseAgeExclude`:

```yaml !#4 pnpm-workspace.yaml
minimumReleaseAge: 1440
minimumReleaseAgeExclude:
  - '@workleap*'
  - '@typescript/native-preview*'
```

For a polyrepo, open `.npmrc` and add `@typescript/native-preview*` to `minimum-release-age-exclude`:

```ini !#2 .npmrc
minimum-release-age=1440
minimum-release-age-exclude=@workleap*,@typescript/native-preview*
```

!!!tip
`@typescript/native-preview*` is allowed instead of `@typescript/native-preview` (minus the `*`) because that package installs a platform-specific binary dependency at install time.
!!!

### Install the package

Next, install the `@typescript/native-preview` package alongside the existing `typescript` package. This means adding `@typescript/native-preview` as a dev dependency in every `package.json` that already includes `typescript`.

To do so, open a terminal, navigate to each directory that contains a `package.json` file with the `typescript` dependency, and run the following command:

```bash
pnpm add -D @typescript/native-preview
```

### Update typecheck scripts to use tsgo

Finally, update the `typecheck` scripts of the `package.json` files to replace `tsc` by `tsgo`.

Before:

```json !#2 package.json
"scripts": {
    "typecheck": "tsc"
}
```

Now:

```json !#2 package.json
"scripts": {
    "typecheck": "tsgo"
}
```

### Troubleshoot issues

If your CI encounters the following error:

```
throw new Error("Unable to resolve " + platformPackageName + ". Either your platform is unsupported, or you are missing the package on disk.");
```

consider temporarily disabling the pnpm `minimumReleaseAge` feature.

## VS Code

:large_green_circle: Mature enough to serve as a drop-in replacement

The built-in language service that powers TypeScript and JavaScript editing features can also be configured to use `tsgo`. To do so, open the project's `.vscode/settings.json` file and add or update the following settings:

```json !#3,5-6 .vscode/settings.json
{
    // Comment out the existing library path until @typescript/native-preview is merged into the typescript package.
    // "typescript.tsdk": "node_modules\\typescript\\lib",

    "typescript.experimental.useTsgo": true,
    "typescript.tsdk": "node_modules\\@typescript\\native-preview\\lib",
}
```

## ESLint

:red_circle: Not ready yet.
