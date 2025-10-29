import type { Linter } from "eslint";
import testingLibraryPlugin from "eslint-plugin-testing-library";
import type { ConfigWithExtends } from "./types.ts";

export interface TestingLibraryConfigOptions {
    reactRules?: Partial<Linter.RulesRecord>;
    jsRules?: Partial<Linter.RulesRecord>;
}

export const testingLibraryGlobalIgnores = [];

export function defineTestingLibraryConfig(options: TestingLibraryConfigOptions = {}) {
    const {
        reactRules = {},
        jsRules = {}
    } = options;

    const config: ConfigWithExtends[] = [
        {
            name: "@workleap/eslint-configs/testing-library-react",
            files: [
                "**/*.test.[jt]sx",
                "**/*-test.[jt]sx",
                "**/__tests__/*.[jt]sx",
                "**/test.[jt]sx"
            ],
            extends: [
                testingLibraryPlugin.configs["flat/react"]
            ],
            rules: reactRules
        },
        {
            name: "@workleap/eslint-configs/testing-library-js",
            files: [
                "**/*.test.[jt]s",
                "**/*-test.[jt]s",
                "**/__tests__/*.[jt]s",
                "**/test.[jt]s"
            ],
            extends: [
                testingLibraryPlugin.configs["flat/dom"]
            ],
            rules: jsRules
        }
    ];

    return config;
};
