import type { Linter } from "eslint";

const config: Linter.Config = {
    overrides: [
        {
            files: ["package.json"],
            plugins: ["package-json"],
            extends: ["``plugin:package-json``/legacy-recommended"],
            parser: "jsonc-eslint-parser",
            rules: {
                "package-json/order-properties": "off",
                "package-json/prefer-repository-shorthand": "off",
                "package-json/sort-collections": [
                    "error",
                    [
                        // Do not sort "scripts".
                        "devDependencies",
                        "dependencies",
                        "peerDependencies",
                        "config"
                    ]
                ],
                // Doesn't support "workspace:*" at the moment.
                "package-json/valid-package-def": "off",
                // I am not sure why, this rule is triggering errors for valid paths.
                "package-json/valid-repository-directory": "off"
            }
        }
    ]
};

// Using TypeScript "export" keyword until ESLint support ESM.
// Otherwise we must deal with a weird CommonJS output from esbuild which is not worth it.
// For more info, see: https://github.com/evanw/esbuild/issues/1079
export = config;

