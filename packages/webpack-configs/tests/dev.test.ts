import ReactRefreshWebpackPlugin from "@pmmmwh/react-refresh-webpack-plugin";
import type { Config as SwcConfig } from "@swc/core";
import { defineDevConfig as defineSwcConfig } from "@workleap/swc-configs";
import HtmlWebpackPlugin from "html-webpack-plugin";
import { describe, test, vi } from "vitest";
import type { Configuration, RuleSetRule } from "webpack";
import type { ClientConfiguration, ServerConfiguration } from "webpack-dev-server";
import { defineDevConfig, defineDevHtmlWebpackPluginConfig, defineFastRefreshPluginConfig } from "../src/dev.ts";
import type { WebpackConfigTransformer } from "../src/transformers/applyTransformers.ts";
import { findModuleRule, matchAssetModuleType, matchLoaderName } from "../src/transformers/moduleRules.ts";
import { findPlugin, matchConstructorName } from "../src/transformers/plugins.ts";

const DefaultSwcConfig = defineSwcConfig({
    chrome: "116"
});

test.concurrent("when an entry prop is provided, use the provided entry value", ({ expect }) => {
    const result = defineDevConfig(DefaultSwcConfig, {
        entry: "./a-new-entry.ts"
    });

    expect(result.entry).toBe("./a-new-entry.ts");
});

test.concurrent("when https is enabled, the dev server is configured for https", ({ expect }) => {
    const result = defineDevConfig(DefaultSwcConfig, {
        https: true
    });

    expect((result.devServer?.server as ServerConfiguration).type).toBe("https");
});

test.concurrent("when https is disabled, the dev server is not configured for https", ({ expect }) => {
    const result = defineDevConfig(DefaultSwcConfig, {
        https: false
    });

    expect(result.devServer?.server).toBeUndefined();
});

test.concurrent("when https is enabled, the public path starts with https", ({ expect }) => {
    const result = defineDevConfig(DefaultSwcConfig, {
        https: true
    });

    expect(result.output?.publicPath).toMatch(/^https:/);
});

test.concurrent("when https is disabled, the public path starts with http", ({ expect }) => {
    const result = defineDevConfig(DefaultSwcConfig, {
        https: false
    });

    expect(result.output?.publicPath).toMatch(/^http:/);
});

test.concurrent("when an host is provided, the dev server host is the provided host value", ({ expect }) => {
    const result = defineDevConfig(DefaultSwcConfig, {
        host: "a-custom-host"
    });

    expect(result.devServer?.host).toBe("a-custom-host");
});

test.concurrent("when an host is provided, the public path include the provided host value", ({ expect }) => {
    const result = defineDevConfig(DefaultSwcConfig, {
        host: "a-custom-host"
    });

    expect(result.output?.publicPath).toMatch(/a-custom-host/);
});

test.concurrent("when a port is provided, the dev server port is the provided port value", ({ expect }) => {
    const result = defineDevConfig(DefaultSwcConfig, {
        port: 1234
    });

    expect(result.devServer?.port).toBe(1234);
});

test.concurrent("when a port is provided, the public path include the provided port", ({ expect }) => {
    const result = defineDevConfig(DefaultSwcConfig, {
        port: 1234
    });

    expect(result.output?.publicPath).toMatch(/1234/);
});

test.concurrent("when a public path is provided, use the provided public path", ({ expect }) => {
    const result = defineDevConfig(DefaultSwcConfig, {
        publicPath: "http://my-dev-host.com/"
    });

    expect(result.output?.publicPath).toBe("http://my-dev-host.com/");
});

test.concurrent("when cache is enabled, the cache configuration is included", ({ expect }) => {
    const result = defineDevConfig(DefaultSwcConfig, {
        cache: true
    });

    expect(result.cache).toBeDefined();
});

test.concurrent("when cache is disabled, the cache prop is false", ({ expect }) => {
    const result = defineDevConfig(DefaultSwcConfig, {
        cache: false
    });

    expect(result.cache).toBeFalsy();
});

test.concurrent("when additional module rules are provided, append the provided rules at the end of the module rules array", ({ expect }) => {
    const newModuleRule1 = {
        test: /\.svg/i,
        type: "asset/inline"
    };

    const newModuleRule2 = {
        test: /\.json/i,
        type: "asset/inline"
    };

    const result = defineDevConfig(DefaultSwcConfig, {
        moduleRules: [
            newModuleRule1,
            newModuleRule2
        ]
    });

    const rulesCount = result.module!.rules!.length;

    expect(result.module?.rules![rulesCount - 2]).toBe(newModuleRule1);
    expect(result.module?.rules![rulesCount - 1]).toBe(newModuleRule2);
});

