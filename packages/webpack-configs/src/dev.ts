import ReactRefreshWebpackPlugin from "@pmmmwh/react-refresh-webpack-plugin";
import type { ReactRefreshPluginOptions } from "@pmmmwh/react-refresh-webpack-plugin/types/lib/types.d.ts";
import type { Config as SwcConfig } from "@swc/core";
import HtmlWebpackPlugin from "html-webpack-plugin";
import { createRequire } from "node:module";
import path from "path";
import { fileURLToPath } from "url";
import webpack, { type Configuration as WebpackConfig } from "webpack";
import { applyTransformers, type WebpackConfigTransformer } from "./transformers/applyTransformers.ts";
import { isObject } from "./utils.ts";

// Add the "devServer" prop to WebpackConfig typings.
import "webpack-dev-server";

// Aliases
const DefinePlugin = webpack.DefinePlugin;

// Using node:module.createRequire until
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import.meta/resolve
// is available
const require = createRequire(import.meta.url);

export function defineDevHtmlWebpackPluginConfig(options: HtmlWebpackPlugin.Options = {}): HtmlWebpackPlugin.Options {
    const {
        template = path.resolve("./public/index.html"),
        ...rest
    } = options;

    return {
        ...rest,
        template
    };
}

export function defineFastRefreshPluginConfig(options: ReactRefreshPluginOptions = {}) {
    return options;
}

export interface DefineDevConfigOptions {
    entry?: string;
    https?: NonNullable<WebpackConfig["devServer"]>["https"];
    host?: string;
    port?: number;
    cache?: boolean;
    cacheDirectory?: string;
    moduleRules?: NonNullable<WebpackConfig["module"]>["rules"];
    plugins?: WebpackConfig["plugins"];
    htmlWebpackPluginOptions?: HtmlWebpackPlugin.Options;
    fastRefresh?: boolean | ReactRefreshPluginOptions;
    cssModules?: boolean;
    postcssConfigFilePath?: string;
    swcConfig: SwcConfig;
    // Only accepting string values because there are lot of issues with the DefinePlugin related to typing errors.
    // See https://github.com/webpack/webpack/issues/8641
    environmentVariables?: Record<string, string | undefined>;
    transformers?: WebpackConfigTransformer[];
}

function preflight(options: DefineDevConfigOptions) {
    if (!require.resolve("webpack-dev-server")) {
        throw new Error("[webpack-configs] To use the \"dev\" config, install https://www.npmjs.com/package/webpack-dev-server as a \"devDependency\".");
    }

    if (options.fastRefresh) {
        if (!require.resolve("@pmmmwh/react-refresh-webpack-plugin")) {
            throw new Error("[webpack-configs] To use Webpack Fast Refresh, install https://www.npmjs.com/package/@pmmmwh/react-refresh-webpack-plugin as a \"devDependency\".");
        }
    }
}

function tryEnableSwcReactRefresh(config: SwcConfig) {
    if (config?.jsc?.transform?.react) {
        config.jsc.transform.react.refresh = true;
    }

    return config;
}

export function defineDevConfig(options: DefineDevConfigOptions) {
    preflight(options);

    const {
        entry = path.resolve("./src/index.tsx"),
        https = false,
        host = "localhost",
        port = 8080,
        cache = true,
        cacheDirectory = path.resolve("node_modules/.cache/webpack"),
        moduleRules = [],
        plugins = [],
        htmlWebpackPluginOptions = defineDevHtmlWebpackPluginConfig(),
        fastRefresh = false,
        cssModules = false,
        postcssConfigFilePath,
        swcConfig,
        environmentVariables,
        transformers = []
    } = options;

    const config: WebpackConfig = {
        mode: "development",
        target: "web",
        devtool: "eval-cheap-module-source-map",
        devServer: {
            hot: !fastRefresh,
            https,
            host,
            port,
            historyApiFallback: true
        },
        entry,
        output: {
            // The trailing / is very important, otherwise paths will not be resolved correctly.
            publicPath: `${https ? "https" : "http"}://${host}:${port}/`
        },
        cache: cache !== false && {
            type: "filesystem",
            allowCollectingMemory: true,
            buildDependencies: {
                config: [fileURLToPath(import.meta.url)]
            },
            cacheDirectory: cacheDirectory
        },
        optimization: {
            // See: https://webpack.js.org/guides/build-performance/#avoid-extra-optimization-steps
            runtimeChunk: true,
            removeAvailableModules: false,
            removeEmptyChunks: false,
            splitChunks: false
        },
        module: {
            rules: [
                {
                    test: /\.(js|jsx|ts|tsx)/i,
                    exclude: /node_modules/,
                    loader: require.resolve("swc-loader"),
                    options: fastRefresh
                        ? tryEnableSwcReactRefresh(swcConfig)
                        : swcConfig
                },
                {
                    // https://stackoverflow.com/questions/69427025/programmatic-webpack-jest-esm-cant-resolve-module-without-js-file-exten
                    test: /\.js/i,
                    include: /node_modules/,
                    resolve: {
                        fullySpecified: false
                    }
                },
                {
                    test: /\.css/i,
                    use: [
                        { loader: require.resolve("style-loader") },
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
                        {
                            loader: require.resolve("postcss-loader"),
                            options: postcssConfigFilePath
                                ? {
                                    postcssOptions: {
                                        config: postcssConfigFilePath
                                    }
                                }
                                : undefined
                        }
                    ]
                },
                {
                    test: /\.svg/i,
                    loader: require.resolve("@svgr/webpack")
                },
                {
                    test: /\.(png|jpe?g|gif)/i,
                    type: "asset/resource"
                },
                ...moduleRules
            ]
        },
        resolve: {
            extensions: [".js", ".jsx", ".ts", ".tsx", ".css"]
        },
        plugins: [
            new HtmlWebpackPlugin(htmlWebpackPluginOptions),
            new DefinePlugin({
                "process.env": JSON.stringify(environmentVariables)
            }),
            fastRefresh && new ReactRefreshWebpackPlugin(isObject(fastRefresh) ? fastRefresh : defineFastRefreshPluginConfig()),
            ...plugins
        ].filter(Boolean) as WebpackConfig["plugins"]
    };

    const transformedConfig = applyTransformers(config, transformers, {
        environment: "dev"
    });

    return transformedConfig;
}
