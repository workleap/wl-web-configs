import type { Linter } from "eslint";
import packageJsonPlugin from "eslint-plugin-package-json";
import type { ConfigWithExtends } from "./types.ts";

export interface PackageJsonConfigOptions {
    rules?: Partial<Linter.RulesRecord>;
}

export const packageJsonGlobalIgnores = [];

export function packageJsonConfig(options: PackageJsonConfigOptions = {}) {
    const {
        rules = {}
    } = options;

    const config: ConfigWithExtends[] = [{
        name: "@workleap/eslint-configs/package-json",
        files: [
            "**/package.json"
        ],
        extends: [
            packageJsonPlugin.configs.recommended
        ],
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
            "package-json/valid-repository-directory": "off",
            "package-json/valid-scripts": "off",
            // Positioned last to allow the consumer to override any rules.
            ...rules
        }
    }];

    return config;
};
