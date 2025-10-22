// Standalone config because otherwise there's a dependency cycle between @workleap/eslint-configs and @workleap/rslib-configs.

import { defineConfig } from "@rslib/core";

export default defineConfig({
    mode: "production",
    lib: [{
        format: "esm",
        syntax: "esnext",
        bundle: false,
        dts: true
    }],
    source: {
        entry: {
            index: "./src/**"
        },
        tsconfigPath: "./tsconfig.build.json"
    },
    output: {
        target: "node",
        distPath: {
            root: "./dist"
        },
        cleanDistPath: true,
        minify: false,
        sourceMap: {
            js: "source-map"
        }
    }
});
