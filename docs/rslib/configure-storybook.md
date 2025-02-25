---
order: 80
label: Configure for Storybook
meta:
    title: Configure for Storybook - Rslib
toc:
    depth: 2-3
---

# Configure for Storybook

To configure [Rslib](https://lib.rsbuild.dev/) for Storybook, execute the following steps :point_down:

## Install the packages

+++ pnpm
```bash
pnpm add -D @workleap/rslib-configs @rslib/core @rsbuild/core storybook-react-rsbuild storybook-addon-rslib
```
+++ yarn
```bash
yarn add -D @workleap/rslib-configs @rslib/core @rsbuild/core storybook-react-rsbuild storybook-addon-rslib
```
+++ npm
```bash
npm install -D @workleap/rslib-configs @rslib/core @rsbuild/core storybook-react-rsbuild storybook-addon-rslib
```
+++

## Configure Rslib

[Rslib Storybook integration](https://lib.rsbuild.dev/guide/advanced/storybook) is an addon that derives an Rsbuild configuration from an existing Rslib configuration file. This addon automatically reads the Rslib configuration and applies it to Storybook's Rsbuild framework, ensuring that the configuration is unified.

As a result, configuring a Storybook instance for Rslib is very similar to [configuring a Storybook instance for Rsbuild](https://storybook.rsbuild.dev/guide/index.html).

### `rslib.config.ts`

First, create a configuration file named `rslib.config.ts` under the `.storybook` folder:

``` !#5
storybook
├── .storybook
├──── main.ts
├──── preview.tsx
├──── rslib.config.ts
├── package.json
```

Then, open the newly created file and `export` the Rslib configuration by using the `defineStorybookConfig(options)` function:

```ts rslib.config.ts
import { defineStorybookConfig } from "@workleap/rslib-configs";

export default defineStorybookConfig();
```

### `main.ts`

Finally, open the `.storybook/main.ts` file and set `storybook-react-rsbuild` as the framework to use and `storybook-addon-rslib` as an addon:

```ts !#4-5 main.ts
import type { StorybookConfig } from "storybook-react-rsbuild";

const storybookConfig: StorybookConfig = {
    framework: "storybook-react-rsbuild",
    addons: ["storybook-addon-rslib"],
    stories: ["../../src/**/*.stories.(tsx|mdx)"]
};

export default storybookConfig;
```

!!!info
For additional information about using Rslib with Storybook, refer to the Rslib [documentation](https://lib.rsbuild.dev/guide/advanced/storybook).
!!!

## Use predefined options

The `defineStorybookConfig(options)` function can be used as shown in the previous example, however, if you wish to customize the default configuration, the function also accept a few predefined options to help with that 👇

### `plugins`

- **Type**: An array of Rsbuild [plugin instances](https://rsbuild.dev/plugins/list/index)
- **Default**: `[]`

Append the provided Rsbuild plugins to the configuration.

```ts !#5 rslib.config.ts
import { defineStorybookConfig } from "@workleap/rslib-configs";
import { pluginAssetsRetry } from "@rsbuild/plugin-assets-retry";

export default defineStorybookConfig({
    plugins: [pluginAssetsRetry()]
});
```

### `sourceMap`

- **Type**: `false` or an object literal accepting any [output.sourceMap](https://rsbuild.dev/config/output/source-map) options.
- **Default**: `{ js: "cheap-module-source-map", css: true }`

Whether or not to generate [source map](https://rsbuild.dev/config/output/source-map). To disable source map, set the option to `false`. 

```ts !#4 rslib.config.ts
import { defineStorybookConfig } from "@workleap/rslib-configs";

export default defineStorybookConfig({
    sourceMap: false
});
```

To customize the source map [configuration](https://rsbuild.dev/config/output/source-map), provide an object literal.

```ts !#4-6 rslib.config.ts
import { defineStorybookConfig } from "@workleap/rslib-configs";

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

```ts !#4 rslib.config.ts
import { defineStorybookConfig } from "@workleap/rslib-configs";

export default defineStorybookConfig({
    react: false
});
```

To customize [plugin-react](https://rsbuild.dev/plugins/list/plugin-react), provide a function to extend the default options.

```ts !#4-12 rslib.config.ts
import { defineStorybookConfig } from "@workleap/rslib-configs";

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

```ts !#4 rslib.config.ts
import { defineStorybookConfig } from "@workleap/rslib-configs";

export default defineStorybookConfig({
    svgr: false
});
```

To customize [plugin-svgr](https://rsbuild.dev/plugins/list/plugin-svgr), provide a function extending the default options.

```ts !#4-13 rslib.config.ts
import { defineStorybookConfig } from "@workleap/rslib-configs";

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

## Configuration transformers

!!!warning
We do not guarantee that your configuration transformers won't break after an update. It's your responsibility to keep them up to date with new releases.
!!!

The [predefined options](#use-predefined-options) are useful to quickly customize the [default Storybook configuration](https://github.com/workleap/wl-web-configs/blob/main/packages/rslib-configs/src/storybook.ts) of `@workleap/rslib-configs`, but only covers a subset of an [Rslib configuration](https://lib.rsbuild.dev/config/index). If you need full control over the configuration, you can provide configuration transformer functions through the `transformers` option of the `defineStorybookConfig` function. Remember, **no locked in** :heart::v:.

To view the default Storybook configuration of `@workleap/rslib-configs`, have a look at the [storybook.ts configuration file](https://github.com/workleap/wl-web-configs/blob/main/packages/rslib-configs/src/storybook.ts) on GitHub.

### `transformers`

- **Type**: `((config: RslibConfig, context: RslibConfigTransformerContext) => RslibConfig)[]`
- **Default**: `[]`

```ts
transformer(config: RslibConfig, context: RslibConfigTransformerContext) => RslibConfig
```

```ts !#4-11,14 rslib.config.ts
import { defineStorybookConfig, type RslibConfigTransformer } from "@workleap/rslib-configs";
import type { RslibConfig } from "@rslib/core";

const useInlineStylesTransformer: RslibConfigTransformer = (config: RslibConfig) => {
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
import type { RslibConfigTransformer } from "@workleap/rslib-configs";
import type { RslibConfig } from "@rslib/core";

export const transformer: RslibConfigTransformer = (config: RslibConfig) => {
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

## Add CLI scripts

Add the following scripts to the project `package.json` file:

```json package.json
{
    "dev": "storybook dev -p 6006",
    "build": "storybook build"
}
```

## Try it :rocket:

To test the new Rslib configuration, open a terminal at the root of the project and execute the [CLI scripts added earlier](#add-cli-scripts). Either the Storybook development server should start without outputting any error in the terminal or the Storybook application bundle files should be available in the `/storybook-static` folder (or any other folder you configured).

