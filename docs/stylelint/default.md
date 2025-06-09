---
order: 160
icon: /static/stylelint.svg
label: Stylelint
expanded: true
toc:
    depth: 2-3
---

# Stylelint

## SCSS support

While SCSS still offers numerous advantages, as we actively work on improving our build time and **minimize** the number of tools **compiling/transpiling** frontend code, we choose to **move away from Sass** and not provide any Stylelint's rules for Sass. If you are still using Sass strictly for nesting, note that [native support for nesting](https://www.w3.org/TR/css-nesting-1/) is coming soon to CSS.

## Embedding Prettier

Since `v15.0.0`, Stylelint's stylistic rules [has been deprecated](https://stylelint.io/migration-guide/to-15#deprecated-stylistic-rules). The current recommendation is to use [Prettier](https://prettier.io/) instead to format CSS files.

For that reason, `@workleap/stylelint-configs` shared configurations includes the [stylelint-prettier](https://github.com/prettier/stylelint-prettier) plugin. Using this plugin, Prettier changes are exposed as Stylelint's rule violations.

Since we choose to [stick with ESLint for JavaScript and JSON stylistic rules](../eslint/default.md#prettier), a `.prettierignore` file must be added at the root of the solution to ignore everything but CSS files:

``` .prettierignore
*
!**/*.css
```

Otherwise, Prettier will also format your `.js,.json,.ts` files and you'll end up with conflicts between [Prettier](https://prettier.io/) and [ESLint](https://eslint.org/).

## Getting started

To get started, choose one of the following scenarios :point_down:

### Setup a new project

If you are looking to setup a **new** polyrepo solution (single project per repository), follow the guide to [setup a polyrepo](setup-polyrepo.md), otherwise, follow the guide to [setup a monorepo](setup-monorepo.md).

### Setup an existing project

If you are migrating an **existing** polyrepo solution (single project per repository) to `workleap/web-configs`, follow the guide to [setup a polyrepo](setup-polyrepo.md), otherwise, follow the guide to [setup a monorepo](setup-monorepo.md).

Once configured, to understand how to adapt `@workleap/stylelint-configs` default configurations to your codebase while you are completing the migration, have a look at the [custom configuration](custom-configuration.md) page.
