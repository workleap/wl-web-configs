import { defineBuildConfig as defineSwcConfig } from "@workleap/swc-configs";
import type { Configuration, RuleSetRule } from "webpack";
import { defineBuildConfig, defineBuildHtmlWebpackPluginConfig, defineMiniCssExtractPluginConfig } from "../src/build.ts";
import type { WebpackConfigTransformer } from "../src/transformers/applyTransformers.ts";
import { findModuleRule, matchLoaderName } from "../src/transformers/moduleRules.ts";

const Browsers = ["last 2 versions"];

test("when an entry prop is provided, use the provided entry value", () => {
    const result = defineBuildConfig({
        entry: "./a-new-entry.ts",
        swcConfig: defineSwcConfig({ browsers: Browsers })
    });

    expect(result.entry).toBe("./a-new-entry.ts");
});

test("when an output path is provided, use the provided ouput path value", () => {
    const result = defineBuildConfig({
        outputPath: "./a-new-output-path",
        swcConfig: defineSwcConfig({ browsers: Browsers })
    });

    expect(result.output?.path).toBe("./a-new-output-path");
});

test("when a public path is provided, use the provided public path value", () => {
    const result = defineBuildConfig({
        publicPath: "./a-new-public-path",
        swcConfig: defineSwcConfig({ browsers: Browsers })
    });

    expect(result.output?.publicPath).toBe("./a-new-public-path");
});

test("when additional module rules are provided, append the provided rules at the end of the module rules array", () => {
    const newModuleRule1 = {
        test: /\.svg/i,
        type: "asset/inline"
    };

    const newModuleRule2 = {
        test: /\.json/i,
        type: "asset/inline"
    };

    const result = defineBuildConfig({
        moduleRules: [
            newModuleRule1,
            newModuleRule2
        ],
        swcConfig: defineSwcConfig({ browsers: Browsers })
    });

    const rulesCount = result.module!.rules!.length;

    expect(result.module?.rules![rulesCount - 2]).toBe(newModuleRule1);
    expect(result.module?.rules![rulesCount - 1]).toBe(newModuleRule2);
});

test("when additional plugins are provided, append the provided plugins at the end of the plugins array", () => {
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

    const result = defineBuildConfig({
        plugins: [
            newPlugin1,
            newPlugin2
        ],
        swcConfig: defineSwcConfig({ browsers: Browsers })
    });

    const pluginsCount = result.plugins!.length;

    expect(result.plugins![pluginsCount - 2]).toBe(newPlugin1);
    expect(result.plugins![pluginsCount - 1]).toBe(newPlugin2);
});

test("when minify is true, minimize is set to true", () => {
    const result = defineBuildConfig({
        minify: true,
        swcConfig: defineSwcConfig({ browsers: Browsers })
    });

    expect(result.optimization?.minimize).toBeTruthy();
});

test("when minify is false, minimize is set to false", () => {
    const result = defineBuildConfig({
        minify: false,
        swcConfig: defineSwcConfig({ browsers: Browsers })
    });

    expect(result.optimization?.minimize).toBeFalsy();
});

test("when minify is true, include minify configuration", () => {
    const result = defineBuildConfig({
        minify: true,
        swcConfig: defineSwcConfig({ browsers: Browsers })
    });

    expect(result.optimization?.minimizer).toBeDefined();
});

test("when minify is false, do not include minify configuration", () => {
    const result = defineBuildConfig({
        minify: false,
        swcConfig: defineSwcConfig({ browsers: Browsers })
    });

    expect(result.optimization?.minimizer).toBeUndefined();
});

test("when css modules is enabled, include css modules configuration", () => {
    const result = defineBuildConfig({
        cssModules: true,
        swcConfig: defineSwcConfig({ browsers: Browsers })
    });

    const cssLoader = findModuleRule(result, matchLoaderName("css-loader"));

    // css-loader doesn't provide typings.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(((cssLoader?.moduleRule as RuleSetRule).options as any).modules).toBeTruthy();
    // css-loader doesn't provide typings.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(((cssLoader?.moduleRule as RuleSetRule).options as any).importLoaders).toBe(1);
});

