// @ts-check

import { defineDevConfig } from "@workleap/webpack-configs";
import { swcConfig } from "./swc.dev.js";

export default defineDevConfig({
    fastRefresh: true,
    swcConfig,
    environmentVariables: {
        "USE_MSW": process.env.USE_MSW
    }
});
