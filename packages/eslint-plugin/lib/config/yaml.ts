import { yamlFiles } from "../utils/patterns";

import type { Linter } from "eslint";

const config: Linter.Config = {
    extends: ["plugin:yml/standard"],
    overrides: [
        {
            files: yamlFiles,
            parser: "yaml-eslint-parser"
        }
    ]
};

// Using TypeScript "export" keyword until ESLint support ESM.
// Otherwise we must deal with a weird CommonJS output from esbuild which is not worth it.
// For more info, see: https://github.com/evanw/esbuild/issues/1079
export = config;
