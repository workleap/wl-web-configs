---
order: 100
label: Getting started
toc:
    depth: 2-3
---

# PostCSS

!!!warning
`@workleap/postcss-configs` is now in maintenance mode. If you're starting a new project, consider using [@workleap/rsbuild-configs](../rsbuild/getting-started.md) instead of [@workleap/webpack-configs](../webpack/getting-started.md), which eliminates the need for PostCSS.
!!!

## Deprecation warning

As we actively work on improving our build time and **minimize** the number of tools **compiling/transpiling** frontend code, we expect [PostCSS](https://postcss.org/) to be one of the first tools that we will **deprecate** from our technology stack. Therefore, before adding PostCSS to your project, make sure that you really need it.

Here's a couple of ideas to move away from PostCSS:

- Prefer native CSS to SCSS.
- Avoid CSS nesting, it usually makes code harder to read anyway. If you really need nesting, [native support](https://www.w3.org/TR/css-nesting-1/) is coming soon.
- Force developers to use `rem` by disabling the use of `px` with [Stylelint](https://stylelint.io/).
- Prefix CSS properties directly in the codebase rather than relying on [Autoprefixer](https://github.com/postcss/autoprefixer). As browser vendors are now [putting experimental features behind a flag](https://github.com/postcss/autoprefixer) rather than using prefixes, there aren't many CSS properties still requiring a prefix.

## Main features

The shared configuration offered by `@workleap/postcss-configs` includes the following features:

### Preset Env

- [Stage 3](https://preset-env.cssdb.org/features/#stage-3)
- [Autoprefixer](https://github.com/postcss/autoprefixer)

## Getting started

To get started, follow the [quick start](configure-project.md) guide to configure your first project.
