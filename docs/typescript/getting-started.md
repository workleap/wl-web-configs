---
order: 110
label: Getting started
toc:
    depth: 2-3
---

# Typescript

## By project type configurations

Typically, [TypeScript](https://www.typescriptlang.org/) shareable configuration libraries are architectured around the idea that shared configurations should be small and composable to accomodate any potential use cases that a development team might encounter.

While composability provides flexibility, it also increases the complexity on the consumer side as they must understand how [TypeScript configuration inheritance](https://www.typescriptlang.org/tsconfig#extends) works and how to compose the provided shared configurations correctly. **It can be frustrating at times** when you want to get something up and running quickly.

To improve the experience, rather than delegating the composition of the shared configuration pieces to the consumer, **we compose them internally** and offer configurations by project type instead.

This way, it's pretty straightforward for the consumer to configure TypeScript, as it only involves **extending** a **single** shared **configuration** per project and it allows for more **accurate defaults** and **assumptions** about the target environment. For advanced users in need of flexibility, the underlying configuration pieces are [also available](advanced-composition.md).

### Linting only

`@workleap/typescript-configs` by project type shared configurations exclusively focus on code linting, as [tsup](../tsup/getting-started.md) is handling the transpilation process.

### Target environment

`@workleap/typescript-configs` by project type shared configurations targets the following environment:

- ESM
- ESNext

If you are in the process of migrating an existing project to `@workleap/typescript-configs`, and would rather delay transitioning to ESM, refer to the [custom configuration](custom-configuration.md#non-esm-projects) page for information about how to support non ESM projects.

### Available configurations

| Name | Description |
| ---  | --- |
| :icon-mark-github: [web-application](https://github.com/workleap/wl-web-configs/blob/main/packages/typescript-configs/web-application.json) | For web applications developed with [React](https://react.dev/). |
| :icon-mark-github: [library](https://github.com/workleap/wl-web-configs/blob/main/packages/typescript-configs/library.json) | For library project developed with or without [React](https://react.dev/). |
| :icon-mark-github: [monorepo-workspace](https://github.com/workleap/wl-web-configs/blob/main/packages/typescript-configs/monorepo-workspace.json) | For the workspace configuration of a monorepo solution. |

## Getting started

To get started, choose one of the following scenarios :point_down:

### Setup a project

If you are looking to setup a polyrepo solution (single project per repository), follow the [Setup a polyrepo](./setup-polyrepo.md) guide. To setup a monorepo solution managed with [Turborepo](https://turborepo.com/), follow the [Setup with Turborepo](./setup-turborepo.md) guide.

Once configured, to understand how to adapt `@workleap/typescript-configs` default configurations to your codebase while you are completing the migration, have a look at the [custom configuration](./custom-configuration.md) page.

### Advanced configuration

If you are encountering a challenging use case making impractical the [per project type configurations](#available-configurations) offered by `@workleap/typescript-configs`, have a look at the [advanced composition](./advanced-composition.md) page for documentation about how to compose the underlying configuration pieces of this library.
