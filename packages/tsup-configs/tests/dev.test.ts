import type { Options } from "tsup";
import { test, vi } from "vitest";
import type { TsupConfigTransformer } from "../src/applyTransformers.ts";
import { defineDevConfig } from "../src/dev.ts";

test.concurrent("when options are provided, options are merged with the default options", ({ expect }) => {
    const result = defineDevConfig({
        env: {
            "foo": "bar"
        }
    });

    expect(result.env!["foo"]).toBe("bar");
    expect(result.dts).toBeTruthy();
});

test.concurrent("when a provided option match a default option, override the default option", ({ expect }) => {
    const result = defineDevConfig({
        platform: "node"
    });

    expect(result.platform).toBe("node");
});

test.concurrent("when a format array option is provided, do not merge the provided array with the default format", ({ expect }) => {
    const result = defineDevConfig({
        format: ["cjs"]
    });

    expect(result.format?.length).toBe(1);
    expect(result.format![0]).toBe("cjs");
});

test.concurrent("when a transformer is provided, and the transformer update the existing configuration object, the transformer is applied on the tsup config", ({ expect }) => {
    const platformTransformer: TsupConfigTransformer = (config: Options) => {
        config.platform = "node";

        return config;
    };

    const result = defineDevConfig({
        transformers: [platformTransformer]
    });

    expect(result.platform).toBe("node");
});

test.concurrent("when a transformer is provided, and the transformer returns a new configuration object, the transformer is applied on the tsup config", ({ expect }) => {
    const platformTransformer: TsupConfigTransformer = () => {
        return {
            platform: "node"
        };
    };

    const result = defineDevConfig({
        transformers: [platformTransformer]
    });

    expect(result.platform).toBe("node");
});

test.concurrent("when multiple transformers are provided, all the transformers are applied on the webpack config", ({ expect }) => {
    const platformTransformer: TsupConfigTransformer = (config: Options) => {
        config.platform = "node";

        return config;
    };

    const nameTransformer: TsupConfigTransformer = (config: Options) => {
        config.name = "a-custom-name";

        return config;
    };

    const result = defineDevConfig({
        transformers: [platformTransformer, nameTransformer]
    });

    expect(result.platform).toBe("node");
    expect(result.name).toBe("a-custom-name");
});

test.concurrent("transformers context environment is \"dev\"", ({ expect }) => {
    const mockTransformer = vi.fn();

    defineDevConfig({
        transformers: [mockTransformer]
    });

    expect(mockTransformer).toHaveBeenCalledWith(expect.anything(), { environment: "dev" });
});
