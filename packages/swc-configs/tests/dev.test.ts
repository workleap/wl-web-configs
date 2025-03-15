import type { EsParserConfig, Config as SwcConfig, TsParserConfig } from "@swc/core";
import { test, vi } from "vitest";
import type { SwcConfigTransformer } from "../src/applyTransformers.ts";
import { defineDevConfig } from "../src/dev.ts";

const Targets = {
    chrome: "116"
};

test.concurrent("provided browsers are set as \"env.targets\"", ({ expect }) => {
    const result = defineDevConfig(Targets);

    expect(result.env?.targets).toBe(Targets);
});

test.concurrent("when fastRefresh is true, react refresh is true", ({ expect }) => {
    const result = defineDevConfig(Targets, {
        fastRefresh: true
    });

    expect(result.jsc?.transform?.react?.refresh).toBeTruthy();
});

test.concurrent("when fastRefresh is false, react refresh is false", ({ expect }) => {
    const result = defineDevConfig(Targets, {
        fastRefresh: false
    });

    expect(result.jsc?.transform?.react?.refresh).toBeFalsy();
});

test.concurrent("when parser is \"ecmascript\", the configuration parser is ecmascript", ({ expect }) => {
    const result = defineDevConfig(Targets, {
        parser: "ecmascript"
    });

    expect(result.jsc?.parser?.syntax).toBe("ecmascript");
});

test.concurrent("when parser is \"ecmascript\", jsx parsing is enabled", ({ expect }) => {
    const result = defineDevConfig(Targets, {
        parser: "ecmascript"
    });

    expect((result.jsc?.parser as EsParserConfig).jsx).toBeTruthy();
});

test.concurrent("when parser is \"typescript\", the configuration parser is typescript", ({ expect }) => {
    const result = defineDevConfig(Targets, {
        parser: "typescript"
    });

    expect(result.jsc?.parser?.syntax).toBe("typescript");
});

test.concurrent("when parser is \"typescript\", tsx parsing is enabled", ({ expect }) => {
    const result = defineDevConfig(Targets, {
        parser: "typescript"
    });

    expect((result.jsc?.parser as TsParserConfig).tsx).toBeTruthy();
});

test.concurrent("when a transformer is provided, and the transformer update the existing configuration object, the transformer is applied on the swc config", ({ expect }) => {
    const minifyTransformer: SwcConfigTransformer = (config: SwcConfig) => {
        config.minify = true;

        return config;
    };

    const result = defineDevConfig(Targets, {
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

    const result = defineDevConfig(Targets, {
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

    const result = defineDevConfig(Targets, {
        transformers: [minifyTransformer, sourceMapsTransformer]
    });

    expect(result.minify).toBeTruthy();
    expect(result.sourceMaps).toBeTruthy();
});

test.concurrent("transformers context environment is \"dev\"", ({ expect }) => {
    const mockTransformer = vi.fn();

    defineDevConfig(Targets, {
        transformers: [mockTransformer]
    });

    expect(mockTransformer).toHaveBeenCalledWith(expect.anything(), { environment: "dev" });
});

test.concurrent("when a baseUrl is provided, the baseUrl value is added to the configuration", ({ expect }) => {
    const result = defineDevConfig(Targets, {
        baseUrl: "./src"
    });

    expect(result.jsc?.baseUrl).toBe("./src");
});

test.concurrent("when a paths is provided, the paths value is added to the configuration", ({ expect }) => {
    const paths = {
        "@/*": ["*"]
    };

    const result = defineDevConfig(Targets, {
        paths
    });

    expect(result.jsc?.paths).toBe(paths);
});
