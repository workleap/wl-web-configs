// @ts-check

import { defineBuildConfig } from "@workleap/webpack-configs";
import { swcConfig } from "./swc.build.js";

export default defineBuildConfig(swcConfig, {
    verbose: process.env.VERBOSE === "true",
    environmentVariables: {
        USE_MSW: process.env.USE_MSW === "true"
    }
});
