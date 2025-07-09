---
order: 70
label: Transformer utilities
meta:
    title: Transformer utilities - webpack
toc:
    depth: 2-3
---

# Transformer utilities

!!!warning
`@workleap/webpack-configs` is now in maintenance mode. If you're starting a new project, consider using [@workleap/rsbuild-configs](../rsbuild/getting-started.md) instead for better performance and modern tooling.
!!!

!!!warning
We do not guarantee that your configuration transformers won't break after an update. It's your responsibility to keep them up to date with new releases.
!!!

To help you write configuration transformers for [webpack](https://webpack.js.org/), `@workleap/webpack-configs` provide a suite of utility functions. 

## Module rules

Utility functions for webpack [module rules](https://webpack.js.org/configuration/module/#modulerules).

### matchLoaderName

Returns a **matcher function** that can be utilized alongside module rules utility functions. The returned matcher function will return `true` when it encounters a module rule with a loader **matching** the provided **name** value.

```ts
const matcher = matchLoaderName(name: string)
```

#### Parameters

- `name`: A module rule loader `name` value.

#### Returns

A `ModuleRuleMatcher` function.

#### Usage

```js !#6 webpack.config.js
export default {
    module: {
        rules: [
            {
                test: /\.(js|jsx|ts|tsx)/i,
                loader: "swc-loader"
            }
        ]
    }
}
```

```ts transformer.ts
import { matchLoaderName } from "@workleap/webpack-configs";

const matcher = matchLoaderName("swc-loader");
```

### matchAssetModuleType

Returns a **matcher function** that can be utilized alongside module rules utility functions. The returned matcher function will return `true` when it encounters a module rule with a loader **matching** the provided **asset type** value.

```ts
const matcher = matchAssetModuleType(type: AssetModuleType)
```

#### Parameters

- `type`: A module rule loader [asset type](https://webpack.js.org/guides/asset-modules/#root) value.

#### Returns

A `ModuleRuleMatcher` function.

#### Usage

```js !#6 webpack.config.js
export default {
    module: {
        rules: [
            {
                test: /\.(png|jpe?g|gif)/i,
                type: "asset/resource"
            }
        ]
    }
}
```

```ts transformer.ts
import { matchAssetModuleType } from "@workleap/webpack-configs";

const matcher = matchAssetModuleType("asset/resource");
```

### matchTest

Returns a **matcher function** that can be utilized alongside module rules utility functions. The returned matcher function will return `true` when it encounters a module rule with a loader **matching** the provided **test** value.

```ts
const matcher = matchTest(test: string | RegExp)
```

#### Parameters

- `test`: A module rule loader `test` value.

#### Returns

A `ModuleRuleMatcher` function.

#### Usage

```js !#5 webpack.config.js
export default {
    module: {
        rules: [
            {
                test: /\.css/i,
                use: ["style-loader", "css-loader"]
            }
        ]
    }
}
```

```ts transformer.ts
import { matchTest } from "@workleap/webpack-configs";

const matcher = matchTest(/\.css/i);
```

### findModuleRule

Retrieve the **first** module rule for which the matcher function returns true. If there is more than one match, an error will be thrown.

```ts
const moduleRule = findModuleRule(config: WebpackConfig, matcher: ModuleRuleMatcher)
```

#### Parameters

- `config`: A webpack config
- `matcher`: A `ModuleRuleMatcher` function

#### Returns

A module rule if a match has been found, otherwise `undefined`.

#### Usage

```ts !#4 transformer.ts
import { matchAssetModuleType, findModuleRule, type WebpackConfig } from "@workleap/webpack-configs";

function transformer(config: WebpackConfig) {
    const moduleRule = findModuleRule(config, matchLoaderName("swc-loader"));

    // Update the module rule...
    moduleRule.options.parseMap = true;

    return config;
}
```

### findModuleRules

Retrieve **any** module rules for which the matcher function returns true.

```ts
const moduleRules = findModuleRules(config: WebpackConfig, matcher: ModuleRuleMatcher)
```

#### Parameters

- `config`: A webpack config
- `matcher`: A `ModuleRuleMatcher` function

#### Returns

An array of module rules

#### Usage

```ts !#4 transformer.ts
import { matchAssetModuleType, findModuleRules, type WebpackConfig } from "@workleap/webpack-configs";

function transformer(config: WebpackConfig) {
    const moduleRules = findModuleRules(config, matchLoaderName("swc-loader"));

    // Update the module rules...
    moduleRules.forEach(x => {
        x.options.parseMap = true;
    });

    return config;
}
```

### addBeforeModuleRule

Add the provided module rules **before** the matching module rule. If no matching rule has been found, an error will be thrown.

```ts
addBeforeModuleRule(config: WebpackConfig, matcher: ModuleRuleMatcher, newModuleRules: RuleSetRule[] | RuleSetUseItem[]);
```

#### Parameters

- `config`: A webpack config
- `matcher`: A `ModuleRuleMatcher` function
- `newModuleRules`: An array of module rules

#### Returns

Nothing

#### Usage

```ts !#10 transformer.ts
import { matchAssetModuleType, addBeforeModuleRule, type WebpackConfig } from "@workleap/webpack-configs";
import type { RuleSetRule } from "webpack";

function transformer(config: WebpackConfig) {
    const swcModuleRule: RuleSetRule = {
        test: /\.(ts|tsx)/i,
        loader: "swc-loader"
    };

    addBeforeModuleRule(config, matchLoaderName("css-loader"), [swcModuleRule]);

    return config;
}
```

### addAfterModuleRule

Add the provided module rules **after** the matching module rule. If no matching rule has been found, an error will be thrown.

```ts
addAfterModuleRule(config: WebpackConfig, matcher: ModuleRuleMatcher, newModuleRules: RuleSetRule[] | RuleSetUseItem[]);
```

#### Parameters

- `config`: A webpack config
- `matcher`: A `ModuleRuleMatcher` function
- `newModuleRules`: An array of module rules

#### Returns

Nothing

#### Usage

```ts !#9 transformer.ts
import { matchAssetModuleType, addAfterModuleRule, type WebpackConfig } from "@workleap/webpack-configs";

function transformer(config: WebpackConfig) {
    const swcModuleRule: RuleSetRule = {
        test: /\.(ts|tsx)/i,
        loader: "swc-loader"
    };

    addAfterModuleRule(config, matchLoaderName("css-loader"), [swcModuleRule]);

    return config;
}
```

### replaceModuleRule

Replace the matching module rule by the new one. If no matching rule has been found, an error will be thrown.

```ts
replaceModuleRule(config: WebpackConfig, matcher: ModuleRuleMatcher, newModuleRule: RuleSetRule | RuleSetUseItem)
```

#### Parameters

- `config`: A webpack config
- `matcher`: A `ModuleRuleMatcher` function
- `newModuleRule`: The new module rule

#### Returns

Nothing

#### Usage

```ts !#9 transformer.ts
import { matchAssetModuleType, replaceModuleRule, type WebpackConfig } from "@workleap/webpack-configs";

function transformer(config: WebpackConfig) {
    const swcModuleRule: RuleSetRule = {
        test: /\.(ts|tsx)/i,
        loader: "swc-loader"
    };

    replaceModuleRule(config, matchLoaderName("babel-loader"), swcModuleRule);

    return config;
}
```

### removeModuleRules

Remove the matching module rules. If no matching rule has been found, an error will be thrown.

```ts
removeModuleRules(config: WebpackConfig, matcher: ModuleRuleMatcher)
```

#### Parameters

- `config`: A webpack config
- `matcher`: A `ModuleRuleMatcher` function

#### Returns

Nothing

#### Usage

```ts !#4 transformer.ts
import { matchAssetModuleType, removeModuleRules, type WebpackConfig } from "@workleap/webpack-configs";

function transformer(config: WebpackConfig) {
    removeModuleRules(config, matchLoaderName("babel-loader"));

    return config;
}
```

## Plugins

Utility functions for webpack [plugins](https://webpack.js.org/configuration/plugins/).

### matchConstructorName

Returns a **matcher function** that can be utilized alongside plugin utility functions. The returned matcher function will return `true` when it encounters a plugin **matching** the provided **constructor name** value.

```ts
const matcher = matchConstructorName(name: string)
```

#### Parameters

- `name`: A plugin constructor name.

#### Returns

A `PluginMatcher` function.

#### Usage

```ts transformer.ts
import { matchConstructorName } from "@workleap/webpack-configs";
import HtmlWebpackPlugin from "html-webpack-plugin";

const matcher = matchConstructorName(HtmlWebpackPlugin.name);
```

### findPlugin

Retrieve the **first** plugin for which the matcher function returns true. If there is more than one match, an error will be thrown.

```ts
const plugin = findPlugin(config: WebpackConfig, matcher: PluginMatcher)
```

#### Parameters

- `config`: A webpack config
- `matcher`: A `PluginMatcher` function

#### Returns

A plugin if a match has been found, otherwise `undefined`.

#### Usage

```ts !#5 transformer.ts
import { matchConstructorName, findPlugin, type WebpackConfig } from "@workleap/webpack-configs";
import HtmlWebpackPlugin from "html-webpack-plugin";

function transformer(config: WebpackConfig) {
    const plugin = findPlugin(config, matchConstructorName(HtmlWebpackPlugin.name));

    // Do something with the plugin...

    return config;
}
```

### addBeforePlugin

Add the provided plugins **before** the matching plugin. If no plugin has been found, an error will be thrown.

```ts
addBeforePlugin(config: WebpackConfig, matcher: PluginMatcher, newPlugins: WebpackPlugin[])
```

#### Parameters

- `config`: A webpack config
- `matcher`: A `PluginMatcher` function
- `newPlugins`: An array of plugins

#### Returns

Nothing

#### Usage

```ts !#11 transformer.ts
import { matchConstructorName, addBeforePlugin, type WebpackConfig } from "@workleap/webpack-configs";
import CircularDependencyPlugin from "circular-dependency-plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";

function transformer(config: WebpackConfig) {
    const newPlugin = new CircularDependencyPlugin({
        exclude: /node_modules/,
        include: /src/
    });

    addBeforePlugin(config, matchConstructorName(HtmlWebpackPlugin.name), [newPlugin]);

    return config;
}
```

### addAfterPlugin

Add the provided plugins **after** the matching plugin. If no plugin has been found, an error will be thrown.

```ts
addAfterPlugin(config: WebpackConfig, matcher: PluginMatcher, newPlugins: WebpackPlugin[])
```

#### Parameters

- `config`: A webpack config
- `matcher`: A `PluginMatcher` function
- `newPlugins`: An array of plugins

#### Returns

Nothing

#### Usage

```ts !#11 transformer.ts
import { matchConstructorName, addAfterPlugin, type WebpackConfig } from "@workleap/webpack-configs";
import CircularDependencyPlugin from "circular-dependency-plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";

function transformer(config: WebpackConfig) {
    const newPlugin = new CircularDependencyPlugin({
        exclude: /node_modules/,
        include: /src/
    });

    addAfterPlugin(config, matchConstructorName(HtmlWebpackPlugin.name), [newPlugin]);

    return config;
}
```

### replacePlugin

Replace the matching plugin by the new one. If no plugin has been found, an error will be thrown.

```ts
replacePlugin(config: WebpackConfig, matcher: PluginMatcher, newPlugin: WebpackPlugin)
```

#### Parameters

- `config`: A webpack config
- `matcher`: A `PluginMatcher` function
- `newPlugin`: The new plugin instance

#### Returns

Nothing

#### Usage

```ts !#11 transformer.ts
import { matchConstructorName, replacePlugin, type WebpackConfig } from "@workleap/webpack-configs";
import HtmlWebpackPlugin from "html-webpack-plugin";

function transformer(config: WebpackConfig) {
    const newPlugin = new HtmlWebpackPlugin({
        template: path.resolve("./my-custom-index.html"),
        minify: true,
        hash: true
    });

    replacePlugin(config, matchConstructorName(HtmlWebpackPlugin.name));

    return config;
}
```

### removePlugin

Remove the matching plugin. If no plugin has been found, an error will be thrown.

```ts
removePlugin(config: WebpackConfig, matcher: PluginMatcher)
```

#### Parameters

- `config`: A webpack config
- `matcher`: A `PluginMatcher` function

#### Returns

Nothing

#### Usage

```ts !#5 transformer.ts
import { matchConstructorName, removePlugin, type WebpackConfig } from "@workleap/webpack-configs";
import HtmlWebpackPlugin from "html-webpack-plugin";

function transformer(config: WebpackConfig) {
    removePlugin(config, matchConstructorName(HtmlWebpackPlugin.name));

    return config;
}
```
