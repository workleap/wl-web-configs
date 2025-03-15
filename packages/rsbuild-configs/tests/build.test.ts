import type { RsbuildConfig, RsbuildPlugin, SourceMap } from "@rsbuild/core";
import { describe, test, vi } from "vitest";
import type { RsbuildConfigTransformer } from "../src/applyTransformers.ts";
import { defineBuildConfig, getOptimizationConfig } from "../src/build.ts";

test.concurrent("when an entry prop is provided, the source.entry option is the provided value", ({ expect }) => {
    const result = defineBuildConfig({
        entry: {
            index: "./a-new-entry.ts"
        }
    });

    expect(result!.source!.entry!.index).toBe("./a-new-entry.ts");
});

test.concurrent("when a dist path is provided, the output.distpath option is the provided value", ({ expect }) => {
    const result = defineBuildConfig({
        distPath: {
            root: "./a-new-output-path"
        }
    });

    expect(result.output!.distPath!.root).toBe("./a-new-output-path");
});

test.concurrent("when an asset prefix is provided, the output.assetPrefix option is the provided value", ({ expect }) => {
    const result = defineBuildConfig({
        assetPrefix: "a-valid-public-path-ending-with-a-trailing-slash/"
    });

    expect(result.output!.assetPrefix).toBe("a-valid-public-path-ending-with-a-trailing-slash/");
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
        config.output = config.output ?? {};
        config.output.distPath = config.output.distPath ?? {};
        config.output.distPath.js = "a-custom-dist-path-in-a-tranformer";

        return config;
    };

    const result = defineBuildConfig({
        transformers: [entryTransformer, distPathTransformer]
    });

    expect(result.source!.entry!.index).toBe("a-custom-value-in-a-transformer");
    expect(result.output!.distPath!.js).toBe("a-custom-dist-path-in-a-tranformer");
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

describe("getOptimizationConfig", () => {
    test.concurrent("when optimize is true, minimize is set to true", ({ expect }) => {
        const result = getOptimizationConfig(true);

        expect(result.minimize).toBeTruthy();
    });

    test.concurrent("when optimize is false, minimize is set to false", ({ expect }) => {
        const result = getOptimizationConfig(false);

        expect(result.minimize).toBeFalsy();
    });

    test.concurrent("when optimize is \"readable\", minimize is set to true", ({ expect }) => {
        const result = getOptimizationConfig("readable");

        expect(result.minimize).toBeTruthy();
    });

    test.concurrent("when optimize is false, chunkIds is set to \"named\"", ({ expect }) => {
        const result = getOptimizationConfig(false);

        expect(result.chunkIds).toBe("named");
    });

    test.concurrent("when optimize is false, moduleIds is set to \"named\"", ({ expect }) => {
        const result = getOptimizationConfig(false);

        expect(result.chunkIds).toBe("named");
    });

    test.concurrent("when optimize is \"readable\", chunkIds is set to \"named\"", ({ expect }) => {
        const result = getOptimizationConfig("readable");

        expect(result.chunkIds).toBe("named");
    });

    test.concurrent("when optimize is \"readable\", moduleIds is set to \"named\"", ({ expect }) => {
        const result = getOptimizationConfig("readable");

        expect(result.chunkIds).toBe("named");
    });

    test.concurrent("when optimize is false, do not include minimizer configuration", ({ expect }) => {
        const result = getOptimizationConfig(false);

        expect(result.minimizer).toBeUndefined();
    });

    test.concurrent("when optimize is \"readable\", include minify configuration", ({ expect }) => {
        const result = getOptimizationConfig("readable");

        expect(result.minimizer).toBeDefined();
    });
});