test("when css modules is disabled, do not include css modules configuration", () => {
    const result = defineBuildConfig({
        cssModules: false,
        swcConfig: defineSwcConfig({ browsers: Browsers })
    });

    const cssLoader = findModuleRule(result, matchLoaderName("css-loader"));

    expect((cssLoader?.moduleRule as RuleSetRule).options).toBeUndefined();
});

test("when a postcss config file path is provided, use the provided file path", () => {
    const result = defineBuildConfig({
        postcssConfigFilePath: "a-custom-file-path",
        swcConfig: defineSwcConfig({ browsers: Browsers })
    });

    const postcssLoader = findModuleRule(result, matchLoaderName("postcss-loader"));

    // postcss-loader doesn't provide typings.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(((postcssLoader?.moduleRule as RuleSetRule).options as any).postcssOptions.config).toBe("a-custom-file-path");
});

test("the provided swc config object is set as the swc-loader options", () => {
    const swcConfig = defineSwcConfig({ browsers: Browsers });

    const result = defineBuildConfig({
        postcssConfigFilePath: "a-custom-file-path",
        swcConfig
    });

    const swcLoader = findModuleRule(result, matchLoaderName("swc-loader"));

    expect((swcLoader?.moduleRule as RuleSetRule).options).toBe(swcConfig);
});

test("when a transformer is provided, the transformer is applied on the webpack config", () => {
    const entryTransformer: WebpackConfigTransformer = (config: Configuration) => {
        config.entry = "a-custom-value-in-a-transformer";

        return config;
    };

    const result = defineBuildConfig({
        swcConfig: defineSwcConfig({ browsers: Browsers }),
        transformers: [entryTransformer]
    });

    expect(result.entry).toBe("a-custom-value-in-a-transformer");
});

test("when multiple transformers are provided, all the transformers are applied on the webpack config", () => {
    const entryTransformer: WebpackConfigTransformer = (config: Configuration) => {
        config.entry = "a-custom-value-in-a-transformer";

        return config;
    };

    const devToolTransformer: WebpackConfigTransformer = (config: Configuration) => {
        config.devtool = "custom-module-source-map-in-a-tranformer";

        return config;
    };

    const result = defineBuildConfig({
        swcConfig: defineSwcConfig({ browsers: Browsers }),
        transformers: [entryTransformer, devToolTransformer]
    });

    expect(result.entry).toBe("a-custom-value-in-a-transformer");
    expect(result.devtool).toBe("custom-module-source-map-in-a-tranformer");
});

test("transformers context environment is \"build\"", () => {
    const mockTransformer = jest.fn();

    defineBuildConfig({
        swcConfig: defineSwcConfig({ browsers: Browsers }),
        transformers: [mockTransformer]
    });

    expect(mockTransformer).toHaveBeenCalledWith(expect.anything(), { environment: "build" });
});

describe("defineBuildHtmlWebpackPluginConfig", () => {
    test("merge the default options with the provided values", () => {
        const result = defineBuildHtmlWebpackPluginConfig({
            filename: "a-custom-filename"
        });

        expect(result.filename).toBe("a-custom-filename");
        expect(result.template).toMatch(/index.html/);
    });

    test("when a template value is provided, override the default template option", () => {
        const result = defineBuildHtmlWebpackPluginConfig({
            template: "a-custom-template-file-path"
        });

        expect(result.template).toBe("a-custom-template-file-path");
    });
});

describe("defineMiniCssExtractPluginConfig", () => {
    test("merge the default options with the provided values", () => {
        const result = defineMiniCssExtractPluginConfig({
            chunkFilename: "a-custom-chunk-filename"
        });

        expect(result.chunkFilename).toBe("a-custom-chunk-filename");
        expect(result.filename).toBe("[name].[fullhash].css");
    });


    test("when a filename value is provided, override the default filename option", () => {
        const result = defineMiniCssExtractPluginConfig({
            filename: "a-custom-filename"
        });

        expect(result.filename).toBe("a-custom-filename");
    });
});

