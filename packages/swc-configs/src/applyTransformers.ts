import type { Config as SwcConfig } from "@swc/core";

// TOTO
export interface SwcConfigTransformerContext {
    environment: "dev" | "build" | "jest";
}

export type SwcConfigTransformer = (config: SwcConfig, context: SwcConfigTransformerContext) => SwcConfig;

export function applyTransformers(config: SwcConfig, transformers: SwcConfigTransformer[], context: SwcConfigTransformerContext) {
    return transformers.reduce((acc, transformer) => transformer(acc, context), config);
}
