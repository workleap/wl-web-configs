# Migrate to Rsbuild v2.0

`@workleap/rsbuild-configs` v4.0 upgrades to [Rsbuild 2.0](https://rsbuild.rs/blog/v2-0) and [Rspack 2.0](https://www.rspack.dev/blog/announcing-2-0). The upgrade is designed to be mostly transparent, but a few defaults and dependencies changed upstream. This page summarizes what is required to migrate an existing application.

## Update the packages

Open a terminal at the root of the web application project and upgrade the following packages:

```bash
pnpm add -D @workleap/rsbuild-configs@^4.0.0 @rsbuild/core@^2.0.0 @rspack/core@^2.0.0
```

## Bump Node.js

Rsbuild 2.0 requires **Node.js `20.19+` or `22.12+`**. Node.js 18 is no longer supported because it reached end of life in April 2025.

Make sure your CI runners and local development environment are running a supported version. The recommended pattern is to pin a version in the project [`.nvmrc`](https://github.com/nvm-sh/nvm#nvmrc) (or equivalent) file:

```text .nvmrc
22
```

## Review changed defaults

The following defaults changed upstream. Most projects don't need to react to them, but they're worth knowing about.

### Browserslist targets

The default Rsbuild target versions have been raised:

| Browser   | v1 default | v2 default |
| --------- | ---------- | ---------- |
| Chrome    | 87         | 107        |
| Firefox   | 78         | 104        |
| Safari    | 14         | 16         |
| Node.js   | 16         | 20         |

This only matters if your project does **not** ship a [`.browserslistrc`](./configure-build.md#browserslist). Workleap projects following the [getting started](./getting-started.md) guide already extend `@workleap/browserslist-config`, which keeps targets explicit.

### `server.host`

`server.host` now defaults to `'localhost'` (it was `'0.0.0.0'` in v1). `@workleap/rsbuild-configs` already defaulted to `'localhost'` in `defineDevConfig`, so there is no behavior change for Workleap consumers.

### Decorators

The default decorator proposal version moved from `'2022-03'` to `'2023-11'`. If your codebase relies on the older proposal, override it via the [`source.decorators`](https://rsbuild.rs/config/source/decorators) option through a transformer.

### Pure ESM `@rsbuild/core`

`@rsbuild/core` is now published as pure ESM. Node.js 20+ supports loading ESM modules through `require()`, so this is transparent for most projects. If you import `@rsbuild/core` from a CommonJS file, consider migrating that file to ESM.

### Node.js output

When building libraries for Node.js with `@rsbuild/core`, the output is now unminified ESM by default (previously minified CommonJS). This does not affect web applications.

## Verify `core-js` is no longer required as a direct dependency

Rsbuild 2.0 [no longer installs](https://rsbuild.rs/blog/v2-0) `core-js` by default. To keep polyfills working out of the box, `@workleap/rsbuild-configs` now declares `core-js` as a **direct dependency** and the new [`polyfill`](./configure-build.md#polyfill) option defaults to `"usage"`.

You can safely remove `core-js` from your application `package.json` if it was added previously:

```bash
pnpm remove core-js
```

If you previously disabled polyfilling through a transformer, you can now do it through the [`polyfill`](./configure-build.md#polyfill) option:

```ts !#4 rsbuild.build.ts
import { defineBuildConfig } from "@workleap/rsbuild-configs";

export default defineBuildConfig({
    polyfill: "off"
});
```

## Review code splitting

The deprecated `performance.chunkSplit` option has been superseded by the new top-level [`splitChunks`](https://rsbuild.rs/config/split-chunks) option, which aligns with Rspack's native API and adds built-in presets.

`@workleap/rsbuild-configs` exposes the new [`splitChunks`](./configure-build.md#splitchunks) option and defaults it to `{ preset: "per-package", chunks: "all" }`. This splits every npm package into its own chunk, which maximizes long-term caching: rebuilding the application only invalidates the chunks of the packages that actually changed.

!!!warning
The new default **may change the layout of your `dist/` folder** compared to v1. The change is generally beneficial (smaller cache invalidation, better HTTP/2 parallelism), but if you've configured downstream caching, prefetching, or service worker logic that depends on specific chunk names, review them after the upgrade.
!!!

To restore the v1 behavior, opt out of code splitting:

```ts !#4 rsbuild.build.ts
import { defineBuildConfig } from "@workleap/rsbuild-configs";

export default defineBuildConfig({
    splitChunks: false
});
```

If you previously customized splitting through `performance.chunkSplit` in a transformer, [migrate](https://rsbuild.rs/config/split-chunks) to the new option through the `splitChunks` option.

## Custom dev-server middleware

If your project previously used a transformer to set `server.setupMiddlewares`, consider migrating to the new [`setup`](./configure-dev.md#setup) hook, which is more powerful and runs both during `dev` and `preview`:

```ts !#4-11 rsbuild.dev.ts
import { defineDevConfig } from "@workleap/rsbuild-configs";

export default defineDevConfig({
    setup: ({ server, action }) => {
        if (action === "dev") {
            server.middlewares.use((req, res, next) => {
                next();
            });
        }
    }
});
```

## Module Federation

`@module-federation/runtime-tools` is no longer transitively installed by `@rsbuild/core`. If your project uses [Module Federation](https://rsbuild.rs/guide/advanced/module-federation), install it explicitly:

```bash
pnpm add -D @module-federation/runtime-tools
```

## Updates to `@workleap/rsbuild-configs`

In addition to the upstream changes, `@workleap/rsbuild-configs` introduces the following changes:

### `polyfill` option (new)

See [polyfill](./configure-build.md#polyfill). Defaults to `"usage"`.

### `splitChunks` option (new)

See [splitChunks](./configure-build.md#splitchunks). Defaults to the `"per-package"` preset.

### `setup` option (new)

See [setup](./configure-dev.md#setup). Pass-through to Rsbuild's `server.setup` hook.

### `optimize` and `minify` interaction

The internal [`getOptimizationConfig`](https://github.com/workleap/wl-web-configs/blob/main/packages/rsbuild-configs/src/build.ts) helper was rewritten on top of the new [`output.minify`](https://rsbuild.rs/config/output/minify) object shape. The user-facing [`optimize`](./configure-build.md#optimize) option behaves identically, but the underlying configuration is now produced through `output.minify` and `tools.rspack.optimization` rather than a manually constructed `SwcJsMinimizerRspackPlugin` instance. If you were inspecting `tools.rspack.optimization.minimizer` through a transformer, switch to inspecting `output.minify` instead.

## Try it :rocket:

After upgrading, run the project's build and dev scripts and verify:

- The build completes without errors.
- The development server starts on `https?://localhost:<port>`.
- The application still polyfills modern APIs in older browsers (if `polyfill` is left to its default).
- The application's `dist/` chunk layout is acceptable.
