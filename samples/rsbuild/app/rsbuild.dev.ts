import { defineDevConfig } from "@workleap/rsbuild-configs";

export default defineDevConfig({
    verbose: process.env.VERBOSE === "true",
    environmentVariables: {
        USE_MSW: process.env.USE_MSW === "true",
        STRING: "STRING_VALUE",
        INT: 1
    }
});
