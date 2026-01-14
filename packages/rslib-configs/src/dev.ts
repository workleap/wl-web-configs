import { pluginReact, type PluginReactOptions } from "@rsbuild/plugin-react";
import { pluginSvgr, type PluginSvgrOptions } from "@rsbuild/plugin-svgr";
import { defineConfig, type Dts, type Rsbuild, type Syntax } from "@rslib/core";
import { applyTransformers, type RslibConfigTransformer } from "./applyTransformers.ts";
import { isFunction } from "./assertions.ts";

export type DefineDevDefineReactPluginConfigFunction = (defaultOptions: PluginReactOptions) => PluginReactOptions;
export type DefineDevSvgrPluginConfigFunction = (defaultOptions: PluginSvgrOptions) => PluginSvgrOptions;

export interface DefineDevConfigOptions {
    entry?: Rsbuild.RsbuildEntry;
    syntax?: Syntax;
    bundle?: boolean;
    tsconfigPath?: string;
    dts?: Dts;
    target?: Rsbuild.RsbuildTarget;
    distPath?: Rsbuild.DistPathConfig;
    plugins?: Rsbuild.RsbuildPlugins;
    sourceMap?: boolean | Rsbuild.SourceMap;
    react?: true | DefineDevDefineReactPluginConfigFunction;
    svgr?: true | DefineDevSvgrPluginConfigFunction;
    transformers?: RslibConfigTransformer[];
}

export function defineDevConfig(options: DefineDevConfigOptions = {}) {
    const {
        entry: entryValue,
        syntax = "esnext",
        bundle = false,
        tsconfigPath,
        dts = false,
        target = "web",
        distPath = {
            root: "./dist"
        },
        plugins = [],
        sourceMap = {
            js: "cheap-module-source-map",
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
        mode: "development",
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
        ] as Rsbuild.RsbuildPlugins).filter(Boolean)
    });

    const transformedConfig = applyTransformers(config, transformers, {
        environment: "dev"
    });

    return defineConfig(transformedConfig);
}
