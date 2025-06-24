---
order: 100
label: Getting started
---

# Getting started

Welcome to `@workleap/web-configs`, a collection of **configuration libraries** for building web applications at [Workleap](https://workleap.com/). On this getting started page, you'll find an overview of the project and a list of supported tools.

## Why we built these libraries?

Starting a new web application is still an arduous task. There are so many tools to choose from, learn, install and configure, it can be daunting.

For an organization like Workleap, with a large suite of products, it **doesn't make sense to start over every time** we invest in a new idea or add a new vertical to an existing product. Developers working on a new project shouldn't spend their first day's figuring out which ESLint rules to enable/disable, or how to transpile their React code, they should rather **focus on writing features code**.

### Filling the gap

While a collection of common configurations gets us closer to that goal, on their own, configuration libraries are not enough to reach it. There is still a need to install and assemble those configurations correctly in the new application, which can also be a challenge. To fill this gap, we will also invest into a __CLI__ to scaffold new web applications and libraries.

### Best of both worlds

With the CLI, developers will have the ability to generate fully configured web applications in a few minutes. However, contrary to configuration libraries, a CLI alone is only good at creating the initial files of an application, it doesn't help with the **maintenance** or the **adoption of new features** offered by tools over time.

That's why we need both, there's a strong synergy between a collection of configuration libraries and a CLI.

With configuration libraries **distributed through NPM packages** and installed with a CLI, when a new feature is available for a tool, the configuration libraries maintainers can spend time learning the new feature, making the necessary changes, and **distributing the changes with a new version** of the package. Then, at their convenience, **product teams can adopt the changes** by bumping the configuration library package version in their respective application.

We hope that introducing CLI with a collection of configuration libraries will facilitate the creation and maintenance of front-end projects.

## Guiding principles

While developing the configuration libraries, we kept one guiding principle in mind, **no locked in** :heart::v:. We truly hope that the default configurations will satisfy your application needs, but if it doesn't, there will always be an easy way to extend or override the default configuration.

## Target environment

The majority of the shared tooling configurations targets [ESM](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) and the latest [ECMAScript](https://en.wikipedia.org/wiki/ECMAScript) version (ESNext). If you are in the process of migrating an existing project to `workleap/web-configs`, and would rather delay transitioning to ESM, have a look at the _Target environment_ section of each tool for additional information about how to support **non ESM compliant** solutions.

## Supported tools

| Name | NPM | Documentation |
| --- | --- | --- |
| ![](../static/browserslist.svg){ class="h-5 w-5 mr-2 -mt-1" }[Browserslist](https://browsersl.ist/) | [![npm version](https://img.shields.io/npm/v/@workleap/browserslist-config)](https://www.npmjs.com/package/@workleap/browserslist-config) | [Getting started](../browserslist/default.md) |
| ![](../static/eslint.svg){ class="h-5 w-5 mr-2 -mt-1" }[ESLint](https://eslint.org/) | [![npm version](https://img.shields.io/npm/v/@workleap/eslint-plugin)](https://www.npmjs.com/package/@workleap/eslint-plugin) | [Getting started](../eslint/default.md) |
| ![](../static/stylelint.svg){ class="h-5 w-5 mr-2 -mt-1" }[Stylelint](https://stylelint.io/) | [![npm version](https://img.shields.io/npm/v/@workleap/stylelint-configs)](https://www.npmjs.com/package/@workleap/stylelint-configs) | [Getting started](../stylelint/default.md) |
| ![](../static/typescript.svg){ class="h-5 w-5 mr-2 -mt-1" }[Typescript](https://www.typescriptlang.org/) | [![npm version](https://img.shields.io/npm/v/@workleap/typescript-configs)](https://www.npmjs.com/package/@workleap/typescript-configs) | [Getting started](../typescript/default.md) |
| ![](../static/rsbuild.svg){ class="h-5 w-5 mr-2 -mt-1" }[Rsbuild](https://rsbuild.dev/) | [![npm version](https://img.shields.io/npm/v/@workleap/rsbuild-configs)](https://www.npmjs.com/package/@workleap/rsbuild-configs) | [Getting started](../rsbuild/default.md) |
| ![](../static/rslib.svg){ class="h-5 w-5 mr-2 -mt-1" }[Rslib](https://lib.rsbuild.dev/) | [![npm version](https://img.shields.io/npm/v/@workleap/rslib-configs)](https://www.npmjs.com/package/@workleap/rslib-configs) | [Getting started](../rslib/default.md) |
| ![](../static/postcss.svg){ class="h-5 w-5 mr-2 -mt-1" }[PostCSS](https://postcss.org/) [!badge variant="secondary" size="s" text="in maintenance mode"] | [![npm version](https://img.shields.io/npm/v/@workleap/postcss-configs)](https://www.npmjs.com/package/@workleap/postcss-configs) | [Getting started](../postcss/default.md) |
| ![](../static/swc.svg){ class="h-5 w-5 mr-2 -mt-1" }[SWC](https://swc.rs/) [!badge variant="secondary" size="s" text="in maintenance mode"] | [![npm version](https://img.shields.io/npm/v/@workleap/swc-configs)](https://www.npmjs.com/package/@workleap/swc-configs) | [Getting started](../swc/default.md) |
| ![](../static/webpack.svg){ class="h-5 w-5 mr-2 -mt-1" }[webpack](https://webpack.js.org/) [!badge variant="secondary" size="s" text="in maintenance mode"] | [![npm version](https://img.shields.io/npm/v/@workleap/webpack-configs)](https://www.npmjs.com/package/@workleap/webpack-configs) | [Getting started](../webpack/default.md) |
| ![](../static/tsup.svg){ class="h-5 w-5 mr-2 -mt-1" }[tsup](https://tsup.egoist.dev/) [!badge variant="secondary" size="s" text="in maintenance mode"] | [![npm version](https://img.shields.io/npm/v/@workleap/tsup-configs)](https://www.npmjs.com/package/@workleap/tsup-configs) | [Getting started](../tsup/default.md) |






