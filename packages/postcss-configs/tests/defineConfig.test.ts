import { test } from "vitest";
import { defineConfig, type PostcssConfigTransformer } from "../src/index.ts";

// NOTE: Since the provided configs are transformed into a PostcssEnv plugin instance, we cannot test the resulting config options.
// Therefore, only the transformers are tested.

test.concurrent("when a transformer is provided, the transformer is applied on the tsup config", ({ expect }) => {
    const weirdPluginsTransformer: PostcssConfigTransformer = config => {
        config.plugins = [false, false, false];

        return config;
    };

    const result = defineConfig({
        transformers: [weirdPluginsTransformer]
    });

    expect(result.plugins?.length).toBe(3);
    expect((result.plugins as false[])[0]).toBe(false);
    expect((result.plugins as false[])[1]).toBe(false);
    expect((result.plugins as false[])[2]).toBe(false);
});

test.concurrent("when multiple transformers are provided, all the transformers are applied on the webpack config", ({ expect }) => {
    const weirdPluginsTransformer: PostcssConfigTransformer = config => {
        config.plugins = [false, false, false];

        return config;
    };

    const toTransformer: PostcssConfigTransformer = config => {
        config.to = "a-custom-to";

        return config;
    };

    const result = defineConfig({
        transformers: [weirdPluginsTransformer, toTransformer]
    });

    expect(result.plugins?.length).toBe(3);
    expect((result.plugins as false[])[0]).toBe(false);
    expect((result.plugins as false[])[1]).toBe(false);
    expect((result.plugins as false[])[2]).toBe(false);
    expect(result.to).toBe("a-custom-to");
});
