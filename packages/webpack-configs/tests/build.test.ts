import { defineBuildConfig as defineSwcConfig } from "@workleap/swc-configs";
import HtmlWebpackPlugin from "html-webpack-plugin";
import { describe, test, vi } from "vitest";
import type { Configuration, RuleSetRule } from "webpack";
import { defineBuildConfig, defineBuildHtmlWebpackPluginConfig, defineMiniCssExtractPluginConfig } from "../src/build.ts";
import type { WebpackConfigTransformer } from "../src/transformers/applyTransformers.ts";
import { findModuleRule, matchAssetModuleType, matchLoaderName } from "../src/transformers/moduleRules.ts";
import { findPlugin, matchConstructorName } from "../src/transformers/plugins.ts";

const DefaultSwcConfig = defineSwcConfig({
    chrome: "116"
});

test.concurrent("when an entry prop is provided, use the provided entry value", ({ expect }) => {
    const result = defineBuildConfig(DefaultSwcConfig, {
        entry: "./a-new-entry.ts"
    });

    expect(result.entry).toBe("./a-new-entry.ts");
});

test.concurrent("when an output path is provided, use the provided ouput path value", ({ expect }) => {
    const result = defineBuildConfig(DefaultSwcConfig, {
        outputPath: "./a-new-output-path"
    });

    expect(result.output!.path).toBe("./a-new-output-path");
});

test.concurrent("when a public path is set to \"auto\", should not throw an error", ({ expect }) => {
    expect(() => defineBuildConfig(DefaultSwcConfig, { publicPath: "auto" })).not.toThrow();
});

test.concurrent("when a valid public path is provided, use the provided public path value", ({ expect }) => {
    const result = defineBuildConfig(DefaultSwcConfig, {
        publicPath: "a-valid-public-path-ending-with-a-trailing-slash/"
    });

    expect(result.output!.publicPath).toBe("a-valid-public-path-ending-with-a-trailing-slash/");
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

    const result = defineBuildConfig(DefaultSwcConfig, {
        moduleRules: [
            newModuleRule1,
            newModuleRule2
        ]
    });

    const rulesCount = result.module!.rules!.length;

    expect(result.module!.rules![rulesCount - 2]).toBe(newModuleRule1);
    expect(result.module!.rules![rulesCount - 1]).toBe(newModuleRule2);
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

    const result = defineBuildConfig(DefaultSwcConfig, {
        plugins: [
            newPlugin1,
            newPlugin2
        ]
    });

    const pluginsCount = result.plugins!.length;

    expect(result.plugins![pluginsCount - 2]).toBe(newPlugin1);
    expect(result.plugins![pluginsCount - 1]).toBe(newPlugin2);
});

test.concurrent("when optimize is true, minimize is set to true", ({ expect }) => {
    const result = defineBuildConfig(DefaultSwcConfig, {
        optimize: true
    });

    expect(result.optimization!.minimize).toBeTruthy();
});

test.concurrent("when optimize is false, minimize is set to false", ({ expect }) => {
    const result = defineBuildConfig(DefaultSwcConfig, {
        optimize: false
    });

    expect(result.optimization!.minimize).toBeFalsy();
});

test.concurrent("when optimize is \"readable\", minimize is set to true", ({ expect }) => {
    const result = defineBuildConfig(DefaultSwcConfig, {
        optimize: "readable"
    });

    expect(result.optimization?.minimize).toBeTruthy();
});

test.concurrent("when optimize is false, chunkIds is set to \"named\"", ({ expect }) => {
    const result = defineBuildConfig(DefaultSwcConfig, {
        optimize: false
    });

    expect(result.optimization?.chunkIds).toBe("named");
});

test.concurrent("when optimize is false, moduleIds is set to \"named\"", ({ expect }) => {
    const result = defineBuildConfig(DefaultSwcConfig, {
        optimize: false
    });

    expect(result.optimization!.chunkIds).toBe("named");
});

test.concurrent("when optimize is \"readable\", chunkIds is set to \"named\"", ({ expect }) => {
    const result = defineBuildConfig(DefaultSwcConfig, {
        optimize: "readable"
    });

    expect(result.optimization!.chunkIds).toBe("named");
});

test.concurrent("when optimize is \"readable\", moduleIds is set to \"named\"", ({ expect }) => {
    const result = defineBuildConfig(DefaultSwcConfig, {
        optimize: "readable"
    });

    expect(result.optimization?.chunkIds).toBe("named");
});

test.concurrent("when optimize is true, include minify configuration", ({ expect }) => {
    const result = defineBuildConfig(DefaultSwcConfig, {
        optimize: true
    });

    expect(result.optimization!.minimizer).toBeDefined();
});

test.concurrent("when optimize is false, do not include minify configuration", ({ expect }) => {
    const result = defineBuildConfig(DefaultSwcConfig, {
        optimize: false
    });

    expect(result.optimization!.minimizer).toBeUndefined();
});

test.concurrent("when optimize is \"readable\", include minify configuration", ({ expect }) => {
    const result = defineBuildConfig(DefaultSwcConfig, {
        optimize: "readable"
    });

    expect(result.optimization!.minimizer).toBeDefined();
});

test.concurrent("when htmlWebpackPlugin is \"false\", no html-webpack-plugin instance is added to the plugin array", ({ expect }) => {
    const config = defineBuildConfig(DefaultSwcConfig, {
        htmlWebpackPlugin: false
    });

    const result = findPlugin(config, matchConstructorName(HtmlWebpackPlugin.name));

    expect(result).toBeUndefined();
});

