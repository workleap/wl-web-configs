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

    let _options: PostcssPresetEnvOptions = presetEnvOptions;

    if (browsers) {
        _options = {
            ...presetEnvOptions,
            browsers
        };
    }

    const config: PostCSSConfig = {
        plugins: [
            // Typings are wrong, it's callable.
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            postcssPresetEnv(_options)
        ]
    };

    const transformedConfig = applyTransformers(config, transformers);

    return transformedConfig;
}
