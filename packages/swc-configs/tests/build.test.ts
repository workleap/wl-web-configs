import type { EsParserConfig, Config as SwcConfig, TsParserConfig } from "@swc/core";
import { test, vi } from "vitest";
import type { SwcConfigTransformer } from "../src/applyTransformers.ts";
import { defineBuildConfig } from "../src/build.ts";

const Targets = {
    chrome: "116"
};

test.concurrent("provided browsers are set as \"env.targets\"", ({ expect }) => {
    const result = defineBuildConfig(Targets);

    expect(result.env?.targets).toBe(Targets);
});

test.concurrent("when parser is \"ecmascript\", the configuration parser is ecmascript", ({ expect }) => {
    const result = defineBuildConfig(Targets, {
        parser: "ecmascript"
    });

    expect(result.jsc?.parser?.syntax).toBe("ecmascript");
});

test.concurrent("when parser is \"ecmascript\", jsx parsing is enabled", ({ expect }) => {
    const result = defineBuildConfig(Targets, {
        parser: "ecmascript"
    });

    expect((result.jsc?.parser as EsParserConfig).jsx).toBeTruthy();
});

test.concurrent("when parser is \"typescript\", the configuration parser is typescript", ({ expect }) => {
    const result = defineBuildConfig(Targets, {
        parser: "typescript"
    });

    expect(result.jsc?.parser?.syntax).toBe("typescript");
});

test.concurrent("when parser is \"typescript\", tsx parsing is enabled", ({ expect }) => {
    const result = defineBuildConfig(Targets, {
        parser: "typescript"
    });

    expect((result.jsc?.parser as TsParserConfig).tsx).toBeTruthy();
});

test.concurrent("when a transformer is provided, and the transformer update the existing configuration object, the transformer is applied on the swc config", ({ expect }) => {
    const minifyTransformer: SwcConfigTransformer = (config: SwcConfig) => {
        config.minify = true;

        return config;
    };

    const result = defineBuildConfig(Targets, {
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

    const result = defineBuildConfig(Targets, {
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

    const result = defineBuildConfig(Targets, {
        transformers: [minifyTransformer, sourceMapsTransformer]
    });

    expect(result.minify).toBeTruthy();
    expect(result.sourceMaps).toBeTruthy();
});

test.concurrent("transformers context environment is \"build\"", ({ expect }) => {
    const mockTransformer = vi.fn();

    defineBuildConfig(Targets, {
        transformers: [mockTransformer]
    });

    expect(mockTransformer).toHaveBeenCalledWith(expect.anything(), { environment: "build" });
});

test.concurrent("when a baseUrl is provided, the baseUrl value is added to the configuration", ({ expect }) => {
    const result = defineBuildConfig(Targets, {
        baseUrl: "./src"
    });

    expect(result.jsc?.baseUrl).toBe("./src");
});

test.concurrent("when a paths is provided, the paths value is added to the configuration", ({ expect }) => {
    const paths = {
        "@/*": ["*"]
    };

    const result = defineBuildConfig(Targets, {
        paths
    });

    expect(result.jsc?.paths).toBe(paths);
});
