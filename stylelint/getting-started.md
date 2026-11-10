# Stylelint

## SCSS support

While SCSS still offers numerous advantages, as we actively work on improving our build time and **minimize** the number of tools **compiling/transpiling** frontend code, we choose to **move away from Sass** and not provide any Stylelint's rules for Sass. If you are still using Sass strictly for nesting, note that [native support for nesting](https://www.w3.org/TR/css-nesting-1/) is coming soon to CSS.

## Embedding Prettier

Since `v15.0.0`, Stylelint's stylistic rules [has been deprecated](https://stylelint.io/migration-guide/to-15#deprecated-stylistic-rules). The current recommendation is to use [Prettier](https://prettier.io/) instead to format CSS files.

For that reason, `@workleap/stylelint-configs` shared configurations includes the [stylelint-prettier](https://github.com/prettier/stylelint-prettier) plugin. Using this plugin, Prettier changes are exposed as Stylelint's rule violations.

The rest of the code is formatted by [oxfmt](https://oxc.rs/docs/guide/usage/formatter.html), configured to ignore CSS files. Prettier doesn't read oxfmt's configuration, so a CSS-scoped `.prettierrc.json5` file gives CSS files the same style as the rest of the code. See the setup guides below.

!!!warning
Don't add a `.prettierignore` file that ignores everything but CSS files: oxfmt also reads `.prettierignore` and would skip every file. A `*` / `!**/*.css` file also stops Prettier from checking the CSS files in subfolders.
!!!

## Getting started

If you are looking to setup a polyrepo solution (single project per repository), follow the [Setup a polyrepo](./setup-polyrepo.md) guide. To setup a monorepo solution managed with [Turborepo](https://turborepo.com/), follow the [Setup with Turborepo](./setup-turborepo.md) guide.
