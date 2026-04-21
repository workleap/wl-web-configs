import type { Config as SvgrOptions } from "@svgr/core";
import type { Config as SwcConfig } from "@swc/core";
import HtmlWebpackPlugin from "html-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import { createRequire } from "node:module";
import path from "node:path";
import TerserPlugin from "terser-webpack-plugin";
import webpack from "webpack";
import { applyTransformers, type WebpackConfigTransformer } from "./transformers/applyTransformers.ts";
import type { WebpackConfig } from "./types.ts";
import { isObject } from "./utils.ts";

// Aliases
const DefinePlugin = webpack.DefinePlugin;

// Using node:module.createRequire until
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import.meta/resolve
// is available
const require = createRequire(import.meta.url);

export function defineBuildHtmlWebpackPluginConfig(options: HtmlWebpackPlugin.Options = {}): HtmlWebpackPlugin.Options {
    const {
        template = path.resolve("./public/index.html"),
        ...rest
    } = options;

    return {
        ...rest,
        template
    };
}

type MiniCssExtractPluginOptions = NonNullable<ConstructorParameters<typeof MiniCssExtractPlugin>[number]>;

export function defineMiniCssExtractPluginConfig(options: MiniCssExtractPluginOptions = {}): MiniCssExtractPluginOptions {
    const {
        filename = "[name].css",
        ...rest
    } = options;

    return {
        ...rest,
        filename
    };
}

export type WebpackOptimization = NonNullable<WebpackConfig["optimization"]>;
export type OptimizeOption = boolean | "readable";

export function getOptimizationConfig(optimize: OptimizeOption): WebpackOptimization {
    if (optimize === "readable") {
        return {
            minimize: true,
            minimizer: [
                new TerserPlugin({
                    minify: TerserPlugin.swcMinify,
                    terserOptions: {
                        toplevel: true,
                        mangle: false,
                        keep_classnames: true,
                        keep_fnames: true,
                        compress: {
                            toplevel: true,
                            hoist_props: false
                        },
                        output: {
                            comments: true
                        }
                    }
                })
            ],
            chunkIds: "named",
            moduleIds: "named",
            mangleExports: false,
            mangleWasmImports: false
        };
    } else if (optimize) {
        return {
            minimize: true,
            minimizer: [
                new TerserPlugin({
                    minify: TerserPlugin.swcMinify
                })
            ]
        };
    }

    // Doesn't turnoff everything but is good enough to help with debugging scenarios.
    return {
        minimize: false,
        chunkIds: "named",
        moduleIds: "named",
        concatenateModules: false,
        flagIncludedChunks: false,
        mangleExports: false,
        mangleWasmImports: false,
        removeAvailableModules: false,
        usedExports: false
    };
}

export interface DefineBuildConfigOptions {
    entry?: string;
    outputPath?: string;
    publicPath?: `${string}/` | "auto";
    moduleRules?: NonNullable<WebpackConfig["module"]>["rules"];
    plugins?: WebpackConfig["plugins"];
    htmlWebpackPlugin?: boolean | HtmlWebpackPlugin.Options;
    miniCssExtractPluginOptions?: MiniCssExtractPluginOptions;
    optimize?: OptimizeOption;
    cssModules?: boolean;
    svgr?: boolean | SvgrOptions;
    environmentVariables?: Record<string, unknown>;
    transformers?: WebpackConfigTransformer[];
    verbose?: boolean;
}

export function defineBuildConfig(swcConfig: SwcConfig, options: DefineBuildConfigOptions = {}) {
    const {
        entry = path.resolve("./src/index.tsx"),
        outputPath = path.resolve("dist"),
        // The trailing / is very important, otherwise paths will not be resolved correctly.
        publicPath = "http://localhost:8080/",
        moduleRules = [],
        plugins = [],
        htmlWebpackPlugin = defineBuildHtmlWebpackPluginConfig(),
        miniCssExtractPluginOptions = defineMiniCssExtractPluginConfig(),
        optimize = true,
        cssModules = false,
        svgr = true,
        // Using an empty object literal as the default value to ensure
        // "process.env" is always available.
        environmentVariables = {},
        transformers = [],
        verbose = false
    } = options;

    const config: WebpackConfig = {
        mode: "production",
        target: "web",
        entry,
        output: {
            path: outputPath,
            filename: "[name].js",
            publicPath,
            clean: true,
            assetModuleFilename: "[name][ext][query]"
        },
        optimization: getOptimizationConfig(optimize),
        infrastructureLogging: verbose ? {
            appendOnly: true,
            level: "verbose",
            debug: /PackFileCache/
        } : undefined,
        module: {
            rules: [
                {
                    test: /\.(js|jsx|ts|tsx)$/i,
                    exclude: /node_modules/,
                    loader: require.resolve("swc-loader"),
                    options: swcConfig
                },
                {
                    // https://stackoverflow.com/questions/69427025/programmatic-webpack-jest-esm-cant-resolve-module-without-js-file-exten
                    test: /\.js$/i,
                    include: /node_modules/,
                    resolve: {
                        fullySpecified: false
                    }
                },
                {
                    test: /\.css$/i,
                    use: [
                        { loader: MiniCssExtractPlugin.loader },
                        {
                            loader: require.resolve("css-loader"),
                            options: cssModules
                                ? {
                                    // Must match the number of loaders applied before this one.
                                    importLoaders: 1,
                                    modules: true
                                }
                                : undefined
                        },
                        { loader: require.resolve("postcss-loader") }
                    ]
                },
                ...(svgr
                    ? [
                        {
                            test: /\.svg$/i,
                            loader: require.resolve("@svgr/webpack"),
                            options: isObject(svgr) ? svgr : undefined
                        },
                        {
                            test: /\.(png|jpe?g|gif)$/i,
                            type: "asset/resource"
                        }
                    ]
                    : [
                        {
                            test: /\.(png|jpe?g|gif|svg)$/i,
                            type: "asset/resource"
                        }
                    ]),
                ...moduleRules
            ]
        },
        resolve: {
            extensions: [".js", ".jsx", ".ts", ".tsx", ".css"],
            alias: {
                // Fixes Module not found: Error: Can't resolve '@swc/helpers/_/_class_private_field_init'.
                // View https://github.com/vercel/next.js/pull/38174 for more information and https://github.com/vercel/next.js/issues/48593.
                "@swc/helpers": path.dirname(require.resolve("@swc/helpers/package.json"))
            }
        },
        plugins: [
            htmlWebpackPlugin && new HtmlWebpackPlugin(isObject(htmlWebpackPlugin) ? htmlWebpackPlugin : defineBuildHtmlWebpackPluginConfig()),
            new MiniCssExtractPlugin(miniCssExtractPluginOptions),
            // Stringify the environment variables because the plugin does a direct text replacement. Otherwise, "production" would become production
            // after replacement and cause an undefined var error because the production var doesn't exist.
            // For more information, view: https://webpack.js.org/plugins/define-plugin.
            new DefinePlugin({
                "process.env": Object.keys(environmentVariables).reduce((acc, key) => {
                    acc[key] = JSON.stringify(environmentVariables[key]);

                    return acc;
                }, {} as Record<string, string>)
            }),
            ...plugins
        ].filter(Boolean)
    };

    const transformedConfig = applyTransformers(config, transformers, {
        environment: "build",
        verbose
    });

    return transformedConfig;
}
