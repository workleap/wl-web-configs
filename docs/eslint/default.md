---
order: 170
icon: /static/eslint.svg
label: ESLint
expanded: true
toc:
    depth: 2-3
---

!!!warning
This package is compatible only with ESLint v8. It is not intended for use with ESLint v9 or later.
!!!

# ESLint

## By project type configurations

Typically, [ESLint](https://eslint.org/) shareable configuration libraries are architectured around the idea that [shared configurations](https://eslint.org/docs/latest/extend/shareable-configs) should be small and composable to accommodate any potential use cases that a development team might encounter.

While composability provides flexibility, it also increases the complexity on the consumer side as they must understand how [ESLint cascading and hierarchy](https://eslint.org/docs/latest/use/configure/configuration-files#cascading-and-hierarchy) works and how to compose the provided shared configurations correctly. **It can be frustrating at times** when you want to get something up and running quickly.

==- @shopify/web-configs example
Have a look at Shopify [ESLint usage section](https://github.com/Shopify/web-configs/tree/main/packages/eslint-plugin#usage). To configure ESLint with `@shopify/web-configs`, a consumer must choose whether he wants rules for `es5`, `esnext`, `typescript` or `node`, then decide if he should use `@babel/eslint-parser` or `@typescript-eslint/parser`.

To make the right choices and assemble the final configuration correctly, a consumer must have niche front-end skills.
===

To improve the experience, rather than delegating the composition of the shared configuration pieces to the consumer, we **compose them internally** and offer configurations by project type instead.

This way, it's pretty straightforward for the consumer to configure ESLint as it only involves **extending** a **single** shared **configuration** per project and it allows for more **accurate defaults** and **assumptions** about the target environment. For advanced users in need of flexibility, the underlying configuration pieces are [also available](advanced-composition.md).

### Target environment

`@workleap/eslint-plugin` by project type shared configurations targets the following environment:

- ESM / CommonJS
- ESNext
- Node

### Available configurations

| Name | Description |
| ---  | --- |
| :icon-mark-github: [web-application](https://github.com/workleap/wl-web-configs/blob/main/packages/eslint-plugin/lib/config/by-project-type/web-application.ts) | For web applications developed with React and TypeScript. |
| :icon-mark-github: [react-library](https://github.com/workleap/wl-web-configs/blob/main/packages/eslint-plugin/lib/config/by-project-type/react-library.ts) | For TypeScript libraries developed **with** React. |
| :icon-mark-github: [typescript-library](https://github.com/workleap/wl-web-configs/blob/main/packages/eslint-plugin/lib/config/by-project-type/typescript-library.ts) | For TypeScript libraries developed **without** React. |
| :icon-mark-github: [monorepo-workspace](https://github.com/workleap/wl-web-configs/blob/main/packages/eslint-plugin/lib/config/by-project-type/monorepo-workspace.ts) | For the workspace configuration of a monorepo solution. |

## Prettier

For a complete explanation of why we chose to stick with ESLint for stylistic rules rather than migrating to Prettier, read the following [article](https://antfu.me/posts/why-not-prettier).

## Getting started

To get started, choose one of the following scenarios :point_down:

### Setup a new project

If you are looking to setup a **new** polyrepo solution (single project per repository), follow the guide to [setup a polyrepo](setup-polyrepo.md), otherwise, follow the guide to [setup a monorepo](setup-monorepo.md).

### Setup an existing project

If you are migrating an **existing** polyrepo solution (single project per repository) to `workleap/web-configs`, follow the guide to [setup a polyrepo](setup-polyrepo.md), otherwise, follow the guide to [setup a monorepo](setup-monorepo.md).

Once configured, to understand how to adapt `@workleap/eslint-plugin` default configurations to your codebase while you are completing the migration, have a look at the [custom configuration](custom-configuration.md) page.

### Advanced configuration

If you are encountering a challenging use case making impractical the [per project type configurations](#available-configurations) offered by `@workleap/eslint-plugin`, have a look at the [advanced composition](advanced-composition.md) page for documentation about how to compose the underlying configuration pieces.
