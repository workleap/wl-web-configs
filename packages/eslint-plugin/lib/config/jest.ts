import { reactTestFiles, testFiles } from "../utils/patterns";

import type { Linter } from "eslint";

const config: Linter.Config = {
    overrides: [
        {
            files: [...testFiles, ...reactTestFiles],
            plugins: ["jest"],
            env: {
                es2024: true,
                node: true,
                browser: true,
                commonjs: true,
                jest: true
            },
            settings: {
                jest: {
                    version: "detect"
                }
            },
            extends: ["plugin:jest/recommended"],
            rules: {
                // Prefer spies to allow for automatic restoration
                "jest/prefer-spy-on": "error",
                // Gives better failure messages for array checks
                "jest/prefer-to-contain": "error"
            }
        }
    ]
};

// Using TypeScript "export" keyword until ESLint support ESM.
// Otherwise we must deal with a weird CommonJS output from esbuild which is not worth it.
// For more info, see: https://github.com/evanw/esbuild/issues/1079
export = config;

