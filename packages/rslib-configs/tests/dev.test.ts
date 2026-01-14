import type { Rsbuild, RslibConfig } from "@rslib/core";
import { test, vi } from "vitest";
import type { RslibConfigTransformer } from "../src/applyTransformers.ts";
import { defineDevConfig } from "../src/dev.ts";

test.concurrent("when an entry prop is provided, the source.entry option is the provided value", ({ expect }) => {
    const result = defineDevConfig({
        entry: {
            index: "./a-new-entry.ts"
        },
        tsconfigPath: "./build.json"
    });

    expect(result.source?.entry!.index).toBe("./a-new-entry.ts");
});

test.concurrent("when a syntax prop is provided, the lib.syntax option is the provided value", ({ expect }) => {
    const result = defineDevConfig({
        syntax: "es2015",
        tsconfigPath: "./build.json"
    });

    expect(result.lib[0]?.syntax).toBe("es2015");
});

test.concurrent("when bundle is false and the tsconfigPath option is not provided, throw an error", ({ expect }) => {
    expect(() => defineDevConfig({ bundle: false })).toThrow(/When the "bundle" option is "false", a "tsconfigPath" option must be provided./);
});

test.concurrent("when bundle is false, the default source.entry option is \"./src/**\"", ({ expect }) => {
    const result = defineDevConfig({
        bundle: false,
        tsconfigPath: "./build.json"
    });

    expect(result.source?.entry?.index).toBe("./src/**");
});

test.concurrent("when bundle is true and the tsconfigPath option is not provided, do not throw an error", ({ expect }) => {
    expect(() => defineDevConfig({ bundle: true })).not.toThrow();
});

test.concurrent("when bundle is true, the lib.bundle option is true", ({ expect }) => {
    const result = defineDevConfig({
        bundle: true
    });

    expect(result.lib[0]?.bundle).toBeTruthy();
});

test.concurrent("when bundle is true, the default source.entry option is [\"./src/index.ts\", \"./src/index.js\"]", ({ expect }) => {
    const result = defineDevConfig({
        bundle: true
    });

    expect(result.source?.entry?.index).toEqual(["./src/index.ts", "./src/index.js"]);
});

test.concurrent("when dts is true, the lib.dts option is true", ({ expect }) => {
    const result = defineDevConfig({
        dts: true,
        tsconfigPath: "./build.json"
    });

    expect(result.lib[0]?.dts).toBeTruthy();
});

test.concurrent("when a target is provided, the output.target option is the provided value", ({ expect }) => {
    const result = defineDevConfig({
        target: "node",
        tsconfigPath: "./build.json"
    });

    expect(result.output?.target).toBe("node");
});

test.concurrent("when a dist path is provided, the output.distPath option is the provided value", ({ expect }) => {
    const result = defineDevConfig({
        distPath: {
            js: "./dist-path"
        },
        tsconfigPath: "./build.json"
    });

    expect((result.output?.distPath as Rsbuild.DistPathConfig).js).toBe("./dist-path");
});

test.concurrent("when additional plugins are provided, append the provided plugins at the end of the plugins array", ({ expect }) => {
    const plugin1: Rsbuild.RsbuildPlugin = {
        name: "plugin-1",
        setup: () => {}
    };

    const plugin2: Rsbuild.RsbuildPlugin = {
        name: "plugin-2",
        setup: () => {}
    };

    const result = defineDevConfig({
        plugins: [
            plugin1,
            plugin2
        ],
        tsconfigPath: "./build.json"
    });

    const pluginsCount = result.plugins!.length;

    expect(result.plugins![pluginsCount - 2]).toBe(plugin1);
    expect(result.plugins![pluginsCount - 1]).toBe(plugin2);
});

test.concurrent("when sourceMap is false, the output.sourceMap option is false", ({ expect }) => {
    const result = defineDevConfig({
        sourceMap: false,
        tsconfigPath: "./build.json"
    });

    expect(result.output?.sourceMap).toBeFalsy();
});

test.concurrent("when sourceMap is an object, the output.sourceMap option is the object", ({ expect }) => {
    const sourceMap: Rsbuild.SourceMap = {
        js: false,
        css: false
    };

    const result = defineDevConfig({
        sourceMap,
        tsconfigPath: "./build.json"
    });

    expect(result.output?.sourceMap).toBe(sourceMap);
});

