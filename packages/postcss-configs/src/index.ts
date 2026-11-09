import type { Config as PostCSSConfig } from "postcss-load-config";
import postcssPresetEnv, { type pluginOptions as PostcssPresetEnvOptions } from "postcss-preset-env";

export type { PostCSSConfig };

export type PostcssConfigTransformer = (config: PostCSSConfig) => PostCSSConfig;

function applyTransformers(config: PostCSSConfig, transformers: PostcssConfigTransformer[]) {
    return transformers.reduce((acc, transformer) => transformer(acc), config);
}

export const DefaultPresetEnvOptions = {
    autoprefixer: {
        flexbox: "no-2009"
    },
    stage: 3
} satisfies PostcssPresetEnvOptions;

export interface DefineConfigOptions {
    browsers?: Required<PostcssPresetEnvOptions["browsers"]>;
    presetEnvOptions?: Omit<PostcssPresetEnvOptions, "browsers">;
    transformers?: PostcssConfigTransformer[];
}

export function defineConfig(options: DefineConfigOptions = {}) {
    const { browsers, presetEnvOptions = DefaultPresetEnvOptions, transformers = [] } = options;

    let resolvedPresetEnvOptions: PostcssPresetEnvOptions = presetEnvOptions;

    if (browsers) {
        resolvedPresetEnvOptions = {
            ...presetEnvOptions,
            browsers
        };
    }

    const config: PostCSSConfig = {
        plugins: [
            // Typings are wrong, it's callable.
            // @ts-ignore
            postcssPresetEnv(resolvedPresetEnvOptions)
        ]
    };

    const transformedConfig = applyTransformers(config, transformers);

    return transformedConfig;
}
