import type { RsbuildPlugin, SourceMap } from "@rsbuild/core";
import type { RslibConfig } from "@rslib/core";
import type { RslibConfigTransformer } from "../src/applyTransformers.ts";
import { defineStorybookConfig } from "../src/storybook.ts";

test("when additional plugins are provided, append the provided plugins at the end of the plugins array", () => {
    const plugin1: RsbuildPlugin = {
        name: "plugin-1",
        setup: () => {}
    };

    const plugin2: RsbuildPlugin = {
        name: "plugin-2",
        setup: () => {}
    };

    const result = defineStorybookConfig({
        plugins: [
            plugin1,
            plugin2
        ]
    });

    const pluginsCount = result.plugins!.length;

    expect(result.plugins![pluginsCount - 2]).toBe(plugin1);
    expect(result.plugins![pluginsCount - 1]).toBe(plugin2);
});

test("when sourceMap is false, the output.sourceMap option is false", () => {
    const result = defineStorybookConfig({
        sourceMap: false
    });

    expect(result.output?.sourceMap).toBeFalsy();
});

test("when sourceMap is an object, the output.sourceMap option is the object", () => {
    const sourceMap: SourceMap = {
        js: false,
        css: false
    };

    const result = defineStorybookConfig({
        sourceMap
    });

    expect(result.output?.sourceMap).toBe(sourceMap);
});

test("when react is false, the react plugin is not included", () => {
    const result = defineStorybookConfig({
        react: false
    });

    const plugin = result.plugins?.find(x => (x as RsbuildPlugin).name === "rsbuild:react");

    expect(plugin).toBeUndefined();
});

test("when react is a function, the function is executed", () => {
    const fct = jest.fn();

    defineStorybookConfig({
        react: fct
    });

    expect(fct).toHaveBeenCalledTimes(1);
});

test("when svgr is false, the svgr plugin is not included", () => {
    const result = defineStorybookConfig({
        svgr: false
    });

    const plugin = result.plugins?.find(x => (x as RsbuildPlugin).name === "rsbuild:svgr");

    expect(plugin).toBeUndefined();
});

test("when svgr is a function, the function is executed", () => {
    const fct = jest.fn();

    defineStorybookConfig({
        svgr: fct
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

    const result = defineStorybookConfig({
        transformers: [entryTransformer]
    });

    expect(result.source!.entry!.index).toBe("a-custom-value-in-a-transformer");
});

test("when a transformer is provided, and the transformer returns a new configuration object, the transformer is applied on the Rslib config", () => {
    const entryTransformer: RslibConfigTransformer = (config: RslibConfig) => {
        config.source = config.source ?? {};
        config.source.entry = {
            index: "a-custom-value-in-a-transformer"
        };

        return config;
    };

    const result = defineStorybookConfig({
        transformers: [entryTransformer]
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

    const result = defineStorybookConfig({
        transformers: [entryTransformer, distPathTransformer]
    });

    expect(result.source!.entry!.index).toBe("a-custom-value-in-a-transformer");
    expect(result.output!.distPath!.js).toBe("a-custom-dist-path-in-a-tranformer");
});

test("transformers context environment is \"storybook\"", () => {
    const mockTransformer = jest.fn();

    defineStorybookConfig({
        transformers: [mockTransformer]
    });

    expect(mockTransformer).toHaveBeenCalledWith(expect.anything(), { environment: "storybook" });
});
