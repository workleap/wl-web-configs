import type { DistPathConfig, Minify, RsbuildConfig, RsbuildPlugin, SourceMap, SplitChunksConfig } from "@rsbuild/core";
import { describe, test, vi } from "vitest";
import type { RsbuildConfigTransformer } from "../src/applyTransformers.ts";
import { defineBuildConfig, getMinifyConfig, getOptimizationConfig } from "../src/build.ts";

test.concurrent("when an entry prop is provided, the source.entry option is the provided value", ({ expect }) => {
    const result = defineBuildConfig({
        entry: {
            index: "./a-new-entry.ts"
        }
    });

    expect(result.source!.entry!.index).toBe("./a-new-entry.ts");
});

test.concurrent("when a dist path is provided, the output.distpath option is the provided value", ({ expect }) => {
    const result = defineBuildConfig({
        distPath: {
            root: "./a-new-output-path"
        }
    });

    expect((result.output!.distPath as DistPathConfig).root).toBe("./a-new-output-path");
});

test.concurrent("when an asset prefix is provided, the output.assetPrefix option is the provided value", ({ expect }) => {
    const result = defineBuildConfig({
        assetPrefix: "a-valid-public-path-ending-with-a-trailing-slash"
    });

    expect(result.output!.assetPrefix).toBe("a-valid-public-path-ending-with-a-trailing-slash");
});

test.concurrent("when additional plugins are provided, append the provided plugins at the end of the plugins array", ({ expect }) => {
    const plugin1: RsbuildPlugin = {
        name: "plugin-1",
        setup: () => {}
    };

    const plugin2: RsbuildPlugin = {
        name: "plugin-2",
        setup: () => {}
    };

    const result = defineBuildConfig({
        plugins: [
            plugin1,
            plugin2
        ]
    });

    const pluginsCount = result.plugins!.length;

    expect(result.plugins![pluginsCount - 2]).toBe(plugin1);
    expect(result.plugins![pluginsCount - 1]).toBe(plugin2);
});

test.concurrent("when html is false, the html option is undefined", ({ expect }) => {
    const result = defineBuildConfig({
        html: false
    });

    expect(result.html).toBeUndefined();
});

test.concurrent("when html is a function, the html option match the function return value", ({ expect }) => {
    const html = {
        title: "foo"
    };

    const result = defineBuildConfig({
        html: () => {
            return html;
        }
    });

    expect(result.html).toBe(html);
});

test.concurrent("when sourceMap is false, the output.sourceMap option is false", ({ expect }) => {
    const result = defineBuildConfig({
        sourceMap: false
    });

    expect(result.output?.sourceMap).toBeFalsy();
});

test.concurrent("when sourceMap is an object, the output.sourceMap option is the object", ({ expect }) => {
    const sourceMap: SourceMap = {
        js: false,
        css: false
    };

    const result = defineBuildConfig({
        sourceMap
    });

    expect(result.output?.sourceMap).toBe(sourceMap);
});

test.concurrent("when react is false, the react plugin is not included", ({ expect }) => {
    const result = defineBuildConfig({
        react: false
    });

    const plugin = result.plugins?.find(x => (x as RsbuildPlugin).name === "rsbuild:react");

    expect(plugin).toBeUndefined();
});

test.concurrent("when react is a function, the function is executed", ({ expect }) => {
    const fct = vi.fn();

    defineBuildConfig({
        react: fct
    });

    expect(fct).toHaveBeenCalledTimes(1);
});

test.concurrent("when svgr is false, the svgr plugin is not included", ({ expect }) => {
    const result = defineBuildConfig({
        svgr: false
    });

    const plugin = result.plugins?.find(x => (x as RsbuildPlugin).name === "rsbuild:svgr");

    expect(plugin).toBeUndefined();
});

test.concurrent("when svgr is a function, the function is executed", ({ expect }) => {
    const fct = vi.fn();

    defineBuildConfig({
        svgr: fct
    });

    expect(fct).toHaveBeenCalledTimes(1);
});

test.concurrent("when compressImage is false, the image compress plugin is not included", ({ expect }) => {
    const result = defineBuildConfig({
        compressImage: false
    });

    const plugin = result.plugins?.find(x => (x as RsbuildPlugin).name === "rsbuild:image-compress");

    expect(plugin).toBeUndefined();
});

test.concurrent("when compressImage is a function, the function is executed", ({ expect }) => {
    const fct = vi.fn();

    defineBuildConfig({
        compressImage: fct
    });

    expect(fct).toHaveBeenCalledTimes(1);
});

test.concurrent("when a transformer is provided, and the transformer update the existing configuration object, the transformer is applied on the Rsbuild config", ({ expect }) => {
    const entryTransformer: RsbuildConfigTransformer = (config: RsbuildConfig) => {
        config.source = config.source ?? {};
        config.source.entry = {
            index: "a-custom-value-in-a-transformer"
        };

        return config;
    };

    const result = defineBuildConfig({
        transformers: [entryTransformer]
    });

    expect(result.source!.entry!.index).toBe("a-custom-value-in-a-transformer");
});