test.concurrent("when additional plugins are provided, append the provided plugins at the end of the plugins array", ({ expect }) => {
    class Plugin1 {
        apply() {
            console.log("I am plugin 1!");
        }
    }

    class Plugin2 {
        apply() {
            console.log("I am plugin 2!");
        }
    }

    const newPlugin1 = new Plugin1();
    const newPlugin2 = new Plugin2();

    const result = defineDevConfig(DefaultSwcConfig, {
        plugins: [
            newPlugin1,
            newPlugin2
        ]
    });

    const pluginsCount = result.plugins!.length;

    expect(result.plugins![pluginsCount - 2]).toBe(newPlugin1);
    expect(result.plugins![pluginsCount - 1]).toBe(newPlugin2);
});

test.concurrent("when htmlWebpackPlugin is \"false\", no html-webpack-plugin instance is added to the plugin array", ({ expect }) => {
    const config = defineDevConfig(DefaultSwcConfig, {
        htmlWebpackPlugin: false
    });

    const result = findPlugin(config, matchConstructorName(HtmlWebpackPlugin.name));

    expect(result).toBeUndefined();
});

test.concurrent("when htmlWebpackPlugin is \"true\", an html-webpack-plugin instance is added to the plugin array", ({ expect }) => {
    const config = defineDevConfig(DefaultSwcConfig, {
        htmlWebpackPlugin: true
    });

    const result = findPlugin(config, matchConstructorName(HtmlWebpackPlugin.name));

    expect(result).toBeDefined();
});

test.concurrent("when fast refresh is disabled, dev server hot module reload is enabled", ({ expect }) => {
    const result = defineDevConfig(DefaultSwcConfig, {
        fastRefresh: false
    });

    expect(result.devServer?.hot).toBeTruthy();
});

test.concurrent("when fast refresh is enabled, add the fast refresh plugin", ({ expect }) => {
    const result = defineDevConfig(DefaultSwcConfig, {
        fastRefresh: true
    });

    expect(result.plugins?.some(x => x!.constructor.name === ReactRefreshWebpackPlugin.name)).toBeTruthy();
});

test.concurrent("when fast refresh is disabled, do not add the fast refresh plugin", ({ expect }) => {
    const result = defineDevConfig(DefaultSwcConfig, {
        fastRefresh: false
    });

    expect(result.plugins?.some(x => x!.constructor.name === ReactRefreshWebpackPlugin.name)).toBeFalsy();
});

test.concurrent("when fast refresh is enabled, enable swc fast refresh", ({ expect }) => {
    const result = defineDevConfig(DefaultSwcConfig, {
        fastRefresh: true
    });

    const swcLoader = findModuleRule(result, matchLoaderName("swc-loader"));

    expect(((swcLoader?.moduleRule as RuleSetRule).options as SwcConfig).jsc?.transform?.react?.refresh).toBeTruthy();
});

test.concurrent("when fast refresh is disabled, disable swc fast refresh", ({ expect }) => {
    const result = defineDevConfig(DefaultSwcConfig, {
        fastRefresh: false
    });

    const swcLoader = findModuleRule(result, matchLoaderName("swc-loader"));

    expect(((swcLoader?.moduleRule as RuleSetRule).options as SwcConfig).jsc?.transform?.react?.refresh).toBeFalsy();
});

test.concurrent("when css modules is enabled, include css modules configuration", ({ expect }) => {
    const result = defineDevConfig(DefaultSwcConfig, {
        cssModules: true
    });

    const cssLoader = findModuleRule(result, matchLoaderName("css-loader"));

    // css-loader doesn't provide typings.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(((cssLoader?.moduleRule as RuleSetRule).options as any).modules).toBeTruthy();
    // css-loader doesn't provide typings.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(((cssLoader?.moduleRule as RuleSetRule).options as any).importLoaders).toBe(1);
});

test.concurrent("when css modules is disabled, do not include css modules configuration", ({ expect }) => {
    const result = defineDevConfig(DefaultSwcConfig, {
        cssModules: false
    });

    const cssLoader = findModuleRule(result, matchLoaderName("css-loader"));

    expect((cssLoader?.moduleRule as RuleSetRule).options).toBeUndefined();
});

test.concurrent("when the overlay option is not provided and fast refresh is disabled, the devserver overlay option is undefined", ({ expect }) => {
    const result = defineDevConfig(DefaultSwcConfig, {
        fastRefresh: false
    });

    expect(result.devServer!.client).toBeUndefined();
});

test.concurrent("when fast refresh is enabled, the devserver overlay option is false", ({ expect }) => {
    const result = defineDevConfig(DefaultSwcConfig, {
        fastRefresh: true
    });

    expect((result.devServer!.client as ClientConfiguration).overlay).toBeFalsy();
});

test.concurrent("when the overlay is disabled, the devserver overlay option is false", ({ expect }) => {
    const result = defineDevConfig(DefaultSwcConfig, {
        overlay: false
    });

    expect((result.devServer!.client as ClientConfiguration).overlay).toBeFalsy();
});

