---
order: 40
label: Migrate to v2.0
meta:
    title: Migrate to v2.0 - Rslib
toc:
    depth: 2-3
---

# Migrate to v2.0

`@workleap/rslib-configs` has been updated to track [Rslib `0.21+`](https://github.com/web-infra-dev/rslib/releases), which integrates [Rsbuild 2.0](https://rsbuild.rs/blog/v2-0) and [Rspack 2.0](https://www.rspack.dev/blog/announcing-2-0). Unlike `@workleap/rsbuild-configs`, no public API surface of `@workleap/rslib-configs` changed during this upgrade — most of the migration work is upstream.

This page documents the changes that consumers of `@workleap/rslib-configs` should be aware of. For an exhaustive list of upstream changes, refer to the [Rsbuild 2.0 announcement](https://rsbuild.rs/blog/v2-0) and the [Rslib releases](https://github.com/web-infra-dev/rslib/releases).

## Update the packages

Open a terminal at the root of the library project and upgrade the following packages:

```bash
pnpm add -D @workleap/rslib-configs @rslib/core@^0.21.0
```

## Bump Node.js

Rsbuild 2.0 (and therefore Rslib `0.20+`) requires **Node.js `20.19+` or `22.12+`**. Node.js 18 is no longer supported because it reached end of life in April 2025.

Make sure your CI runners and local development environment are running a supported version. The recommended pattern is to pin a version in the project [`.nvmrc`](https://github.com/nvm-sh/nvm#nvmrc) (or equivalent) file:

```text .nvmrc
22
```

## Review changed defaults

The following upstream changes may affect a library project.

### Pure ESM `@rsbuild/core`

`@rsbuild/core` is now published as pure ESM. If your library imports `@rsbuild/core` from a CommonJS file, migrate that file to ESM.

### Advanced ESM is now the default

The `experiments.advancedEsm` option is now ignored. The advanced ESM behavior (improved tree-shaking, better interop) is enabled by default in both bundle and bundleless modes. If you previously set `experiments.advancedEsm: true` through a transformer, you can remove it.

### Type renames

`StartServerResult` has been renamed to `StartDevServerResult`. If your code imports this type directly from `@rslib/core`, update the import:

```ts
- import type { StartServerResult } from "@rslib/core";
+ import type { StartDevServerResult } from "@rslib/core";
```

### Increased `contenthash` length

The default `contenthash` length increased from 8 to 10 characters. Output filenames such as `index.[contenthash].js` will be slightly longer. This is generally beneficial (reduced collision risk) and should not require any action.

## Updates to `@workleap/rslib-configs`

No public option of [`defineBuildConfig`](./configure-build.md), [`defineDevConfig`](./configure-dev.md), or [`defineStorybookConfig`](./configure-storybook.md) changed in this release. The package continues to expose the same defaults and signature as before.

If you previously customized the library configuration through a [transformer](./configure-build.md#transformers), be aware that:

- The underlying configuration is now produced by Rslib `0.21+` on top of Rsbuild 2.0 and Rspack 2.0.
- Transformer functions that rely on internal v1 shapes (e.g. inspecting `tools.rspack.optimization.minimizer` instances) may need adjustments. Refer to the Rsbuild [migration guide](https://rsbuild.rs/guide/migration/rsbuild-0-x) for the full list of internal changes.

!!!info
The [`experiments.exe`](https://rslib.rs) option introduced in Rslib `0.21` for building Node.js single-executable applications is **not** currently exposed by `@workleap/rslib-configs`. If you need it, configure it through a transformer.
!!!

## Try it :rocket:

After upgrading, run the project's build script and verify:

- The build completes without errors.
- The output `dist/` directory contains the expected files and TypeScript declarations.
- Consumers of the library compile and run as expected.
