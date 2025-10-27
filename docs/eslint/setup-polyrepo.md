---
order: 100
label: Setup a polyrepo
meta:
    title: Configure a polyrepo - ESLint
toc:
    depth: 2
---

# Setup a polyrepo

Execute the following steps to setup [ESLint](https://eslint.org/) for a polyrepo solution (**single project** per repository) :point_down:

## Install the packages

Open a terminal at the root of the solution and install the following packages:

```bash
pnpm add -D @workleap/eslint-configs @eslint/js @typescript-eslint/parser @types/node eslint typescript-eslint
```

## Configure ESLint

First, create a configuration file named `eslint.config.ts` at the root of the solution:

``` !#5
root
├── src
├──── ...
├── package.json
├── eslint.config.ts
```

Then, open the newly created file and extend the default configuration with one of the [shared configurations](./getting-started.md#available-configurations) provided by `@workleap/eslint-configs` :point_down:

### Web application

For an application developed with TypeScript and React, use the following configuration:

```ts !#3 eslint.config.ts
import { defineWebApplicationConfig } from "@workleap/eslint-configs";

export default defineWebApplicationConfig(import.meta.dirname);
```

### React library

For a TypeScript library developed **with** React, use the following configuration:

```ts !#3 eslint.config.ts
import { defineReactLibraryConfig } from "@workleap/eslint-configs";

export default defineReactLibraryConfig(import.meta.dirname);
```

#### React compiler

If your application is set up with the [React compiler](https://react.dev/learn/react-compiler), enable the React Compiler rules:

```ts !#4-6 eslint.config.ts
import { defineReactLibraryConfig } from "@workleap/eslint-configs";

export default defineReactLibraryConfig(import.meta.dirname, {
    react: {
        compiler: true
    }
});
```

### TypeScript library

For a TypeScript library developed **without** React, use the following configuration:

```ts !#3 eslint.config.ts
import { defineTypescriptLibraryConfig } from "@workleap/eslint-configs";

export default defineTypescriptLibraryConfig(import.meta.dirname);
```

### Ignore files and folders

ESLint can be configured to [ignore](https://eslint.org/docs/latest/use/configure/ignore) certain files and folders by specifying one or more glob patterns.

To do so, extend the `eslint.config.ts` file configuration at the root of the solution:

```ts !#5-9 eslint.config.ts
import { defineWebApplicationConfig } from "@workleap/eslint-configs";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
    globalIgnores([
        "packages",
        "samples",
        "docs"
    ]),
    defineWebApplicationConfig(import.meta.dirname)
]);
```

!!!tip
The configuration ignores common folders by default, such as `node_modules`, `dist`, `storybook-static`, `.git`, `.turbo`etc.. Before manually adding more ignored files or folders, make sure that ESLint is actually processing them.
!!!

## Configure the indent style

[@stylistic/eslint-plugin](https://eslint.style/) offers built-in rules for configuring the indentation style of a codebase. However, there's a catch: when [VS Code auto-formatting](https://code.visualstudio.com/docs/editor/codebasics#_formatting) feature is enabled, it might conflict with the configured indentation rules if they are set differently.

To guarantee a consistent indentation, we recommend using [EditorConfig](https://editorconfig.org/) on the consumer side. With EditorConfig, the indent style can be configured in a single file and be applied consistently across various formatting tools, including ESlint and [VS Code](https://code.visualstudio.com/).

First, create a `.editorconfig` file at the root of the solution:

``` !#6
root
├── src
├──── ...
├── package.json
├── eslint.config.ts
├── .editorconfig
```

Then, open the newly created file and paste the following configuration:

```bash .editorconfig
root = true

[*]
charset = utf-8
end_of_line = lf
trim_trailing_whitespace = true
insert_final_newline = true
indent_style = space
indent_size = 4

[*.md]
trim_trailing_whitespace = false
```

Finally, install the [EditorConfig.EditorConfig](https://marketplace.visualstudio.com/items?itemName=EditorConfig.EditorConfig) VS Code extension.

## Add a CLI script

At times, especially when running the CI build, it's useful to lint the entire solution using a single command. To do so, add the following script to your solution's `package.json` file:

```json package.json
{
    "lint:eslint": "eslint . --max-warnings=0 --cache --cache-location node_modules/.cache/eslint"
}
```

> The script definition may vary depending of your needs and your application configuration. For example, you might want to specify specific file extensions such as `--ext .js,.ts,.tsx`.

## Custom configuration

New projects shouldn't have to customize the default configurations offered by `@workleap/eslint-configs`. However, if you are in the process of **migrating** an existing project to use this library or encountering a challenging situation, refer to the [custom configuration](./custom-configuration.md) page to understand how to override or extend the default configurations. Remember, **no locked in** :heart::v:.

## Try it :rocket:

To test your new ESLint setup, open a JavaScript file, type invalid code (e.g. `var x = 0;`), then save. Open a terminal at the root of the solution and execute the [CLI script added earlier](#add-a-cli-script):

```bash
pnpm lint:eslint
```

The terminal should output a linting error.
