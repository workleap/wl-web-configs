---
order: 80
label: Configure for Storybook
meta:
    title: Configure for Storybook - Rsbuild
toc:
    depth: 2-3
---

# Configure for Storybook

To configure [Rsbuild](https://rsbuild.dev/) for [Storybook](https://storybook.js.org/), execute the following steps :point_down:

## Install the packages

Open a terminal at the root of the Storybook project and install the following packages:

```bash
pnpm add -D @workleap/rsbuild-configs @workleap/browserslist-config @rsbuild/core @rspack/core browserslist storybook-react-rsbuild
```

## Configure Rsbuild

### Browserslist

First, let's set up [Browserlist](https://github.com/browserslist/browserslist) to define the minimum browser versions supported by the application. Rsbuild will automatically detect and load the browser versions from the nearest `.browserslistrc` configuration file.

First, create a `browserslistrc` file at the root of the project:

``` !#5
storybook
├── .storybook
├──── main.ts
├──── preview.tsx
├── .browserslistrc
├── package.json
```

Then, open the newly created file and extend the default configuration with the shared configuration provided by `@workleap/browserslist-config`:

``` .browserslistrc
extends @workleap/browserslist-config
```

### `rsbuild.config.ts`

Next, create a configuration file named `rsbuild.config.ts` under the `.storybook` folder:

``` !#5
storybook
├── .storybook
├──── main.ts
├──── preview.tsx
├──── rsbuild.config.ts
├── .browserslistrc
├── package.json
```

Then, open the newly created file and `export` the Rsbuild configuration by using the `defineStorybookConfig(options)` function:

```ts rsbuild.config.ts
import { defineStorybookConfig } from "@workleap/rsbuild-configs";

export default defineStorybookConfig();
```

### `main.ts`

Finally, open the `.storybook/main.ts` file and set `storybook-react-rsbuild` as the framework to use:

```ts !#4 main.ts
import type { StorybookConfig } from "storybook-react-rsbuild";

const storybookConfig: StorybookConfig = {
    framework: "storybook-react-rsbuild",
    stories: ["../../src/**/*.stories.(tsx|mdx)"]
};

export default storybookConfig;
```

## Use predefined options

The `defineStorybookConfig(options)` function can be used as shown in the previous examples, however, if you wish to customize the default configuration, the function also accept a few predefined options to help with that 👇

### `plugins`

- **Type**: An array of Rsbuild [plugin instances](https://rsbuild.dev/plugins/list/index)
- **Default**: `[]`

Append the provided Rsbuild plugins to the configuration.

```ts !#5 rsbuild.config.ts
import { defineStorybookConfig } from "@workleap/rsbuild-configs";
import { pluginAssetsRetry } from "@rsbuild/plugin-assets-retry";

export default defineStorybookConfig({
    plugins: [pluginAssetsRetry()]
});
```

### `sourceMap`

- **Type**: `false` or an object literal accepting any [output.sourceMap](https://rsbuild.dev/config/output/source-map) options.
- **Default**: `{ js: "cheap-module-source-map", css: true }`

Whether or not to generate [source map](https://rsbuild.dev/config/output/source-map). To disable source map, set the option to `false`. 

```ts !#4 rsbuild.config.ts
import { defineStorybookConfig } from "@workleap/rsbuild-configs";

export default defineStorybookConfig({
    sourceMap: false
});
```

To customize the source map [configuration](https://rsbuild.dev/config/output/source-map), provide an object literal.

```ts !#4-6 rsbuild.config.ts
import { defineStorybookConfig } from "@workleap/rsbuild-configs";

export default defineStorybookConfig({
    sourceMap: {
        css: false
    }
});
```

### `react`

- **Type**: `false` or `(defaultOptions: PluginReactOptions) => PluginReactOptions`
- **Default**: `defaultOptions => defaultOptions`

Whether or not to transform React code. To disable React code transformation, set the option to `false`.

```ts !#4 rsbuild.config.ts
import { defineStorybookConfig } from "@workleap/rsbuild-configs";

export default defineStorybookConfig({
    react: false
});
```

To customize [plugin-react](https://rsbuild.dev/plugins/list/plugin-react), provide a function to extend the default options.

```ts !#4-12 rsbuild.config.ts
import { defineStorybookConfig } from "@workleap/rsbuild-configs";

export default defineStorybookConfig({
    react: defaultOptions => {
        return {
            ...defaultOptions,
            swcReactOptions: {
                ...(defaultOptions.swcReactOptions ?? {}),
                runtime: "classic"
            }
        };
    }
});
```

### `svgr`

- **Type**: `false` or `(defaultOptions: PluginSvgrOptions) => PluginSvgrOptions`
- **Default**: `defaultOptions => defaultOptions`

Whether or not to handle `.svg` files with [plugin-svgr](https://rsbuild.dev/plugins/list/plugin-svgr). When the option is set to `false`, the `.svg` files will be handled by the `asset/resource` rule.

```ts !#4 rsbuild.config.ts
import { defineStorybookConfig } from "@workleap/rsbuild-configs";

export default defineStorybookConfig({
    svgr: false
});
```

To customize [plugin-svgr](https://rsbuild.dev/plugins/list/plugin-svgr), provide a function extending the default options.

```ts !#4-13 rsbuild.config.ts
import { defineStorybookConfig } from "@workleap/rsbuild-configs";

export default defineStorybookConfig({
    svgr: defaultOptions => {
        return {
            svgrOptions: {
                ...(defaultOptions.svgrOptions ?? {}),
                ref: true
            }
            ...defaultOptions,

        }
    }
});
```

#### Typings

When an SVG asset in referenced in TypeScript code, TypeScript may prompt that the module is missing a type definition:

```bash
TS2307: Cannot find module './logo.svg' or its corresponding type declarations.
```

To fix this, add a type declaration for the SVG assets, by creating a `src/env.d.ts` file, and add the type declaration.

```ts src/env.d.ts
declare module '*.svg' {
  export const ReactComponent: React.FunctionComponent<
    React.SVGProps<SVGSVGElement>
  >;
}
declare module '*.svg?react' {
  const ReactComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  export default ReactComponent;
}
```

For additional information, refer to the plugin [documentation](https://rsbuild.dev/plugins/list/plugin-svgr#type-declaration).

#### Import images

By default, `plugin-svgr` is configured to support [named import](https://rsbuild.dev/plugins/list/plugin-svgr#named-import) for `ReactComponent`:

```tsx
import { ReactComponent as Logo } from "./logo.svg";

export const App = () => <Logo />;
```

### `verbose`

- **Type**: `boolean`
- **Default**: `false`

Start the Rsbuild process with verbose logging turned on.

```ts !#4 rsbuild.config.ts
import { defineStorybookConfig } from "@workleap/rsbuild-configs";

export default defineStorybookConfig({
    verbose: true
});
```

## Configuration transformers

!!!warning
We do not guarantee that your configuration transformers won't break after an update. It's your responsibility to keep them up to date with new releases.
!!!

The [predefined options](#use-predefined-options) are useful to quickly customize the [default Storybook configuration](https://github.com/workleap/wl-web-configs/blob/main/packages/rsbuild-configs/src/storybook.ts) of `@workleap/rsbuild-configs`, but only covers a subset of an [Rsbuild configuration](https://rsbuild.dev/config/index). If you need full control over the configuration, you can provide configuration transformer functions through the `transformers` option of the `defineStorybookConfig` function. Remember, **no locked in** :heart::v:.

To view the default Storybook configuration of `@workleap/rsbuild-configs`, have a look at the [storybook.ts configuration file](https://github.com/workleap/wl-web-configs/blob/main/packages/rsbuild-configs/src/storybook.ts) on GitHub.

### `transformers`

- **Type**: `((config: RsbuildConfig, context: RsbuildConfigTransformerContext) => RsbuildConfig)[]`
- **Default**: `[]`

```ts
transformer(config: RsbuildConfig, context: RsbuildConfigTransformerContext) => RsbuildConfig
```

```ts !#4-11,14 rsbuild.config.ts
import { defineStorybookConfig, type RsbuildConfigTransformer } from "@workleap/rsbuild-configs";
import type { RsbuildConfig } from "@rsbuild/core";

const useInlineStylesTransformer: RsbuildConfigTransformer = (config: RsbuildConfig) => {
    config.output = {
        ...(config.ouput ?? {}),
        inlineStyles: true
    };

    return config;
};

export default defineStorybookConfig({
    transformers: [useInlineStylesTransformer]
});
```

### Execution context

Generic transformers can use the `context` parameter to gather additional information about their execution context, like the `environment` they are operating in.

```ts !#5 transformer.ts
import type { RsbuildConfigTransformer } from "@workleap/rsbuild-configs";
import type { RsbuildConfig } from "@rsbuild/core";

export const transformer: RsbuildConfigTransformer = (config: RsbuildConfig) => {
    if (context.environment === "storybook") {
        config.output = {
            ...(config.ouput ?? {}),
            inlineStyles: true
        };
    }

    return config;
}
```

- `environment`: `"dev" | "build" | "storybook"`
- `verbose`: `boolean`

## Add CLI scripts

Add the following scripts to the project `package.json` file:

```json package.json
{
    "dev": "storybook dev -p 6006",
    "build": "storybook build"
}
```

## Use environment variables

### cross-env

We recommend instead to define environment variables using [cross-env](https://github.com/kentcdodds/cross-env). With `cross-env`, the environment variables will be made available to any Node.js files that are executed by the script process (`dev` and `build` in the example below :point_down:):

```json package.json
{
    "dev": "cross-env DEBUG=true storybook dev -p 6006",
    "build": "cross-env DEBUG=true storybook build"
}
```

```ts !#3 rsbuild.config.ts
import { defineStorybookConfig } from "@workleap/rsbuild-configs";

if (process.env.DEBUG) {
    console.log("Configuring Rsbuild in debug mode!");
}

export default defineStorybookConfig();
```

However, there's a catch. When using `cross-env`, the variables will not be available in the application files because `cross-env` only makes them available to files that are executed by the process at **build time** while the application files are executed at **runtime** by a browser.

To make them accessible to the application files, Rsbuild must be aware of those environment variables and **render** them into the **compiled application files**. This is the purpose of the `environmentVariables` option.

### `environmentVariables`

- **Type**: `Record<string, unknown>`
- **Default**: `{}`

First, define the variables with `environmentVariables`:

```ts !#4-6 rsbuild.config.ts
import { defineStorybookConfig } from "@workleap/rsbuild-configs";

export default defineStorybookConfig({
    environmentVariables: {
        "DEBUG": process.env.DEBUG === "true"
    }
});
```

Then, use the variables in any file:

```tsx !#2 src/Button.tsx
export function Button() {
    if (process.env.DEBUG) {
        console.log("The Button component is in debug mode!");
    }

    return null;
}
```

!!!tip
The `=== "true"` part of `"DEBUG": process.env.DEBUG === "true"` is very important, otherwise the environment variable value would be `"true"` instead of `true`.
!!!

!!!tip
By default, Rsbuild injects a few environment variables into the code using the [source.define](https://rsbuild.dev/guide/advanced/env-vars#using-define) option. For additional information about these default environment variables, refer to the Rsbuild [documentation](https://rsbuild.dev/guide/advanced/env-vars#default-variables).
!!!

## Try it :rocket:

To test the new Rsbuild configuration, open a terminal at the root of the project and execute the [CLI scripts added earlier](#add-cli-scripts). Either the Storybook development server should start without outputting any terminal errors or the Storybook application bundled output should be available in the `/storybook-static` folder (or any other folder you configured).
