---
order: 140
icon: /static/rsbuild.svg
label: Rsbuild
expanded: true
toc:
    depth: 2-3
---

# Rsbuild

<!-- !!!warning Before you continue...

The preferred way for using `@workleap/webpack-configs` is **not** by installing the library manually, but rather by **scaffolding** your application with Workleap's [foundry-cli](https://github.com/workleap/wl-foundry-cli).

+++ pnpm
```bash
pnpm create @workleap/project@latest <output-directory>
```
+++ yarn
```bash
yarn create @workleap/project@latest <output-directory>
```
+++ npm
```bash
npm create @workleap/project@latest <output-directory>
```
+++
!!! -->

[Rsbuild](https://lib.rsbuild.dev/index) is a high-performance build tool powered by [Rspack](https://rspack.dev/), a Rust-based port of [webpack](https://webpack.js.org/) designed for efficiency and speed. Those new Rsbuild shared configurations are a modern replacement for previous Workleap's shared [webpack configurations](../webpack//default.md).

## Main features

The shared configurations offered by `@workleap/rsbuild-configs` includes the following features :point_down:

### Language support

- JavaScript
- TypeScript
- CSS (with CSS modules and LightningCSS)

### Framework support

- React

### Asset support

- SVG as React components
- PNG
- JPEG
- GIF

### Development features

- Development server
- Fast Refresh or Hot Module Reload
- Sourcemap

### Production features

- Minification
- Output to `/dist`

### Target environment

As per the [Browserlist](../browserslist/default.md) configuration.

## Getting started

To get started, follow the quick start guide to configure Rsbuild for either a [development environment](./configure-dev.md), a [production environment](./configure-build.md) or [storybook](./configure-storybook.md). Before deploying to Netlify read the [deploy to Netlify](./deploy-to-netlify.md) guide.

:point_right: If your project is currently using `@workleap/webpack-configs` as a bundler, follow the [migration guide](./migrate-from-webpack.md).
