import type { DistPathConfig, RsbuildPlugins, SourceMap } from "@rsbuild/core";
import { pluginReact, type PluginReactOptions } from "@rsbuild/plugin-react";
import { pluginSvgr, type PluginSvgrOptions } from "@rsbuild/plugin-svgr";
import { defineConfig, type Dts, type RsbuildConfigEntry, type RsbuildConfigOutputTarget, type Syntax } from "@rslib/core";
import { applyTransformers, type RslibConfigTransformer } from "./applyTransformers.ts";
import { isFunction } from "./assertions.ts";

export type DefineBuildDefineReactPluginConfigFunction = (defaultOptions: PluginReactOptions) => PluginReactOptions;
export type DefineBuildSvgrPluginConfigFunction = (defaultOptions: PluginSvgrOptions) => PluginSvgrOptions;

export interface DefineBuildConfigOptions {
    entry?: RsbuildConfigEntry;
    syntax?: Syntax;
    bundle?: boolean;
    tsconfigPath?: string;
    dts?: Dts;
    target?: RsbuildConfigOutputTarget;
    distPath?: DistPathConfig;
    plugins?: RsbuildPlugins;
    sourceMap?: boolean | SourceMap;
    react?: true | DefineBuildDefineReactPluginConfigFunction;
    svgr?: true | DefineBuildSvgrPluginConfigFunction;
    transformers?: RslibConfigTransformer[];
}

export function defineBuildConfig(options: DefineBuildConfigOptions = {}) {
    const {
        entry: entryValue,
        syntax = "esnext",
        bundle = false,
        tsconfigPath,
        dts = true,
        target = "web",
        distPath = {
            root: "./dist"
        },
        plugins = [],
        sourceMap = {
            js: "source-map",
            css: true
        },
        react = false,
        svgr = false,
        transformers = []
    } = options;

    if (!bundle && !tsconfigPath) {
        throw new Error("[rslib-configs] When the \"bundle\" option is \"false\", a \"tsconfigPath\" option must be provided. We recommend including a tsconfig.build.json file specifically for compiling the library project.");
    }

    let entry = entryValue;

    if (!entry) {
        entry = {
            index: bundle ? ["./src/index.ts", "./src/index.js"] : "./src/**"
        };
    }

    const svgrDefaultOptions: PluginSvgrOptions = {
        svgrOptions: {
            exportType: "named"
        }
    };

    const config = defineConfig({
        mode: "production",
        lib: [{
            format: "esm",
            syntax,
            bundle,
            dts
        }],
        source: {
            entry,
            tsconfigPath
        },
        output: {
            target,
            distPath,
            cleanDistPath: true,
            minify: false,
            sourceMap
        },
        plugins: ([
            react && pluginReact(isFunction(react) ? react({}) : {}),
            svgr && pluginSvgr(isFunction(svgr) ? svgr(svgrDefaultOptions) : svgrDefaultOptions),
            ...plugins
        ] as RsbuildPlugins).filter(Boolean)
    });

    const transformedConfig = applyTransformers(config, transformers, {
        environment: "build"
    });

    return defineConfig(transformedConfig);
}
