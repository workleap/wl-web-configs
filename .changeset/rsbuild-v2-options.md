---
"@workleap/rsbuild-configs": minor
---

Add new options aligned with [Rsbuild 2.0](https://rsbuild.rs/blog/v2-0):

- New `polyfill` option on `defineBuildConfig`. Defaults to `"usage"`. `core-js` is now declared as a direct dependency of `@workleap/rsbuild-configs` to preserve out-of-the-box polyfill support after Rsbuild 2.0 stopped installing it by default.
- New `splitChunks` option on `defineBuildConfig`. Defaults to `{ preset: "per-package", chunks: "all" }`, replacing the deprecated `performance.chunkSplit`. Each npm package is now emitted in its own chunk for better long-term caching.
- New `setup` option on `defineDevConfig`, exposing Rsbuild's `server.setup` hook.

Internal refactor of `getOptimizationConfig` to use Rsbuild's `output.minify` shape. The user-facing `optimize` and `minify` options behave identically.

A new [Migrate to v2.0](https://workleap.github.io/wl-web-configs/rsbuild/migrate-to-v2/) page is available in the documentation.
