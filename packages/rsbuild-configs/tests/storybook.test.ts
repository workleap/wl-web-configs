import type { DistPathConfig, RsbuildConfig, RsbuildPlugin, SourceMap } from "@rsbuild/core";
import { test, vi } from "vitest";
import type { RsbuildConfigTransformer } from "../src/applyTransformers.ts";
import { defineStorybookConfig } from "../src/storybook.ts";

test.concurrent("when additional plugins are provided, append the provided plugins at the end of the plugins array", ({ expect }) => {
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

test.concurrent("when sourceMap is false, the output.sourceMap option is false", ({ expect }) => {
    const result = defineStorybookConfig({
        sourceMap: false
    });

    expect(result.output?.sourceMap).toBeFalsy();
});

test.concurrent("when sourceMap is an object, the output.sourceMap option is the object", ({ expect }) => {
    const sourceMap: SourceMap = {
        js: false,
        css: false
    };

    const result = defineStorybookConfig({
        sourceMap
    });

    expect(result.output?.sourceMap).toBe(sourceMap);
});

test.concurrent("when react is false, the react plugin is not included", ({ expect }) => {
    const result = defineStorybookConfig({
        react: false
    });

    const plugin = result.plugins?.find(x => (x as RsbuildPlugin).name === "rsbuild:react");

    expect(plugin).toBeUndefined();
});

test.concurrent("when react is a function, the function is executed", ({ expect }) => {
    const fct = vi.fn();

    defineStorybookConfig({
        react: fct
    });

    expect(fct).toHaveBeenCalledTimes(1);
});

test.concurrent("when svgr is false, the svgr plugin is not included", ({ expect }) => {
    const result = defineStorybookConfig({
        svgr: false
    });

    const plugin = result.plugins?.find(x => (x as RsbuildPlugin).name === "rsbuild:svgr");

    expect(plugin).toBeUndefined();
});

test.concurrent("when svgr is a function, the function is executed", ({ expect }) => {
    const fct = vi.fn();

    defineStorybookConfig({
        svgr: fct
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

    const result = defineStorybookConfig({
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

    const result = defineStorybookConfig({
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
        config.output.distPath = (config.output.distPath ?? {}) as DistPathConfig;
        config.output.distPath.js = "a-custom-dist-path-in-a-tranformer";

        return config;
    };

    const result = defineStorybookConfig({
        transformers: [entryTransformer, distPathTransformer]
    });

    expect(result.source!.entry!.index).toBe("a-custom-value-in-a-transformer");
    expect((result.output!.distPath as DistPathConfig).js).toBe("a-custom-dist-path-in-a-tranformer");
});

test.concurrent("transformers context environment is \"storybook\"", ({ expect }) => {
    const mockTransformer = vi.fn();

    defineStorybookConfig({
        transformers: [mockTransformer]
    });

    expect(mockTransformer).toHaveBeenCalledWith(expect.anything(), { environment: "storybook", verbose: false });
});

test.concurrent("when the verbose option is true, the transformers context verbose value is \"true\"", ({ expect }) => {
    const mockTransformer = vi.fn();

    defineStorybookConfig({
        verbose: true,
        transformers: [mockTransformer]
    });

    expect(mockTransformer).toHaveBeenCalledWith(expect.anything(), { environment: "storybook", verbose: true });
});