test.concurrent("when react is false, the react plugin is not included", ({ expect }) => {
    const result = defineDevConfig({
        tsconfigPath: "./build.json"
    });

    const plugin = result.plugins?.find(x => (x as Rsbuild.RsbuildPlugin).name === "rsbuild:react");

    expect(plugin).toBeUndefined();
});

test.concurrent("when react is true, the react plugin is included", ({ expect }) => {
    const result = defineDevConfig({
        react: true,
        tsconfigPath: "./build.json"
    });

    const plugin = result.plugins?.find(x => (x as Rsbuild.RsbuildPlugin).name === "rsbuild:react");

    expect(plugin).toBeDefined();
});

test.concurrent("when react is a function, the function is executed", ({ expect }) => {
    const fct = vi.fn();

    defineDevConfig({
        react: fct,
        tsconfigPath: "./build.json"
    });

    expect(fct).toHaveBeenCalledTimes(1);
});

test.concurrent("when svgr is false, the svgr plugin is not included", ({ expect }) => {
    const result = defineDevConfig({
        tsconfigPath: "./build.json"
    });

    const plugin = result.plugins?.find(x => (x as Rsbuild.RsbuildPlugin).name === "rsbuild:svgr");

    expect(plugin).toBeUndefined();
});

test.concurrent("when svgr is true, the svgr plugin is included", ({ expect }) => {
    const result = defineDevConfig({
        svgr: true,
        tsconfigPath: "./build.json"
    });

    const plugin = result.plugins?.find(x => (x as Rsbuild.RsbuildPlugin).name === "rsbuild:svgr");

    expect(plugin).toBeDefined();
});

test.concurrent("when svgr is a function, the function is executed", ({ expect }) => {
    const fct = vi.fn();

    defineDevConfig({
        svgr: fct,
        tsconfigPath: "./build.json"
    });

    expect(fct).toHaveBeenCalledTimes(1);
});

test.concurrent("when a transformer is provided, and the transformer update the existing configuration object, the transformer is applied on the Rslib config", ({ expect }) => {
    const entryTransformer: RslibConfigTransformer = (config: RslibConfig) => {
        config.source = config.source ?? {};
        config.source.entry = {
            index: "a-custom-value-in-a-transformer"
        };

        return config;
    };

    const result = defineDevConfig({
        transformers: [entryTransformer],
        tsconfigPath: "./build.json"
    });

    expect(result.source!.entry!.index).toBe("a-custom-value-in-a-transformer");
});

test.concurrent("when a transformer is provided, and the transformer returns a new configuration object, the transformer is applied on the Rslib config", ({ expect }) => {
    const entryTransformer: RslibConfigTransformer = () => {
        return {
            lib: [],
            source: {
                entry: {
                    index: "a-custom-value-in-a-transformer"
                }
            }
        };
    };

    const result = defineDevConfig({
        transformers: [entryTransformer],
        tsconfigPath: "./build.json"
    });

    expect(result.source!.entry!.index).toBe("a-custom-value-in-a-transformer");
});

test.concurrent("when multiple transformers are provided, all the transformers are applied on the webpack config", ({ expect }) => {
    const entryTransformer: RslibConfigTransformer = (config: RslibConfig) => {
        config.source = config.source ?? {};
        config.source.entry = {
            index: "a-custom-value-in-a-transformer"
        };

        return config;
    };

    const distPathTransformer: RslibConfigTransformer = (config: RslibConfig) => {
        config.output = config.output ?? {};
        config.output.distPath = config.output.distPath ?? {};
        (config.output.distPath as Rsbuild.DistPathConfig).js = "a-custom-dist-path-in-a-tranformer";

        return config;
    };

    const result = defineDevConfig({
        transformers: [entryTransformer, distPathTransformer],
        tsconfigPath: "./build.json"
    });

    expect(result.source!.entry!.index).toBe("a-custom-value-in-a-transformer");
    expect((result.output!.distPath as Rsbuild.DistPathConfig).js).toBe("a-custom-dist-path-in-a-tranformer");
});

test.concurrent("transformers context environment is \"dev\"", ({ expect }) => {
    const mockTransformer = vi.fn();

    defineDevConfig({
        transformers: [mockTransformer],
        tsconfigPath: "./build.json"
    });

    expect(mockTransformer).toHaveBeenCalledWith(expect.anything(), { environment: "dev" });
});
