---
order: 90
label: Configure for build
meta:
    title: Configure for build - Rslib
toc:
    depth: 2-3
---

# Configure for build

To configure [Rslib](https://lib.rsbuild.dev) for publication, execute the following steps :point_down:

## Install the packages

Open a terminal at the root of the library project and install the following packages:

```bash
pnpm add -D @workleap/rslib-configs @rslib/core @rsbuild/core
```

## Configure Rslib

### Publish source code files

First, update the project `package.json` file to ensure the source files are included in the published package:

```json !#3 package.json
{
    "files": [
        "src",
        "dist",
        "CHANGELOG.md",
        "README.md"
    ]
}
```

!!!tip
The `defineBuildConfig` function generates source maps for the library code by default. To enable debugging with the original source code, the published package must include the source code files.
!!!

### `tsconfig.build.json`

Then, create a `tsconfig.build.json` file at the root of the project:

``` !#6
library-project
├── src
├──── ...
├── package.json
├── tsconfig.json
├── tsconfig.build.json
```

Then, open the newly created `tsconfig.build.json` file and copy/paste the following content:

```json !#3 tsconfig.build.json
{
    "extends": "@workleap/typescript-configs/library.json",
    "include": ["src"],
    "exclude": ["dist", "node_modules"]
}
```

!!!tip
`@workleap/rslib-config` is configured by default to produce [bundleless](https://lib.rsbuild.dev/guide/basic/output-structure#bundle--bundleless) output. Rslib's bundleless mode expects the `include` option in the TypeScript configuration file to point to the project’s source files folder. If the project's source files are not located in the `src` folder, update the provided configuration sample to target the correct source folder.
!!!

### `rslib.build.ts`

Next, create a configuration file named `rslib.build.ts` at the root of the project:

``` !#7
library-project
├── src
├──── ...
├── package.json
├── tsconfig.json
├── tsconfig.build.json
├── rslib.build.ts
```

Then, open the newly created file and export the Rslib configuration by using the `defineBuildConfig(options)` function:

```ts rslib.build.ts
import { defineBuildConfig } from "@workleap/rslib-configs";

export default defineBuildConfig();
```

## Use predefined options

The `defineBuildConfig(options)` function can be used as shown in the previous example, however, if you wish to customize the default configuration, the function also accept a few predefined options to help with that 👇

### `entry`

- **Type**: An object literal accepting any [source.entry](https://rsbuild.dev/config/source/entry) options.
- **Default**: `{ index: "./src/**" }` when the [bundle](https://lib.rsbuild.dev/config/lib/bundle) option is `false`, otherwise `{ index: ["./src/index.ts", "./src/index.js"] }`.

Set Rslib [source.entry](https://rsbuild.dev/config/source/entry) option.

```ts !#5 rslib.build.ts
import { defineBuildConfig } from "@workleap/rslib-configs";

export default defineBuildConfig({
    entry: {
        index: "./src/another-entry.tsx"
    }
});
```

### `syntax`

- **Type**: `string`
- **Default**: `esnext`

Set Rslib [lib.syntax](https://lib.rsbuild.dev/config/lib/syntax) option.

```ts !#4 rslib.build.ts
import { defineBuildConfig } from "@workleap/rslib-configs";

export default defineBuildConfig({
    syntax: "es2024"
});
```

### `bundle`

- **Type**: `boolean`
- **Default**: `false`

Whether or not to ouput a single code [bundle](https://lib.rsbuild.dev/config/lib/bundle). To output a single code bundle, set the option to `true`.

```ts !#4 rslib.build.ts
import { defineBuildConfig } from "@workleap/rslib-configs";

export default defineBuildConfig({
    bundle: true
});
```

!!!tip
Tree-shaking is most effective when bundlers can exclude entire files from the final bundle. However, when the `bundle` option is set to `true`, bundlers must perform tree-shaking within individual files by removing unused parts. While most modern bundlers support this, it's generally better to follow the lowest common denominator approach by opting for a [bundleless](https://lib.rsbuild.dev/guide/basic/output-structure#bundle--bundleless) output, to produce the most predictable results and not bundling unnecessary code.

For more details on the differences between bundled and bundleless output, refer to the [documentation](https://lib.rsbuild.dev/guide/basic/output-structure#bundle--bundleless).
!!!

### `tsconfigPath`

- **Type**: `string`
- **Default**: `undefined`

Set Rslib [source.tsconfigPath](https://rsbuild.dev/config/source/tsconfig-path) option. When the `bundle` option is set to `false` (default value), the `tsconfigPath` option is required.

```ts !#4 rslib.build.ts
import { defineBuildConfig } from "@workleap/rslib-configs";

export default defineBuildConfig({
    tsconfigPath: path.resolve("./tsconfig.build.json")
});
```

### `dts`

- **Type**: An object literal accepting any [lib.dts](https://lib.rsbuild.dev/config/lib/dts) options.
- **Default**: `true`

Whether or not to generate TypeScript [*.d.ts](https://lib.rsbuild.dev/config/lib/dts) files. To disable the generation of `*.d.ts` files, set the option to `false`.

```ts !#4 rslib.build.ts
import { defineBuildConfig } from "@workleap/rslib-configs";

export default defineBuildConfig({
    dts: false
});
```

### `target`

- **Type**: `string`
- **Default**: `web`

Set Rslib [output.target](https://rsbuild.dev/config/output/target) option.

```ts !#4 rslib.build.ts
import { defineBuildConfig } from "@workleap/rslib-configs";

export default defineBuildConfig({
    target: "node"
});
```

### `distPath`

- **Type**: `string`
- **Default**: `dist`

Set Rsbuild [output.distPath](https://rsbuild.dev/config/output/dist-path) option.

```ts !#5 rslib.build.ts
import { defineBuildConfig } from "@workleap/rslib-configs";
import path from "node:path";

export default defineBuildConfig({
    distPath: path.resolve("./a-custom-folder")
});
```

### `plugins`

- **Type**: An array of Rsbuild [plugin instances](https://rsbuild.dev/plugins/list/index)
- **Default**: `[]`

Append the provided Rsbuild plugins to the configuration.

```ts !#5 rslib.build.ts
import { defineBuildConfig } from "@workleap/rslib-configs";
import { pluginAssetsRetry } from "@rsbuild/plugin-assets-retry";

export default defineBuildConfig({
    plugins: [pluginAssetsRetry()]
});
```

### `sourceMap`

- **Type**: `false` or an object literal accepting any [output.sourceMap](https://rsbuild.dev/config/output/source-map) options.
- **Default**: `{ js: "source-map", css: true }`

Whether or not to generate [source maps](https://rsbuild.dev/config/output/source-map). To disable source map, set the option to `false`. 

```ts !#4 rslib.build.ts
import { defineBuildConfig } from "@workleap/rslib-configs";

export default defineBuildConfig({
    sourceMap: false
});
```

To customize the source map [configuration](https://rsbuild.dev/config/output/source-map), provide an object literal.

```ts !#4-6 rslib.build.ts
import { defineBuildConfig } from "@workleap/rslib-configs";

export default defineBuildConfig({
    sourceMap: {
        css: false
    }
});
```

### `react`

- **Type**: `true` or `(defaultOptions: PluginReactOptions) => PluginReactOptions`
- **Default**: `defaultOptions => defaultOptions`

Whether or not to transform React code. To enable React code transformation, set the option to `true`.

```ts !#4 rslib.build.ts
import { defineBuildConfig } from "@workleap/rslib-configs";

export default defineBuildConfig({
    react: true
});
```

To customize [plugin-react](https://rsbuild.dev/plugins/list/plugin-react), provide a function to extend the default options.

```ts !#4-12 rslib.build.ts
import { defineBuildConfig } from "@workleap/rslib-configs";

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

- **Type**: `true` or `(defaultOptions: PluginSvgrOptions) => PluginSvgrOptions`
- **Default**: `defaultOptions => defaultOptions`

Whether or not to handle `.svg` files with [plugin-svgr](https://rsbuild.dev/plugins/list/plugin-svgr). To enable SVGR transformation, set the option to `true`. When this option is not activated, the `.svg` files will be handled by the `asset/resource` rule.

```ts !#4 rslib.build.ts
import { defineBuildConfig } from "@workleap/rslib-configs";

export default defineBuildConfig({
    svgr: false
});
```

To customize the [plugin-svgr](https://rsbuild.dev/plugins/list/plugin-svgr), provide a function extending the default options.

```ts !#4-13 rslib.build.ts
import { defineBuildConfig } from "@workleap/rslib-configs";

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

The [predefined options](#use-predefined-options) are useful to quickly customize the [default build configuration](https://github.com/workleap/wl-web-configs/blob/main/packages/rslib-configs/src/build.ts) of `@workleap/rslib-configs`, but only covers a subset of an [Rslib configuration](https://lib.rsbuild.dev/config/index). If you need full control over the configuration, you can provide configuration transformer functions through the `transformers` option of the `defineBuildConfig` function. Remember, **no locked in** :heart::v:.

To view the default build configuration of `@workleap/rslib-configs`, have a look at the [build.ts configuration file](https://github.com/workleap/wl-web-configs/blob/main/packages/rslib-configs/src/build.ts) on GitHub.

### `transformers`

- **Type**: `((config: RslibConfig, context: RslibConfigTransformerContext) => RslibConfig)[]`
- **Default**: `[]`

```ts
transformer(config: RslibConfig, context: RslibConfigTransformerContext) => RslibConfig
```

```ts !#4-14,17 rslib.build.ts
import { defineBuildConfig, type RslibConfigTransformer } from "@workleap/rslib-configs";
import type { RslibConfig } from "@rslib/core";

const forceNamedChunkIdsTransformer: RslibConfigTransformer = (config: RslibConfig) => {
    config.tools = config.tools ?? {};
    config.tools.rspack = config.tools.rspack ?? {};

    config.tools.rspack.optimization = {
        ...(config.tools.rspack.optimization ?? {}),
        chunkIds: "named"
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
import type { RslibConfigTransformer } from "@workleap/rslib-configs";
import type { RslibConfig } from "@rslib/core";

export const transformer: RslibConfigTransformer = (config: RslibConfig) => {
    if (context.environment === "build") {
        config.tools = config.tools ?? {};
        config.tools.rspack = config.tools.rspack ?? {};

        config.tools.rspack.optimization = {
            ...(config.tools.rspack.optimization ?? {}),
            chunkIds: "named"
        };
    }

    return config;
}
```

- `environment`: `"dev" | "build" | "storybook"`

## Add a CLI script

To create the bundle files for publication, add the following script to the project `package.json` file:

```json package.json
{
    "build": "rslib build -c rslib.build.ts"
}
```

## CSS modules typings

When CSS Modules are imported from TypeScript code, TypeScript may prompt that the module is missing a type definition:

```bash
TS2307: Cannot find module './index.module.css' or its corresponding type declarations.
```

To fix this, add a type declaration file for the CSS Modules, by creating a `src/env.d.ts` file, and adding the corresponding type declaration.

```ts env.d.ts
/// <reference types="@rsbuild/core/types" />
```

!!!info
Yes, reference types from `@rsbuild/core`, it's not a typo.
!!!

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

!!!tip
For additional information about CSS modules type declaration, refer to the Rslib/Rsbuild [documentation](https://rsbuild.dev/guide/basic/css-modules#type-declaration).
!!!

## Try it :rocket:

To test the new Rslib configuration, open a terminal at the root of the project and execute the [CLI script added earlier](#add-a-cli-script). The build process should complete without outputting any error in the terminal and the outputted files should be available in the `/dist` folder (or any other `distPath` you configured).