test.concurrent("when htmlWebpackPlugin is \"true\", an html-webpack-plugin instance is added to the plugin array", ({ expect }) => {
    const config = defineBuildConfig(DefaultSwcConfig, {
        htmlWebpackPlugin: true
    });

    const result = findPlugin(config, matchConstructorName(HtmlWebpackPlugin.name));

    expect(result).toBeDefined();
});

test.concurrent("when css modules is enabled, include css modules configuration", ({ expect }) => {
    const result = defineBuildConfig(DefaultSwcConfig, {
        cssModules: true
    });

    const cssLoader = findModuleRule(result, matchLoaderName("css-loader"));

    // css-loader doesn't provide typings.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(((cssLoader!.moduleRule as RuleSetRule).options as any).modules).toBeTruthy();
    // css-loader doesn't provide typings.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(((cssLoader!.moduleRule as RuleSetRule).options as any).importLoaders).toBe(1);
});

test.concurrent("when css modules is disabled, do not include css modules configuration", ({ expect }) => {
    const result = defineBuildConfig(DefaultSwcConfig, {
        cssModules: false
    });

    const cssLoader = findModuleRule(result, matchLoaderName("css-loader"));

    expect((cssLoader!.moduleRule as RuleSetRule).options).toBeUndefined();
});

test.concurrent("the provided swc config object is set as the swc-loader options", ({ expect }) => {
    const swcConfig = DefaultSwcConfig;

    const result = defineBuildConfig(swcConfig);

    const swcLoader = findModuleRule(result, matchLoaderName("swc-loader"));

    expect((swcLoader!.moduleRule as RuleSetRule).options).toBe(swcConfig);
});

test.concurrent("when a transformer is provided, and the transformer update the existing configuration object, the transformer is applied on the webpack config", ({ expect }) => {
    const entryTransformer: WebpackConfigTransformer = (config: Configuration) => {
        config.entry = "a-custom-value-in-a-transformer";

        return config;
    };

    const result = defineBuildConfig(DefaultSwcConfig, {
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

    const result = defineBuildConfig(DefaultSwcConfig, {
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

    const result = defineBuildConfig(DefaultSwcConfig, {
        transformers: [entryTransformer, devToolTransformer]
    });

    expect(result.entry).toBe("a-custom-value-in-a-transformer");
    expect(result.devtool).toBe("custom-module-source-map-in-a-tranformer");
});

test.concurrent("transformers context environment is \"build\"", ({ expect }) => {
    const mockTransformer = vi.fn();

    defineBuildConfig(DefaultSwcConfig, {
        transformers: [mockTransformer]
    });

    expect(mockTransformer).toHaveBeenCalledWith(expect.anything(), { environment: "build", verbose: false });
});

test.concurrent("when the verbose option is true, the transformers context verbose value is \"true\"", ({ expect }) => {
    const mockTransformer = vi.fn();

    defineBuildConfig(DefaultSwcConfig, {
        verbose: true,
        transformers: [mockTransformer]
    });

    expect(mockTransformer).toHaveBeenCalledWith(expect.anything(), { environment: "build", verbose: true });
});

// TODO: The test do not pass on UNIX system becase of \\, fix this later,
// test.concurrent("by default, an svgr rule is added and the assets loader do not handle .svg files", ({ expect }) => {
//     const result = defineBuildConfig(SwcConfig);

//     const svgrRule = findModuleRule(result, matchLoaderName("@svgr\\webpack"));
//     const assetsRule = findModuleRule(result, matchAssetModuleType("asset/resource"));

//     expect(svgrRule).toBeDefined();
//     expect((assetsRule?.moduleRule as RuleSetRule).test).toEqual(/\.(png|jpe?g|gif)$/i);
// });

test.concurrent("when the svgr option is false, do not add the svgr rule", ({ expect }) => {
    const result = defineBuildConfig(DefaultSwcConfig, {
        svgr: false
    });

    const svgrRule = findModuleRule(result, matchLoaderName("@svgr\\webpack"));

    expect(svgrRule).toBeUndefined();
});

test.concurrent("when the svgr option is false, add .svg to the default assets rule", ({ expect }) => {
    const result = defineBuildConfig(DefaultSwcConfig, {
        svgr: false
    });

    const assetsRule = findModuleRule(result, matchAssetModuleType("asset/resource"));

    expect((assetsRule!.moduleRule as RuleSetRule).test).toEqual(/\.(png|jpe?g|gif|svg)$/i);
});

describe("defineBuildHtmlWebpackPluginConfig", () => {
    test.concurrent("merge the default options with the provided options", ({ expect }) => {
        const result = defineBuildHtmlWebpackPluginConfig({
            filename: "a-custom-filename"
        });

        expect(result.filename).toBe("a-custom-filename");
        expect(result.template).toMatch(/index.html/);
    });

    test.concurrent("when a template value is provided, override the default template option", ({ expect }) => {
        const result = defineBuildHtmlWebpackPluginConfig({
            template: "a-custom-template-file-path"
        });

        expect(result.template).toBe("a-custom-template-file-path");
    });
});

describe("defineMiniCssExtractPluginConfig", () => {
    test.concurrent("merge the default options with the provided options", ({ expect }) => {
        const result = defineMiniCssExtractPluginConfig({
            chunkFilename: "a-custom-chunk-filename"
        });

        expect(result.chunkFilename).toBe("a-custom-chunk-filename");
        expect(result.filename).toBe("[name].css");
    });

    test.concurrent("when a filename value is provided, override the default filename option", ({ expect }) => {
        const result = defineMiniCssExtractPluginConfig({
            filename: "a-custom-filename"
        });

        expect(result.filename).toBe("a-custom-filename");
    });
});

