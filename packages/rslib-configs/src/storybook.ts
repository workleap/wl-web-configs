import { pluginReact, type PluginReactOptions } from "@rsbuild/plugin-react";
import { pluginSvgr, type PluginSvgrOptions } from "@rsbuild/plugin-svgr";
import { defineConfig, type Rsbuild } from "@rslib/core";
import { applyTransformers, type RslibConfigTransformer } from "./applyTransformers.ts";

export type DefineStorybookDefineReactPluginConfigFunction = (defaultOptions: PluginReactOptions) => PluginReactOptions;
export type DefineStorybookSvgrPluginConfigFunction = (defaultOptions: PluginSvgrOptions) => PluginSvgrOptions;

export interface DefineStorybookConfigOptions {
    plugins?: Rsbuild.RsbuildPlugins;
    sourceMap?: boolean | Rsbuild.SourceMap;
    react?: false | DefineStorybookDefineReactPluginConfigFunction;
    svgr?: false | DefineStorybookSvgrPluginConfigFunction;
    transformers?: RslibConfigTransformer[];
}

function defaultDefineReactPluginConfig(options: PluginReactOptions) {
    return options;
}

function defineSvgrPluginConfig(options: PluginSvgrOptions) {
    return options;
}

export function defineStorybookConfig(options: DefineStorybookConfigOptions = {}) {
    const {
        plugins = [],
        sourceMap = {
            js: "cheap-module-source-map",
            css: true
        },
        react = defaultDefineReactPluginConfig,
        svgr = defineSvgrPluginConfig,
        transformers = []
    } = options;

    const config = defineConfig({
        lib: [{
            dts: false
        }],
        output: {
            target: "web",
            // Setting the clean option to true breaks the Storybook integration.
            cleanDistPath: false,
            minify: false,
            sourceMap
        },
        plugins: [
            react && pluginReact(react({})),
            svgr && pluginSvgr(svgr({
                svgrOptions: {
                    exportType: "named"
                }
            })),
            ...plugins
        ]
    });

    const transformedConfig = applyTransformers(config, transformers, {
        environment: "storybook"
    });

    return defineConfig(transformedConfig);
}
