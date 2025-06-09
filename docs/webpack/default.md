---
order: 90
icon: /static/webpack.svg
label: webpack
expanded: true
toc:
    depth: 2-3
---

# Webpack

!!!warning
`@workleap/webpack-configs` is now in maintenance mode. If you're starting a new project, consider using [@workleap/rsbuild-configs](../rsbuild/default.md) instead for better performance and modern tooling.
!!!

## Main features

The shared configurations offered by `@workleap/webpack-configs` includes the following features :point_down:

### Language support

- JavaScript
- TypeScript
- CSS (with CSS modules and PostCSS)

### Framework support

- React

### Asset support

- SVG as React components
- PNG
- JPEG
- GIF

### Development features

- Development server
- File system caching
- Fast Refresh or Hot Module Reload
- Sourcemap

### Production features

- File system caching
- Minification
- Output to `/dist`

### Target environment

As per the [PostCSS](../postcss/default.md) and [SWC](../swc/default.md) configurations.

## Getting started

To get started, follow the quick start guide to configure webpack for either a [development environment](configure-dev.md) or a [production environment](configure-build.md).
