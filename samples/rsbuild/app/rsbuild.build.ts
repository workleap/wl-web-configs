import { defineBuildConfig } from "@workleap/rsbuild-configs";

export default defineBuildConfig({
    assetPrefix: process.env.NETLIFY === "true" ? "auto" : undefined,
    verbose: process.env.VERBOSE === "true",
    environmentVariables: {
        "USE_MSW": process.env.USE_MSW === "true" || process.env.NETLIFY === "true"
    }
});
