// @ts-check

import { defineDevConfig } from "@workleap/webpack-configs";
import { swcConfig } from "./swc.dev.js";

export default defineDevConfig(swcConfig, {
    verbose: process.env.VERBOSE === "true",
    environmentVariables: {
        USE_MSW: process.env.USE_MSW === "true",
        STRING: "STRING_VALUE",
        INT: 1
    }
});
