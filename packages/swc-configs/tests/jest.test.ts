import type { EsParserConfig, Config as SwcConfig, TsParserConfig } from "@swc/core";
import { describe, test, vi } from "vitest";
import type { SwcConfigTransformer } from "../src/applyTransformers.ts";
import { defineJestConfig } from "../src/jest.ts";

describe("typescript parser", () => {
    test.concurrent("when react is true, the react transform configuration is included", ({ expect }) => {
        const result = defineJestConfig({
            parser: "typescript",
            react: true
        });

        expect(result.jsc?.transform?.react).toBeDefined();
    });

    test.concurrent("when react is true, tsx parsing is enabled", ({ expect }) => {
        const result = defineJestConfig({
            parser: "typescript",
            react: true
        });

        expect((result.jsc?.parser as TsParserConfig).tsx).toBeTruthy();
    });

    test.concurrent("when react is false, the react transform configuration is not included", ({ expect }) => {
        const result = defineJestConfig({
            parser: "typescript",
            react: false
        });

        expect(result.jsc?.transform?.react).toBeUndefined();
    });

    test.concurrent("when react is false, tsx parsing is disabled", ({ expect }) => {
        const result = defineJestConfig({
            parser: "typescript",
            react: false
        });

        expect((result.jsc?.parser as TsParserConfig).tsx).toBeFalsy();
    });
});

describe("ecmascript parser", () => {
    test.concurrent("when react is true, the react transform configuration is included", ({ expect }) => {
        const result = defineJestConfig({
            parser: "ecmascript",
            react: true
        });

        expect(result.jsc?.transform?.react).toBeDefined();
    });

    test.concurrent("when react is true, jsx parsing is enabled", ({ expect }) => {
        const result = defineJestConfig({
            parser: "ecmascript",
            react: true
        });

        expect((result.jsc?.parser as EsParserConfig).jsx).toBeTruthy();
    });

    test.concurrent("when react is false, the react transform configuration is not included", ({ expect }) => {
        const result = defineJestConfig({
            parser: "ecmascript",
            react: false
        });

        expect(result.jsc?.transform?.react).toBeUndefined();
    });

    test.concurrent("when react is false, jsx parsing is disabled", ({ expect }) => {
        const result = defineJestConfig({
            parser: "ecmascript",
            react: false
        });

        expect((result.jsc?.parser as EsParserConfig).jsx).toBeFalsy();
    });
});

test.concurrent("when a transformer is provided, and the transformer update the existing configuration object, the transformer is applied on the swc config", ({ expect }) => {
    const minifyTransformer: SwcConfigTransformer = (config: SwcConfig) => {
        config.minify = true;

        return config;
    };

    const result = defineJestConfig({
        transformers: [minifyTransformer]
    });

    expect(result.minify).toBeTruthy();
});

test.concurrent("when a transformer is provided, and the transformer returns a new configuration object, the transformer is applied on the swc config", ({ expect }) => {
    const minifyTransformer: SwcConfigTransformer = () => {
        return {
            minify: true
        };
    };

    const result = defineJestConfig({
        transformers: [minifyTransformer]
    });

    expect(result.minify).toBeTruthy();
});

test.concurrent("when multiple transformers are provided, all the transformers are applied on the swc config", ({ expect }) => {
    const minifyTransformer: SwcConfigTransformer = (config: SwcConfig) => {
        config.minify = true;

        return config;
    };

    const sourceMapsTransformer: SwcConfigTransformer = (config: SwcConfig) => {
        config.sourceMaps = true;

        return config;
    };

    const result = defineJestConfig({
        transformers: [minifyTransformer, sourceMapsTransformer]
    });

    expect(result.minify).toBeTruthy();
    expect(result.sourceMaps).toBeTruthy();
});

test.concurrent("transformers context environment is \"dev\"", ({ expect }) => {
    const mockTransformer = vi.fn();

    defineJestConfig({
        transformers: [mockTransformer]
    });

    expect(mockTransformer).toHaveBeenCalledWith(expect.anything(), { environment: "jest" });
});

test.concurrent("when a baseUrl is provided, the baseUrl value is added to the configuration", ({ expect }) => {
    const result = defineJestConfig({
        baseUrl: "./src"
    });

    expect(result.jsc?.baseUrl).toBe("./src");
});

test.concurrent("when a paths is provided, the paths value is added to the configuration", ({ expect }) => {
    const paths = {
        "@/*": ["*"]
    };

    const result = defineJestConfig({
        paths
    });

    expect(result.jsc?.paths).toBe(paths);
});
