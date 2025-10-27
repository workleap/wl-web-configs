---
order: 0
meta:
    title: Migrate from ESLint 8 - ESLint
toc:
    depth: 2-3
---

# Migrate from ESLint 8

More than a year ago, ESLint released [version v9](https://eslint.org/blog/2024/04/eslint-v9.0.0-released/), a major update introducing the new [flat configuration system](https://eslint.org/blog/2022/08/new-config-system-part-2/), which significantly changed how configurations are defined and consumed.

We postponed upgrading Workleap's shareable configuration because the ESLint ecosystem had not yet fully caught up, and the new system initially felt immature, especially before the introduction of the [extends](https://eslint.org/blog/2025/03/flat-config-extends-define-config-global-ignores/) feature.

Now, updating to ESLint v9 has become essential: the ecosystem is ready, ESLint `v8` packages are deprecated and increasingly difficult to maintain, and ESLint v10 is already on the horizon.

!!!warning
After migrating to ESLint 9, you might notice an increase in the number of warnings and errors reported by ESLint. During the migration, we discovered that the previous shared configurations contained bugs and that many rules were not being applied correctly. This new release represents a significant improvement over the previous versions.
!!!

## Migrate a polyrepo setup

### Update the packages

Open a terminal at the root of the solution and uninstall the following packages:

```bash
pnpm remove -D @workleap/eslint-plugin @typescript-eslint/parser eslint
```

Using the same terminal, install the following packages:

```bash
pnpm add -D @workleap/eslint-configs @eslint/js @typescript-eslint/parser @types/node eslint typescript-eslint
```

### Update the configuration files

Copy the custom configurations from `.eslintrc.json` and the ignore entries from `.eslintignore`, then delete both files:

``` !#5-6
root
├── src
├──── ...
├── package.json
├── .eslintignore   <------- X
├── .eslintrc.json  <------- X
```

Then, create a configurations file named `eslint.config.ts` at the root of the solution:

``` !#5
root
├── src
├──── ...
├── package.json
├── eslint.config.ts
```

Then, depending on the project type, configure ESLint using one of the available [shared configuration](setup-polyrepo.md#configure-eslint). Here's an example for a web application solution:

```ts eslint.config.ts
import { defineWebApplicationConfig } from "@workleap/eslint-configs";

export default defineWebApplicationConfig(import.meta.dirname);
```

Finally, use the copied configurations from the legacy `v8` files to customize the newly created `eslint.config.ts` file. Refer to the [custom configuration](./custom-configuration.md) section for guidance.

## Migrate a monorepo setup

### Migrate the workspace

#### Update the packages

Open a terminal at the root of the workspace and uninstall the following packages:

```bash
pnpm remove -D @workleap/eslint-plugin @typescript-eslint/parser eslint
```

Using the same terminal, install the following packages:

```bash
pnpm add -D @workleap/eslint-configs @eslint/js @typescript-eslint/parser @types/node eslint typescript-eslint
```

#### Update the configuration files

Copy the custom configurations from the workspace `.eslintrc.json` and the ignore entries from the workspace `.eslintignore`, then delete both files:

``` !#8-9
workspace
├── packages
├──── pkg-1
├────── src
├──────── ...
├────── package.json
├── package.json
├── .eslintignore   <------- X
├── .eslintrc.json  <------- X
```

Then, create a configurations file named `eslint.config.ts` at the root of the workspace:

``` !#8
workspace
├── packages
├──── pkg-1
├────── src
├──────── ...
├────── package.json
├── package.json
├── eslint.config.ts
```

Then, update the `eslint.config.ts` file to export the `defineMonorepoWorkspaceConfig` shared configuration:

```ts eslint.config.ts
import { defineMonorepoWorkspaceConfig } from "@workleap/eslint-configs";

export default defineMonorepoWorkspaceConfig(import.meta.dirname);
```

Finally, use the copied configurations from the legacy `v8` files to customize the newly created `eslint.config.ts` file. Refer to the [custom configuration](./custom-configuration.md) section for guidance.

### Migrate a project

#### Update the packages

Open a terminal at the root of the project and uninstall the following packages:

```bash
pnpm remove -D @workleap/eslint-plugin @typescript-eslint/parser eslint
```

Using the same terminal, install the following packages:

```bash
pnpm add -D @workleap/eslint-configs @eslint/js @typescript-eslint/parser @types/node eslint typescript-eslint
```

#### Update the configuration files

Copy the custom configurations from `.eslintrc.json` and the ignore entries from `.eslintignore`, then delete both files:

``` !#7-8
workspace
├── packages
├──── pkg-1
├────── src
├──────── ...
├────── package.json
├────── .eslintignore   <------- X
├────── .eslintrc.json  <------- X
├── package.json
├── eslint.config.ts
├── .editorconfig
```

Then, create a configurations file named `eslint.config.ts` at the root of the project:

``` !#7
workspace
├── packages
├──── pkg-1
├────── src
├──────── ...
├────── package.json
├────── eslint.config.ts
├── package.json
├── eslint.config.ts
├── .editorconfig
```

Then, depending on the project type, configure ESLint using one of the available [shared configuration](setup-polyrepo.md#configure-eslint). Here's an example for a React library project:

```ts eslint.config.ts
import { defineReactLibraryConfig } from "@workleap/eslint-configs";

export default defineReactLibraryConfig(import.meta.dirname);
```

Finally, use the copied configurations from the legacy `v8` files to customize the newly created `eslint.config.ts` file. Refer to the [custom configuration](./custom-configuration.md) section for guidance.
