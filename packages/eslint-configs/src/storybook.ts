import type { Linter } from "eslint";
import storybookPlugin from "eslint-plugin-storybook";
import type { ConfigWithExtends } from "./types.ts";

export interface StorybookConfigOptions {
    storiesRules?: Partial<Linter.RulesRecord>;
    mainFileRules?: Partial<Linter.RulesRecord>;
}

export const storybookGlobalIgnores = [
    "!.storybook",
    "storybook-static",
    // Because it's usually included in the ".storybook" folder.
    "mockServiceWorker.js"
];

export function defineStorybookConfig(options: StorybookConfigOptions = {}) {
    const {
        storiesRules = {},
        mainFileRules = {}
    } = options;

    const config: ConfigWithExtends[] = [
        {
            name: "@workleap/eslint-configs/storybook-stories",
            files: [
                "**/*.{stories,storybook,story,chroma}.{js,ts,jsx,tsx}"
            ],
            extends: [
                // @ts-expect-error the typings are broken and think there's a ".default" to add.
                storybookPlugin.configs["flat/recommended"]
                // // @ts-expect-error the types are broken and think there's a ".default" to add.
                // storybookPlugin.configs["flat/csf"],
                // // @ts-expect-error the types are broken and think there's a ".default" to add.
                // storybookPlugin.configs["flat/csf-strict"]
            ],
            rules: storiesRules
        },
        {
            name: "@workleap/eslint-configs/storybook-main",
            files: ["**/{.storybook,storybook}/main.@(js|cjs|mjs|ts)"],
            plugins: {
                // @ts-expect-error the typings are broken.
                storybook: storybookPlugin
            },
            rules: {
                "storybook/no-uninstalled-addons": "warn",
                // Positioned last to allow the consumer to override any rules.
                ...mainFileRules
            }
        }
    ];

    return config;
};
