import type { Linter } from "eslint";

const config: Linter.Config = {
    plugins: ["@workleap"],
    extends: [
        "plugin:@workleap/core",
        "plugin:@workleap/typescript",
        "plugin:@workleap/react",
        "plugin:@workleap/jsx-a11y",
        "plugin:@workleap/jest",
        "plugin:@workleap/vitest",
        "plugin:@workleap/testing-library",
        "plugin:@workleap/storybook",
        "plugin:@workleap/mdx",
        "plugin:@workleap/package-json",
        "plugin:@workleap/yaml"
    ],
    rules: {
        // Custom WorkLeap rules
        "@workleap/strict-css-modules-names": "warn"
    }
};

// Using TypeScript "export" keyword until ESLint support ESM.
// Otherwise we must deal with a weird CommonJS output from esbuild which is not worth it.
// For more info, see: https://github.com/evanw/esbuild/issues/1079
export = config;

