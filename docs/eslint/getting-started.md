---
order: 110
label: Getting started
toc:
    depth: 2-3
---

# ESLint

## By project type configurations

Typically, [ESLint](https://eslint.org/) shareable configuration libraries are architectured around the idea that [shared configurations](https://eslint.org/docs/latest/extend/shareable-configs) should be small and composable to accommodate any potential use cases that a development team might encounter.

While composability provides flexibility, it also increases the complexity on the consumer side as they must understand [ESLint core concepts](https://eslint.org/docs/latest/use/core-concepts/glossary) and how to compose the provided shared configurations correctly. **It can be frustrating at times** when you want to get something up and running quickly.

To improve the experience, rather than delegating the composition of the shared configuration pieces to the consumer, we **compose them internally** and offer configurations by project type instead.

This way, it's pretty straightforward for the consumer to configure ESLint as it only involves **extending** a **single** shared **configuration** per project and it allows for more **accurate defaults** and **assumptions** about the target environment.

### Target environment

`@workleap/eslint-configs` by project type shared configurations targets the following environment:

- ESM
- ESNext
- Node

### Available configurations

| Name | Description |
| ---  | --- |
| :icon-mark-github: [defineWebApplicationConfig](https://github.com/workleap/wl-web-configs/tree/main/packages/eslint-configs/src/by-project-type/defineWebApplicationConfig.ts) | For web applications developed with React and TypeScript. |
| :icon-mark-github: [defineReactLibraryConfig](https://github.com/workleap/wl-web-configs/tree/main/packages/eslint-configs/src/by-project-type/defineReactLibraryConfig.ts) | For TypeScript libraries developed **with** React. |
| :icon-mark-github: [defineTypescriptLibraryConfig](https://github.com/workleap/wl-web-configs/tree/main/packages/eslint-configs/src/by-project-type/defineTypescriptLibraryConfig.ts) | For TypeScript libraries developed **without** React. |
| :icon-mark-github: [defineMonorepoWorkspaceConfig](https://github.com/workleap/wl-web-configs/tree/main/packages/eslint-configs/src/by-project-type/defineMonorepoWorkspaceConfig.ts) | For the workspace configuration of a monorepo solution. |

## Prettier

For a complete explanation of why we chose to stick with ESLint for stylistic rules rather than migrating to Prettier, read the following [article](https://antfu.me/posts/why-not-prettier).

## Getting started

### Setup a project

If you are looking to setup a polyrepo solution (single project per repository), follow the [Setup a polyrepo](./setup-polyrepo.md) guide. To setup a monorepo solution managed with [Turborepo](https://turborepo.com/), follow the [Setup with Turborepo](./setup-turborepo.md) guide.

Once configured, to understand how to adapt `@workleap/eslint-configs` default configurations to your codebase, have a look at the [custom configuration](./custom-configuration.md) page.

### Migrate from ESLint 8

If your project currently uses `@workleap/eslint-plugin`, follow the [migration guide](./migrate-from-eslint-8.md) to upgrade.
