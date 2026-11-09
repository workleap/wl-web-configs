import type { Config as SwcConfig } from "@swc/core";

export type { SwcConfigTransformer, SwcConfigTransformerContext } from "./applyTransformers.ts";
export * from "./browserslistToSwc.ts";
export * from "./build.ts";
export * from "./dev.ts";
export * from "./jest.ts";
export type { SwcConfig };
