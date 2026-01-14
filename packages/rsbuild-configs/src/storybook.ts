import { defineConfig, type RsbuildConfig, type RsbuildPlugins, type SourceMap } from "@rsbuild/core";
import { pluginReact, type PluginReactOptions } from "@rsbuild/plugin-react";
import { pluginSvgr, type PluginSvgrOptions } from "@rsbuild/plugin-svgr";
import { applyTransformers, type RsbuildConfigTransformer } from "./applyTransformers.ts";

export type DefineStorybookDefineReactPluginConfigFunction = (defaultOptions: PluginReactOptions) => PluginReactOptions;
export type DefineStorybookSvgrPluginConfigFunction = (defaultOptions: PluginSvgrOptions) => PluginSvgrOptions;

export interface DefineStorybookConfigOptions {
    plugins?: RsbuildPlugins;
    lazyCompilation?: boolean;
    sourceMap?: boolean | SourceMap;
    react?: false | DefineStorybookDefineReactPluginConfigFunction;
    svgr?: false | DefineStorybookSvgrPluginConfigFunction;
    environmentVariables?: Record<string, unknown>;
    transformers?: RsbuildConfigTransformer[];
    verbose?: boolean;
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
        lazyCompilation = false,
        sourceMap = {
            js: "cheap-module-source-map",
            css: true
        },
        react = defaultDefineReactPluginConfig,
        svgr = defineSvgrPluginConfig,
        // Using an empty object literal as the default value to ensure
        // "process.env" is always available.
        environmentVariables = {},
        transformers = [],
        verbose = false
    } = options;

    const config: RsbuildConfig = {
        dev: {
            lazyCompilation
        },
        source: {
            // Stringify the environment variables because the plugin does a direct text replacement. Otherwise, "production" would become production
            // after replacement and cause an undefined var error because the production var doesn't exist.
            // For more information, view: https://rsbuild.dev/guide/advanced/env-vars#using-define.
            define: {
                "process.env": Object.keys(environmentVariables).reduce((acc, key) => {
                    acc[key] = JSON.stringify(environmentVariables[key]);

                    return acc;
                }, {} as Record<string, string>)
            }
        },
        output: {
            target: "web",
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
        ].filter(Boolean),
        tools: {
            rspack: {
                infrastructureLogging: verbose ? {
                    appendOnly: true,
                    level: "verbose",
                    debug: /PackFileCache/
                } : undefined,
                optimization: {
                    // Disabling modules concatenation until https://github.com/rstackjs/storybook-rsbuild/issues/403 is fixed.
                    concatenateModules: false
                }
            }
        }
    };

    const transformedConfig = applyTransformers(config, transformers, {
        environment: "storybook",
        verbose
    });

    return defineConfig(transformedConfig);
}
