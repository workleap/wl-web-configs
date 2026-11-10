import type { Config as SwcConfig } from "@swc/core";
import { applyTransformers, type SwcConfigTransformer } from "./applyTransformers.ts";

export interface DefineBuildConfigOptions {
    baseUrl?: NonNullable<SwcConfig["jsc"]>["baseUrl"];
    parser?: "ecmascript" | "typescript";
    paths?: NonNullable<SwcConfig["jsc"]>["paths"];
    transformers?: SwcConfigTransformer[];
}

export function defineBuildConfig(targets: Record<string, string>, options: DefineBuildConfigOptions = {}) {
    const { baseUrl, parser = "typescript", paths, transformers = [] } = options;

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
            // View https://swc.rs/docs/configuration/minification for options.
            minify: {
                compress: true,
                mangle: true
            },
            transform: {
                react: {
                    // Use "react/jsx-runtime".
                    runtime: "automatic",
                    // Use the native "Object.assign()" instead of "_extends".
                    useBuiltins: true
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
        environment: "build"
    });

    return transformedConfig;
}
