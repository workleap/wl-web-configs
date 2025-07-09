---
order: 90
label: Configure for build
meta:
    title: Configure for build - Rsbuild
toc:
    depth: 2-3
---

# Configure for build

To configure [Rsbuild](https://rsbuild.dev/) for a production environment, execute the following steps :point_down:

## Install the packages

Open a terminal at the root of the web application project and install the following packages:

```bash
pnpm add -D @workleap/rsbuild-configs @workleap/browserslist-config @rsbuild/core @rspack/core browserslist
```

## Configure Rsbuild

### HTML template

First, create a `public` folder with an `index.html` file at the root of the project:

``` !#2-3
web-project
├── public
├──── index.html
├── src
├──── ...
├── package.json
```

Then, open the newly created `index.html` file and copy/paste the following content:

```html public/index.html
<!DOCTYPE html>
<html>
    <head>
    </head>
    <body>
        <div id="root"></div>
    </body>
</html>
```

The content of the `public/index.html` file will be the template used by Rsbuild [HTML template](https://rsbuild.dev/guide/basic/html-template) feature.

#### Reference local assets

To reference local assets such as a `favicon.png` in the default HTML template, it is recommended to preprend the **relative** path of every asset with the `assetPrefix` option of the Rsbuild config.

First, add the asset to the `public` folder at the root of the project:

``` !#4
web-project
├── public
├──── index.html
├──── favicon.png
├── src
├──── ...
├── package.json
```

Then, add the assets to the `index.html` file:

```html !#4 public/index.html
<!DOCTYPE html>
<html>
    <head>
        <link href="<%=assetPrefix%>/favicon.png" rel="icon">
    </head>
    <body>
        <div id="root"></div>
    </body>
</html>
```

### Browserslist

Next, let's set up [Browserlist](https://github.com/browserslist/browserslist) to define the minimum browser versions supported by the application. Rsbuild will automatically detect and load the browser versions from the nearest `.browserslistrc` configuration file.

First, create a `browserslistrc` file at the root of the project:

``` !#6
web-project
├── public
├──── index.html
├── src
├──── ...
├── .browserslistrc
├── package.json
```

Then, open the newly created file and extend the default configuration with the shared configuration provided by `@workleap/browserslist-config`:

``` .browserslistrc
extends @workleap/browserslist-config
```

### `rsbuild.build.ts`

Next, create a configuration file named `rsbuild.build.ts` at the root of the project:

``` !#8
web-project
├── public
├──── index.html
├── src
├──── ...
├── .browserslistrc
├── package.json
├── rsbuild.build.ts
```

Then, open the newly created file and `export` the Rsbuild configuration by using the `defineBuildConfig(options)` function:

```ts rsbuild.build.ts
import { defineBuildConfig } from "@workleap/rsbuild-configs";

export default defineBuildConfig();
```

## Use predefined options

The `defineBuildConfig(options)` function can be used as shown in the previous examples, however, if you wish to customize the default configuration, the function also accept a few predefined options to help with that 👇

### `entry`

- **Type**: `RsbuildEntry`
- **Default**: `{ index: "./src/index.tsx" }`

Set Rsbuild [source.entry](https://rsbuild.dev/config/source/entry) option.

```ts !#5 rsbuild.build.ts
import { defineBuildConfig } from "@workleap/rsbuild-configs";

export default defineBuildConfig({
    entry: {
        index: "./src/another-entry.tsx"
    }
});
```

### `distPath`

> This option is the Rsbuild equivalent of webpack [outputPath](../webpack/configure-build.md#outputpath) option.

- **Type**: `string`
- **Default**: `dist`

Set Rsbuild [output.distPath](https://rsbuild.dev/config/output/dist-path) option.

```ts !#8 rsbuild.build.ts
import { defineBuildConfig } from "@workleap/rsbuild-configs";
import path from "node:path";

export default defineBuildConfig({
    distPath: path.resolve("./a-custom-folder")
});
```

### `assetPrefix`

> This option is the Rsbuild equivalent of webpack [publicPath](../webpack/configure-dev.md#publicpath) option.

- **Type**: `string`
- **Default**: `/`

Set Rsbuild [output.assetPrefix](https://rsbuild.dev/config/output/asset-prefix) option. Only set this option if the application is not deployed under the root path of the domain.

```ts !#4 rsbuild.build.ts
import { defineBuildConfig } from "@workleap/rsbuild-configs";

export default defineBuildConfig({
    assetPrefix: "/app/"
});
```

### `plugins`

- **Type**: An array of Rsbuild [plugin instances](https://rsbuild.dev/plugins/list/index)
- **Default**: `[]`

Append the provided Rsbuild plugins to the configuration.

```ts !#5 rsbuild.build.ts
import { defineBuildConfig } from "@workleap/rsbuild-configs";
import { pluginAssetsRetry } from "@rsbuild/plugin-assets-retry";

export default defineBuildConfig({
    plugins: [pluginAssetsRetry()]
});
```

### `html`

- **Type**: `false` or `(defaultOptions: HtmlConfig) => HtmlConfig`
- **Default**: `defaultOptions => defaultOptions`

By default, Rsbuild will attempt to load an HTML template from the `public/index.html` file. To use Rsbuild's built-in HTML template instead, set the option to `false`.

```ts !#4 rsbuild.build.ts
import { defineBuildConfig } from "@workleap/rsbuild-configs";

export default defineBuildConfig({
    html: false
});
```

To customize the default [HTML template](https://rsbuild.dev/guide/basic/html-template) configuration, provide a function extending the default options.

```ts !#5-10 rsbuild.build.ts
import { defineBuildConfig } from "@workleap/rsbuild-configs";
import path from "node:path";

export default defineBuildConfig({
    html: defaultOptions => {
        return {
            ...defaultOptions,
            template: path.resolve("./my-custom-index.html"),
        };
    }
});
```

### `minify`

- **Type**: `false` or an object literal accepting any [minify options](https://rsbuild.dev/config/output/minify).
- **Default**: `true`

Whether or not to minify the code. To disable code minification, set the option to `false`.

```ts !#4 rsbuild.build.ts
import { defineBuildConfig } from "@workleap/rsbuild-configs";

export default defineBuildConfig({
    minify: false
});
```

To customize the minimizer [configuration](https://rsbuild.dev/config/output/minify), provide an object literal.

```ts !#4-6 rsbuild.build.ts
import { defineBuildConfig } from "@workleap/rsbuild-configs";

export default defineBuildConfig({
    minify: {
        css: false
    }
});
```

### `optimize`

- **Type**: `boolean` | `"readable"`
- **Default**: `true`

Whether or not to enable Rsbuild production code [optimization](https://rspack.dev/config/optimization). This option can be quite useful when debugging an issue with Rsbuild bundling.

When `false` is provided, most of the optimizations, including minification will be turned off:

```ts !#4 rsbuild.build.ts
import { defineBuildConfig } from "@workleap/rsbuild-configs";

export default defineBuildConfig({
    optimize: false
});
```

When `readable` is provided, most of the optimizations will still be applied but the outputed bundles will be easier to read:

```ts !#4 rsbuild.build.ts
import { defineBuildConfig } from "@workleap/rsbuild-configs";

export default defineBuildConfig({
    optimize: "readable"
});
```

### `sourceMap`

- **Type**: `false` or an object literal accepting any [output.sourceMap](https://rsbuild.dev/config/output/source-map) options.
- **Default**: `{ js: "source-map", css: true }`

Whether or not to generate [source maps](https://rsbuild.dev/config/output/source-map). To disable source map, set the option to `false`. 

```ts !#4 rsbuild.build.ts
import { defineBuildConfig } from "@workleap/rsbuild-configs";

export default defineBuildConfig({
    sourceMap: false
});
```

To customize the source map [configuration](https://rsbuild.dev/config/output/source-map), provide an object literal.

```ts !#4-6 rsbuild.build.ts
import { defineBuildConfig } from "@workleap/rsbuild-configs";

export default defineBuildConfig({
    sourceMap: {
        css: false
    }
});
```

### `react`

- **Type**: `false` or `(defaultOptions: PluginReactOptions) => PluginReactOptions`
- **Default**: `defaultOptions => defaultOptions`

Whether or not to transform React code. To disable React code transformation, set the option to `false`.

```ts !#4 rsbuild.build.ts
import { defineBuildConfig } from "@workleap/rsbuild-configs";

export default defineBuildConfig({
    react: false
});
```

To customize [plugin-react](https://rsbuild.dev/plugins/list/plugin-react), provide a function to extend the default options.

```ts !#4-12 rsbuild.build.ts
import { defineBuildConfig } from "@workleap/rsbuild-configs";

export default defineBuildConfig({
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

```ts !#4 rsbuild.build.ts
import { defineBuildConfig } from "@workleap/rsbuild-configs";

export default defineBuildConfig({
    svgr: false
});
```

To customize [plugin-svgr](https://rsbuild.dev/plugins/list/plugin-svgr), provide a function extending the default options.

```ts !#4-13 rsbuild.build.ts
import { defineBuildConfig } from "@workleap/rsbuild-configs";

export default defineBuildConfig({
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

When you reference an SVG asset in TypeScript code, TypeScript may prompt that the module is missing a type definition:

```bash
TS2307: Cannot find module './logo.svg' or its corresponding type declarations.
```

To fix this, you need to add type declaration for the SVG assets, create a `src/env.d.ts` file, and add the type declaration.

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

### `compressImage`

- **Type**: `false` or `(defaultOptions: PluginImageCompressOptions) => PluginImageCompressOptions`
- **Default**: `defaultOptions => defaultOptions`

Whether or not to compress images with [plugin-image-compress](https://github.com/rspack-contrib/rsbuild-plugin-image-compress). To disable image compression, set the option to `false`.

```ts !#4 rsbuild.build.ts
import { defineBuildConfig } from "@workleap/rsbuild-configs";

export default defineBuildConfig({
    compressImage: false
});
```

To customize [plugin-image-compress](https://github.com/rspack-contrib/rsbuild-plugin-image-compress), provide a function extending the default options.

```ts !#4-9 rsbuild.build.ts
import { defineBuildConfig } from "@workleap/rsbuild-configs";

export default defineBuildConfig({
    compressImage: defaultOptions => {
        return [
            ...defaultOptions,
            "pngLossless"
        ];
    }
});
```

### `verbose`

- **Type**: `boolean`
- **Default**: `false`

Start the Rsbuild process with verbose logging turned on.

```ts !#4 rsbuild.build.ts
import { defineBuildConfig } from "@workleap/rsbuild-configs";

export default defineBuildConfig({
    verbose: true
});
```

## Configuration transformers

!!!warning
We do not guarantee that your configuration transformers won't break after an update. It's your responsibility to keep them up to date with new releases.
!!!

The [predefined options](#use-predefined-options) are useful to quickly customize the [default build configuration](https://github.com/workleap/wl-web-configs/blob/main/packages/rsbuild-configs/src/build.ts) of `@workleap/rsbuild-configs`, but only covers a subset of an [Rsbuild configuration](https://rsbuild.dev/config/index). If you need full control over the configuration, you can provide configuration transformer functions through the `transformers` option of the `defineBuildConfig` function. Remember, **no locked in** :heart::v:.

To view the default build configuration of `@workleap/rsbuild-configs`, have a look at the [build.ts configuration file](https://github.com/workleap/wl-web-configs/blob/main/packages/rsbuild-configs/src/build.ts) on GitHub.

### `transformers`

- **Type**: `((config: RsbuildConfig, context: RsbuildConfigTransformerContext) => RsbuildConfig)[]`
- **Default**: `[]`

```ts
transformer(config: RsbuildConfig, context: RsbuildConfigTransformerContext) => RsbuildConfig
```

```ts !#4-11,17 rsbuild.build.ts
import { defineBuildConfig, type RsbuildConfigTransformer } from "@workleap/rsbuild-configs";
import type { RsbuildConfig } from "@rsbuild/core";

const forceNamedChunkIdsTransformer: RsbuildConfigTransformer = (config: RsbuildConfig) => {
    config.output = {
        ...(config.output ?? {}),
        filename: "[name].[contenthash].bundle.js"
    };

    return config;
};

export default defineBuildConfig({
    transformers: [forceNamedChunkIdsTransformer]
});
```

### Execution context

Generic transformers can use the `context` parameter to gather additional information about their execution context, like the `environment` they are operating in.

```ts !#5 transformer.ts
import type { RsbuildConfigTransformer } from "@workleap/rsbuild-configs";
import type { RsbuildConfig } from "@rsbuild/core";

export const transformer: RsbuildConfigTransformer = (config: RsbuildConfig) => {
    if (context.environment === "build") {
        config.output = {
            ...(config.output ?? {}),
            filename: "[name].[contenthash].bundle.js"
        };
    }

    return config;
}
```

- `environment`: `"dev" | "build" | "storybook"`
- `verbose`: `boolean`

## Add a CLI script

To create the bundle files for production, add the following script to the project `package.json` file:

```json package.json
{
    "build": "rsbuild build --config rsbuild.build.ts"
}
```

## Use environment variables

### cross-env

We recommend instead to define environment variables using [cross-env](https://github.com/kentcdodds/cross-env). With `cross-env`, the environment variables will be made available to any Node.js files that are executed by the script process (`build` in the example below :point_down:):

```json package.json
{
    "build": "cross-env DEBUG=true rsbuild build --config rsbuild.build.ts"
}
```

```ts !#3 rsbuild.build.ts
import { defineBuildConfig } from "@workleap/rsbuild-configs";

if (process.env.DEBUG) {
    console.log("Configuring Rsbuild in debug mode!");
}

export default defineBuildConfig();
```

However, there's a catch. When using `cross-env`, the variables will not be available in the application files because `cross-env` only makes them available to files that are executed by the process at **build time** while the application files are executed at **runtime** by a browser.

To make them accessible to the application files, Rsbuild must be aware of those environment variables and **render** them into the **compiled application files**. This is the purpose of the `environmentVariables` option.

### `environmentVariables`

- **Type**: `Record<string, unknown>`
- **Default**: `{}`

First, define the variables with `environmentVariables`:

```ts !#4-6 rsbuild.build.ts
import { defineBuildConfig } from "@workleap/rsbuild-configs";

export default defineBuildConfig({
    environmentVariables: {
        "DEBUG": process.env.DEBUG === "true"
    }
});
```

Then, use the variables in any application files:

```tsx !#2 src/App.tsx
export function App() {
    if (process.env.DEBUG) {
        console.log("The application has been bootstrapped in debug!");
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

## CSS modules typings

When CSS Modules are imported from TypeScript code, TypeScript may prompt that the module is missing a type definition:

```bash
TS2307: Cannot find module './index.module.css' or its corresponding type declarations.
```

To fix this, add a type declaration file for the CSS Modules, by creating a `src/env.d.ts` file, and adding the corresponding type declaration.

```ts env.d.ts
/// <reference types="@rsbuild/core/types" />
```

### Monorepo

If the solution is a monorepo, ensure that projects referencing the packages that include CSS Modules, also include the necessary type definitions

For example, given the following structure:

``` !#3,7
workspace
├── app
├──── tsconfig.ts
├── packages
├──── components
├────── src
├───────── Button.tsx
├───────── Button.module.css
├───────── env.d.ts
├───────── tsconfig.ts
├── package.json
```

Copy the CSS Modules typings into the `app` web application own `env.d.ts` file, or include the `components` package's typings into the `apps` web application `tsconfig.ts` configuration file:

```json !#5 app/tsconfig.ts
{
    "extends": "@workleap/typescript-configs/web-application.json",
    "include": [
        ".",
        "../**/src/env.d.ts"
    ],
    "exclude": ["public", "dist", "node_modules"]
}
```

!!!info
For additional information about CSS modules type declaration, refer to the Rsbuild [documentation](https://rsbuild.dev/guide/basic/css-modules#type-declaration).
!!!

## Try it :rocket:

To test the new Rsbuild configuration, open a terminal at the root of the project and execute the [CLI script added earlier](#add-a-cli-script). The build process should complete without outputting any error in the terminal and the bundle files should be available in the `/dist` folder (or any other `distPath` you configured).