test.concurrent("when a transformer is provided, and the transformer returns a new configuration object, the transformer is applied on the Rsbuild config", ({ expect }) => {
    const entryTransformer: RsbuildConfigTransformer = () => {
        return {
            source: {
                entry: {
                    index: "a-custom-value-in-a-transformer"
                }
            }
        };
    };

    const result = defineBuildConfig({
        transformers: [entryTransformer]
    });

    expect(result.source!.entry!.index).toBe("a-custom-value-in-a-transformer");
});

test.concurrent("when multiple transformers are provided, all the transformers are applied on the webpack config", ({ expect }) => {
    const entryTransformer: RsbuildConfigTransformer = (config: RsbuildConfig) => {
        config.source = config.source ?? {};
        config.source.entry = {
            index: "a-custom-value-in-a-transformer"
        };

        return config;
    };

    const distPathTransformer: RsbuildConfigTransformer = (config: RsbuildConfig) => {
        const distPath: DistPathConfig = { js: "a-custom-dist-path-in-a-tranformer" };

        config.output = config.output ?? {};
        config.output.distPath = distPath;

        return config;
    };

    const result = defineBuildConfig({
        transformers: [entryTransformer, distPathTransformer]
    });

    expect(result.source!.entry!.index).toBe("a-custom-value-in-a-transformer");
    expect((result.output!.distPath as DistPathConfig).js).toBe("a-custom-dist-path-in-a-tranformer");
});

test.concurrent("transformers context environment is \"dev\"", ({ expect }) => {
    const mockTransformer = vi.fn();

    defineBuildConfig({
        transformers: [mockTransformer]
    });

    expect(mockTransformer).toHaveBeenCalledWith(expect.anything(), { environment: "build", verbose: false });
});

test.concurrent("when the verbose option is true, the transformers context verbose value is \"true\"", ({ expect }) => {
    const mockTransformer = vi.fn();

    defineBuildConfig({
        verbose: true,
        transformers: [mockTransformer]
    });

    expect(mockTransformer).toHaveBeenCalledWith(expect.anything(), { environment: "build", verbose: true });
});

describe("getMinifyConfig", () => {
    test.concurrent("when optimize is true, return the provided minify value", ({ expect }) => {
        expect(getMinifyConfig(true, true)).toBe(true);
        expect(getMinifyConfig(true, false)).toBe(false);
    });

    test.concurrent("when optimize is false, minify is forced to false", ({ expect }) => {
        expect(getMinifyConfig(false, true)).toBe(false);
    });

    test.concurrent("when optimize is \"readable\", return SWC options with mangle disabled", ({ expect }) => {
        const result = getMinifyConfig("readable", true) as Exclude<Minify, boolean>;

        expect(result.jsOptions?.minimizerOptions?.mangle).toBe(false);
    });
});

describe("getOptimizationConfig", () => {
    test.concurrent("when optimize is true, return undefined to defer to Rsbuild defaults", ({ expect }) => {
        expect(getOptimizationConfig(true)).toBeUndefined();
    });

    test.concurrent("when optimize is false, chunkIds and moduleIds are set to \"named\"", ({ expect }) => {
        const result = getOptimizationConfig(false);

        expect(result?.chunkIds).toBe("named");
        expect(result?.moduleIds).toBe("named");
    });

    test.concurrent("when optimize is false, concatenateModules and usedExports are disabled", ({ expect }) => {
        const result = getOptimizationConfig(false);

        expect(result?.concatenateModules).toBe(false);
        expect(result?.usedExports).toBe(false);
    });

    test.concurrent("when optimize is \"readable\", chunkIds and moduleIds are set to \"named\"", ({ expect }) => {
        const result = getOptimizationConfig("readable");

        expect(result?.chunkIds).toBe("named");
        expect(result?.moduleIds).toBe("named");
    });

    test.concurrent("when optimize is \"readable\", mangleExports is disabled", ({ expect }) => {
        const result = getOptimizationConfig("readable");

        expect(result?.mangleExports).toBe(false);
    });
});

test.concurrent("by default, the output.polyfill option is set to \"usage\"", ({ expect }) => {
    const result = defineBuildConfig();

    expect(result.output?.polyfill).toBe("usage");
});

test.concurrent("when polyfill is provided, the output.polyfill option is the provided value", ({ expect }) => {
    const result = defineBuildConfig({
        polyfill: "off"
    });

    expect(result.output?.polyfill).toBe("off");
});

test.concurrent("by default, the splitChunks option uses the \"per-package\" preset", ({ expect }) => {
    const result = defineBuildConfig();

    const splitChunks = result.splitChunks as SplitChunksConfig;

    expect(splitChunks.preset).toBe("per-package");
    expect(splitChunks.chunks).toBe("all");
});

test.concurrent("when splitChunks is provided, the splitChunks option is the provided value", ({ expect }) => {
    const splitChunks: SplitChunksConfig = {
        preset: "single-vendor",
        chunks: "all"
    };

    const result = defineBuildConfig({
        splitChunks
    });

    expect(result.splitChunks).toBe(splitChunks);
});

test.concurrent("when splitChunks is false, the splitChunks option is false", ({ expect }) => {
    const result = defineBuildConfig({
        splitChunks: false
    });

    expect(result.splitChunks).toBe(false);
});
