import type { Config as SwcConfig } from "@swc/core";
import { applyTransformers, type SwcConfigTransformer } from "./applyTransformers.ts";

export interface DefineJestConfigOptions {
    baseUrl?: NonNullable<SwcConfig["jsc"]>["baseUrl"];
    parser?: "ecmascript" | "typescript";
    paths?: NonNullable<SwcConfig["jsc"]>["paths"];
    react?: boolean;
    transformers?: SwcConfigTransformer[];
}

export function defineJestConfig(options: DefineJestConfigOptions = {}) {
    const { baseUrl, parser = "typescript", paths, react = false, transformers = [] } = options;

    const config: SwcConfig = {
        jsc: {
            baseUrl,
            paths,
            parser:
                parser === "ecmascript"
                    ? {
                          syntax: "ecmascript",
                          jsx: react
                      }
                    : {
                          syntax: "typescript",
                          tsx: react
                      },
            // The output environment that the code will be compiled for.
            target: "esnext",
            transform: react
                ? {
                      react: {
                          // Use "react/jsx-runtime".
                          runtime: "automatic",
                          // Use the native "Object.assign()" instead of "_extends".
                          useBuiltins: true
                      }
                  }
                : undefined
        },
        module: {
            // The output module resolution system that the code will be compiled for.
            type: "es6"
        }
    };

    const transformedConfig = applyTransformers(config, transformers, {
        environment: "jest"
    });

    return transformedConfig;
}
