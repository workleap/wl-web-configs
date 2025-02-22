import type { RsbuildPlugin, SourceMap } from "@rsbuild/core";
import type { RslibConfig } from "@rslib/core";
import type { RslibConfigTransformer } from "../src/applyTransformers.ts";
import { defineBuildConfig } from "../src/build.ts";

test("when an entry prop is provided, the source.entry option is the provided value", () => {
    const result = defineBuildConfig({
        entry: {
            index: "./a-new-entry.ts"
        },
        tsconfigPath: "./build.json"
    });

    expect(result.source?.entry!.index).toBe("./a-new-entry.ts");
});

test("when a syntax prop is provided, the lib.syntax option is the provided value", () => {
    const result = defineBuildConfig({
        syntax: "es2015",
        tsconfigPath: "./build.json"
    });

    expect(result.lib[0]?.syntax).toBe("es2015");
});

test("when bundle is false and the tsconfigPath option is not provided, throw an error", () => {
    expect(() => defineBuildConfig({ bundle: false })).toThrow(/When the "bundle" option is "false", a "tsconfigPath" option must be provided./);
});

test("when bundle is false, the default source.entry option is \"./src/**\"", () => {
    const result = defineBuildConfig({
        bundle: false,
        tsconfigPath: "./build.json"
    });

    expect(result.source?.entry?.index).toBe("./src/**");
});

test("when bundle is true and the tsconfigPath option is not provided, do not throw an error", () => {
    expect(() => defineBuildConfig({ bundle: true })).not.toThrow();
});

test("when bundle is true, the lib.bundle option is true", () => {
    const result = defineBuildConfig({
        bundle: true
    });

    expect(result.lib[0]?.bundle).toBeTruthy();
});

test("when bundle is true, the default source.entry option is [\"./src/index.ts\", \"./src/index.js\"]", () => {
    const result = defineBuildConfig({
        bundle: true
    });

    expect(result.source?.entry?.index).toEqual(["./src/index.ts", "./src/index.js"]);
});

test("when dts is false, the lib.dts option is true", () => {
    const result = defineBuildConfig({
        dts: false,
        tsconfigPath: "./build.json"
    });

    expect(result.lib[0]?.dts).toBeFalsy();
});

test("when a target is provided, the output.target option is the provided value", () => {
    const result = defineBuildConfig({
        target: "node",
        tsconfigPath: "./build.json"
    });

    expect(result.output?.target).toBe("node");
});

test("when a dist path is provided, the output.distPath option is the provided value", () => {
    const result = defineBuildConfig({
        distPath: {
            js: "./dist-path"
        },
        tsconfigPath: "./build.json"
    });

    expect(result.output?.distPath?.js).toBe("./dist-path");
});

test("when additional plugins are provided, append the provided plugins at the end of the plugins array", () => {
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
        ],
        tsconfigPath: "./build.json"
    });

    const pluginsCount = result.plugins!.length;

    expect(result.plugins![pluginsCount - 2]).toBe(plugin1);
    expect(result.plugins![pluginsCount - 1]).toBe(plugin2);
});

test("when sourceMap is false, the output.sourceMap option is false", () => {
    const result = defineBuildConfig({
        sourceMap: false,
        tsconfigPath: "./build.json"
    });

    expect(result.output?.sourceMap).toBeFalsy();
});

test("when sourceMap is an object, the output.sourceMap option is the object", () => {
    const sourceMap: SourceMap = {
        js: false,
        css: false
    };

    const result = defineBuildConfig({
        sourceMap,
        tsconfigPath: "./build.json"
    });

    expect(result.output?.sourceMap).toBe(sourceMap);
});

test("when react is false, the react plugin is not included", () => {
    const result = defineBuildConfig({
        tsconfigPath: "./build.json"
    });

    const plugin = result.plugins?.find(x => (x as RsbuildPlugin).name === "rsbuild:react");

    expect(plugin).toBeUndefined();
});

test("when react is true, the react plugin is included", () => {
    const result = defineBuildConfig({
        react: true,
        tsconfigPath: "./build.json"
    });

    const plugin = result.plugins?.find(x => (x as RsbuildPlugin).name === "rsbuild:react");

    expect(plugin).toBeDefined();
});

test("when react is a function, the function is executed", () => {
    const fct = jest.fn();

    defineBuildConfig({
        react: fct,
        tsconfigPath: "./build.json"
    });

    expect(fct).toHaveBeenCalledTimes(1);
});

test("when svgr is false, the svgr plugin is not included", () => {
    const result = defineBuildConfig({
        tsconfigPath: "./build.json"
    });

    const plugin = result.plugins?.find(x => (x as RsbuildPlugin).name === "rsbuild:svgr");

    expect(plugin).toBeUndefined();
});

test("when svgr is true, the svgr plugin is included", () => {
    const result = defineBuildConfig({
        svgr: true,
        tsconfigPath: "./build.json"
    });

    const plugin = result.plugins?.find(x => (x as RsbuildPlugin).name === "rsbuild:svgr");

    expect(plugin).toBeDefined();
});

test("when svgr is a function, the function is executed", () => {
    const fct = jest.fn();

    defineBuildConfig({
        svgr: fct,
        tsconfigPath: "./build.json"
    });

    expect(fct).toHaveBeenCalledTimes(1);
});

test("when a transformer is provided, and the transformer update the existing configuration object, the transformer is applied on the Rslib config", () => {
    const entryTransformer: RslibConfigTransformer = (config: RslibConfig) => {
        config.source = config.source ?? {};
        config.source.entry = {
            index: "a-custom-value-in-a-transformer"
        };

        return config;
    };

    const result = defineBuildConfig({
        transformers: [entryTransformer],
        tsconfigPath: "./build.json"
    });

    expect(result.source!.entry!.index).toBe("a-custom-value-in-a-transformer");
});

test("when a transformer is provided, and the transformer returns a new configuration object, the transformer is applied on the Rslib config", () => {
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

    const result = defineBuildConfig({
        transformers: [entryTransformer],
        tsconfigPath: "./build.json"
    });

    expect(result.source!.entry!.index).toBe("a-custom-value-in-a-transformer");
});

test("when multiple transformers are provided, all the transformers are applied on the webpack config", () => {
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
        config.output.distPath.js = "a-custom-dist-path-in-a-tranformer";

        return config;
    };

    const result = defineBuildConfig({
        transformers: [entryTransformer, distPathTransformer],
        tsconfigPath: "./build.json"
    });

    expect(result.source!.entry!.index).toBe("a-custom-value-in-a-transformer");
    expect(result.output!.distPath!.js).toBe("a-custom-dist-path-in-a-tranformer");
});

test("transformers context environment is \"build\"", () => {
    const mockTransformer = jest.fn();

    defineBuildConfig({
        transformers: [mockTransformer],
        tsconfigPath: "./build.json"
    });

    expect(mockTransformer).toHaveBeenCalledWith(expect.anything(), { environment: "build" });
});
