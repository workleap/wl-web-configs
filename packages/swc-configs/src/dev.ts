import type { Config as SwcConfig } from "@swc/core";
import { applyTransformers, type SwcConfigTransformer } from "./applyTransformers.ts";

export interface DefineDevConfigOptions {
    baseUrl?: NonNullable<SwcConfig["jsc"]>["baseUrl"];
    fastRefresh?: boolean;
    parser?: "ecmascript" | "typescript";
    paths?: NonNullable<SwcConfig["jsc"]>["paths"];
    transformers?: SwcConfigTransformer[];
}

export function defineDevConfig(targets: Record<string, string>, options: DefineDevConfigOptions = {}) {
    const { baseUrl, fastRefresh = true, parser = "typescript", paths, transformers = [] } = options;

    const config: SwcConfig = {
        jsc: {
            baseUrl,
            paths,
            parser:
                parser === "ecmascript"
                    ? {
                          syntax: "ecmascript",
                          jsx: true
                      }
                    : {
                          syntax: "typescript",
                          tsx: true
                      },
            transform: {
                react: {
                    // Use "react/jsx-runtime".
                    runtime: "automatic",
                    // Use the native "Object.assign()" instead of "_extends".
                    useBuiltins: true,
                    // Enable React experimental "fast-refresh" feature.
                    // Also need to install @pmmmwh/react-refresh-webpack-plugin.
                    refresh: fastRefresh
                }
            },
            // Import shims from an external module rather than inlining them in bundle files to greatly reduce the bundles size.
            // Requires to add "@swc/helpers" as a project dependency.
            externalHelpers: true
        },
        module: {
            // The output module resolution system that the code will be compiled for.
            type: "es6"
        },
        env: {
            // jsc.target is not provided because the provided targets takes precedence.
            targets
        }
    };

    const transformedConfig = applyTransformers(config, transformers, {
        environment: "dev"
    });

    return transformedConfig;
}
