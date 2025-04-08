---
order: 130
icon: /static/rslib.svg
label: Rslib
expanded: true
toc:
    depth: 2-3
---

# Rslib

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

[Rslib](https://lib.rsbuild.dev/) is a high-performance build tool powered by [Rsbuild](https://rsbuild.dev/) and [Rspack](https://rspack.dev/), Rust-based ports of webpack designed for efficiency and speed. Those new Rslib shared configurations are a modern replacement for previous Workleap's shared [tsup configurations](../tsup/default.md).

## Main features

The shared configurations offered by `@workleap/rslib-configs` includes the following features :point_down:

### Language support

- JavaScript
- TypeScript
- CSS (with CSS modules and LightningCSS)

### TypeScript features

- Emits declaration files

### Framework support

- React

### Asset support

- SVG as React components

### Development features

- Watch mode
- Sourcemaps

### Production features

- Sourcemaps
- Output to `/dist`

### Target environment

- ESM
- ESNext

## Getting started

To get started, follow the quick start guide to configure Rsbuild for either a [development environment](./configure-dev.md), a [production environment](./configure-build.md) or [storybook](./configure-storybook.md).

:point_right: If your project is currently using `@workleap/tsup-configs`, follow the [migration guide](./migrate-from-tsup.md).
