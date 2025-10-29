import type { Linter } from "eslint";
import yamlPlugin from "eslint-plugin-yaml";
import type { ConfigWithExtends } from "./types.ts";

export interface YamlConfigOptions {
    rules?: Partial<Linter.RulesRecord>;
}

export const yamlGlobalIgnores = [
    "pnpm-lock.yaml"
];

export function defineYamlConfig(options: YamlConfigOptions = {}) {
    const {
        rules = {}
    } = options;

    const config: ConfigWithExtends[] = [{
        name: "@workleap/eslint-configs/yaml",
        files: [
            "**/*.yaml",
            "**/*.yml"
        ],
        extends: [
            // @ts-expect-error the typings are broken.
            yamlPlugin.configs.recommended
        ],
        rules
    }];

    return config;
};