test.concurrent("the provided swc config object is set as the swc-loader options", ({ expect }) => {
    const config = DefaultSwcConfig;

    const result = defineDevConfig(config);

    const swcLoader = findModuleRule(result, matchLoaderName("swc-loader"));

    expect((swcLoader?.moduleRule as RuleSetRule).options).toBe(config);
});

test.concurrent("when a transformer is provided, and the transformer update the existing configuration object, the transformer is applied on the webpack config", ({ expect }) => {
    const entryTransformer: WebpackConfigTransformer = (config: Configuration) => {
        config.entry = "a-custom-value-in-a-transformer";

        return config;
    };

    const result = defineDevConfig(DefaultSwcConfig, {
        transformers: [entryTransformer]
    });

    expect(result.entry).toBe("a-custom-value-in-a-transformer");
});

test.concurrent("when a transformer is provided, and the transformer returns a new configuration object, the transformer is applied on the webpack config", ({ expect }) => {
    const entryTransformer: WebpackConfigTransformer = () => {
        return {
            entry: "a-custom-value-in-a-transformer"
        };
    };

    const result = defineDevConfig(DefaultSwcConfig, {
        transformers: [entryTransformer]
    });

    expect(result.entry).toBe("a-custom-value-in-a-transformer");
});

test.concurrent("when multiple transformers are provided, all the transformers are applied on the webpack config", ({ expect }) => {
    const entryTransformer: WebpackConfigTransformer = (config: Configuration) => {
        config.entry = "a-custom-value-in-a-transformer";

        return config;
    };

    const devToolTransformer: WebpackConfigTransformer = (config: Configuration) => {
        config.devtool = "custom-module-source-map-in-a-tranformer";

        return config;
    };

    const result = defineDevConfig(DefaultSwcConfig, {
        transformers: [entryTransformer, devToolTransformer]
    });

    expect(result.entry).toBe("a-custom-value-in-a-transformer");
    expect(result.devtool).toBe("custom-module-source-map-in-a-tranformer");
});

test.concurrent("transformers context environment is \"dev\"", ({ expect }) => {
    const mockTransformer = vi.fn();

    defineDevConfig(DefaultSwcConfig, {
        transformers: [mockTransformer]
    });

    expect(mockTransformer).toHaveBeenCalledWith(expect.anything(), { environment: "dev", verbose: false });
});

test.concurrent("when the verbose option is true, the transformers context verbose value is \"true\"", ({ expect }) => {
    const mockTransformer = vi.fn();

    defineDevConfig(DefaultSwcConfig, {
        verbose: true,
        transformers: [mockTransformer]
    });

    expect(mockTransformer).toHaveBeenCalledWith(expect.anything(), { environment: "dev", verbose: true });
});

// TODO: The test do not pass on UNIX system becase of \\, fix this later,
// test.concurrent("by default, an svgr rule is added and the assets loader do not handle .svg files", ({ expect }) => {
//     const result = defineDevConfig(SwcConfig);

//     const svgrRule = findModuleRule(result, matchLoaderName("@svgr\\webpack"));
//     const assetsRule = findModuleRule(result, matchAssetModuleType("asset/resource"));

//     expect(svgrRule).toBeDefined();
//     expect((assetsRule?.moduleRule as RuleSetRule).test).toEqual(/\.(png|jpe?g|gif)$/i);
// });

test.concurrent("when the svgr option is false, do not add the svgr rule", ({ expect }) => {
    const result = defineDevConfig(DefaultSwcConfig, {
        svgr: false
    });

    const svgrRule = findModuleRule(result, matchLoaderName("@svgr\\webpack"));

    expect(svgrRule).toBeUndefined();
});

test.concurrent("when the svgr option is false, add .svg to the default assets rule", ({ expect }) => {
    const result = defineDevConfig(DefaultSwcConfig, {
        svgr: false
    });

    const assetsRule = findModuleRule(result, matchAssetModuleType("asset/resource"));

    expect((assetsRule?.moduleRule as RuleSetRule).test).toEqual(/\.(png|jpe?g|gif|svg)$/i);
});

describe("defineDevHtmlWebpackPluginConfig", () => {
    test.concurrent("merge the default options with the provided options", ({ expect }) => {
        const result = defineDevHtmlWebpackPluginConfig({
            filename: "a-custom-filename"
        });

        expect(result.filename).toBe("a-custom-filename");
        expect(result.template).toMatch(/index.html/);
    });

    test.concurrent("when a template value is provided, override the default template option", ({ expect }) => {
        const result = defineDevHtmlWebpackPluginConfig({
            template: "a-custom-template-file-path"
        });

        expect(result.template).toBe("a-custom-template-file-path");
    });
});

describe("defineFastRefreshPluginConfig", () => {
    test.concurrent("merge the default options with the provided options", ({ expect }) => {
        const result = defineFastRefreshPluginConfig({
            exclude: "a-custom-exclude"
        });

        expect(result.exclude).toBe("a-custom-exclude");
    });
});

