---
label: Configure a project
meta:
    title: Configure a project - PostCSS
toc:
    depth: 2-3
---

# Configure a project

!!!warning
`@workleap/postcss-configs` is now in maintenance mode. If you're starting a new project, consider using [@workleap/rsbuild-configs](../rsbuild/getting-started.md) instead of [@workleap/webpack-configs](../webpack/getting-started.md), which eliminates the need for PostCSS.
!!!

Execute the following steps to setup [PostCSS](https://postcss.org/) for a single project :point_down:

## Install the packages

Open a terminal at the root of the project and install the following packages:

```bash
pnpm add -D @workleap/postcss-configs postcss
```

## Configure PostCSS

First, create a configuration file named `postcss.config.ts` at the root of the project:

``` !#5
project
├── src
├──── ...
├── package.json
├── postcss.config.ts
```

Then, open the newly created file and `export` the PostCSS configuration by using the `defineConfig(options)` function:

```ts !#3 postcss.config.ts
import { defineConfig } from "@workleap/postcss-configs";

export default defineConfig();
```

## Use predefined options

The `defineConfig(options)` function can be used as-is as shown in the previous example, however, if you wish to customize the default configuration, the function also accepts a few predefined options to help with that :point_down:

### `browsers`

- **Type**: `string | string[]`
- **Default**: When available, will load the supported browser versions from the closest `.browserslistrc` file

Set `postcss-preset-env` [browsers option](https://github.com/csstools/postcss-plugins/tree/main/plugin-packs/postcss-preset-env#browsers).

```ts !#4 postcss.config.ts
import { defineConfig } from "@workleap/postcss-configs";

export default defineConfig({
    browsers: "> .5% and last 2 versions"
});
```

### `presetEnvOptions`

- **Type**: An object literal accepting any `postcss-preset-env` [option](https://github.com/csstools/postcss-plugins/tree/main/plugin-packs/postcss-preset-env#options)
- **Default**: `{ autoprefixer: { flexbox: "no-2009" }, stage: 3 }`

Forward the provided object literal to the [postcss-preset-env](https://github.com/csstools/postcss-plugins/tree/main/plugin-packs/postcss-preset-env) plugin.

```ts !#4-6 postcss.config.ts
import { defineConfig } from "@workleap/postcss-configs";

export default defineConfig({
    presetEnvOptions: {
        stage: 1
    }
});
```

#### Extends `presetEnvOptions` options

When provided, the `presetEnvOptions` option will override the default [postcss-preset-env](https://github.com/csstools/postcss-plugins/tree/main/plugin-packs/postcss-preset-env) plugin configuration. If you wish to **extend** the default configuration rather than overriding it, you can do so by importing the `DefaultPresetEnvOptions` object:

```ts !#5,7 postcss.config.ts
import { defineConfig, DefaultPresetEnvOptions } from "@workleap/postcss-configs";

export default defineConfig({
    presetEnvOptions: {
        ...DefaultPresetEnvOptions,
        autoprefixer: {
            ...DefaultPresetEnvOptions.autoprefixer,
            grid: true
        },
        debug: true
    }
});
```

## Configuration transformers

!!!warning
We do not guarantee that your configuration transformers won't break after an update. It's your responsibility to keep them up to date with new releases.
!!!

The [predefined options](#use-predefined-options) are useful to quickly customize the [default configuration](https://github.com/workleap/wl-web-configs/blob/main/packages/postcss-configs/src/index.ts) of `@workleap/postcss-configs`, but only covers a subset of a [PostCSS configuration](https://github.com/postcss/postcss-load-config). If you need full control over the configuration, you can provide **configuration transformer** functions through the `transformers` option of the `defineConfig` function. Remember, **no locked in** :heart::v:.

To view the default configuration of `@workleap/postcss-configs`, have a look at the [configuration file](https://github.com/workleap/wl-web-configs/blob/main/packages/postcss-configs/src/index) on GitHub.

### `transformers`

- **Type**: `((config: PostCSSConfig) => PostCSSConfig)[]`
- **Default**: `[]`

```ts
transformer(config: PostCSSConfig) => PostCSSConfig
```

```ts !#3-7,10 postcss.config.ts
import { defineConfig, type PostcssConfigTransformer, type PostCSSConfig } from "@workleap/postcss-configs";

const overrideBrowsers: PostcssConfigTransformer = (config: PostCSSConfig) => {
    config.browsers = "> .5% and last 2 versions";

    return config;
};

export default defineConfig({
    transformers: [overrideBrowsers]
});
```

#### Additional PostCSS plugins

Configuration transformer functions are ideal to configure additional [PostCSS plugins](https://www.postcss.parts/):

```ts !#11 postcss.config.ts
import { defineConfig, type PostcssConfigTransformer, type PostCSSConfig } from "@workleap/postcss-configs";
import tailwindcss from "tailwindcss";

const configureTailwind: PostcssConfigTransformer = (config: PostCSSConfig) => {
    config.plugins.push(tailwindcss)

    return config;
};

export default defineConfig({
    transformers: [configureTailwind]
});
```

## Configure webpack

!!!tip
If your project is using `@workleap/wepack-config`, you don't have to configure `postcss-loader` as the [defineDevConfig](../webpack/configure-dev.md#webpackdevjs) and [defineBuildConfig](../webpack/configure-build.md#webpackbuildjs) functions already takes care of configuring PostCSS.
!!!

To integrate with webpack, update your configuration file to include a [postcss-loader](https://www.npmjs.com/package/postcss-loader):

```js !#12 webpack.config.js
// @ts-check

export default {
    ...
    module: {
        rules: [
            {
                test: /\.css/i,
                use: [
                    "style-loader",
                    "css-loader",
                    "postcss-loader"
                ]
            }
        ]
    }
}
```

## Try it :rocket:

To test your new PostCSS configuration, create and import a CSS file with the following code:

```css example.css
.example {
    display: grid;
    transition: all .5s;
    user-select: none;
    background: linear-gradient(to bottom, white, black);
}
```

If you integrated PostCSS with webpack, execute your webpack build and find the outputted `.example` CSS class in the generated bundle files of your `dist` folder.

Otherwise, open a terminal at the root of your project and install [postcss-cli](https://github.com/postcss/postcss-cli):

```bash
pnpm add -D postcss-cli postcss
```

Then, process the file with `postcss-cli` by executing the following command in the same terminal:

```bash
npx postcss example.css -o out.css
```

Whether you processed the CSS with webpack or `postcss-cli`, most of the CSS properties in the `.example` CSS class should have been prefixed (it can vary based on your Browserslist configuration):

```css out.css
.example {
    display: -ms-grid;
    display: grid;
    -webkit-transition: all .5s;
    transition: all .5s;
    -webkit-user-select: none;
       -moz-user-select: none;
        -ms-user-select: none;
            user-select: none;
    background: -webkit-gradient(linear, left top, left bottom, from(white), to(black));
    background: linear-gradient(to bottom, white, black);
}
```
