---
order: 70
label: tsup
toc:
    depth: 2-3
---

# tsup

!!!warning
`@workleap/tsup-configs` is now in maintenance mode. If you're starting a new project, consider using [@workleap/rslib-configs](../rslib/default.md) instead for better performance and modern tooling.
!!!

## Issues with `tsc`

`tsc`, the native [TypeScript CLI](https://www.typescriptlang.org/docs/handbook/compiler-options.html), pretty much offers everything that we need to compile and bundle our TypeScript libraries. We opted for [tsup](https://tsup.egoist.dev/) due to `tsc` lacks of support for CSS imports, a requirement for enabling Chromatic's [TurboSnap](https://www.chromatic.com/docs/turbosnap) feature.

Given that either TurboSnap requirements or `tsc` CSS imports support change, we will reevaluate this decision.

## Main features

The shared configurations offered by `@workleap/tsup-configs` includes the following features 👇

### TypeScript features

- Emits declaration files

### Development features

- Watch mode
- Sourcemaps

### Production features

- Output to `/dist`

### Target environment

- ESM
- ESNext

## Getting started

To get started, follow the quick start guide to configure tsup for either a [development environment](configure-dev.md) or a [production environment](configure-build.md).
