// @ts-check

/** @type {import("syncpack").RcFile} */
export default {
    "lintFormatting": false,
    "semverGroups": [
        {
            // Cannot be updated without moving to ESLint 9+.
            "packages": ["@workleap/eslint-plugin"],
            "dependencies": [
                "@stylistic/eslint-plugin-ts",
                "@typescript-eslint/eslint-plugin",
                "@typescript-eslint/parser",
                "@vitest/eslint-plugin",
                "eslint-plugin-import",
                "eslint-plugin-jest",
                "eslint-plugin-jsx-a11y",
                "eslint-plugin-package-json",
                "eslint-plugin-mdx",
                "eslint-plugin-react",
                "eslint-plugin-react-hooks",
                "eslint-plugin-storybook",
                "eslint-plugin-testing-library",
                "eslint-plugin-yml",
                "jsonc-eslint-parser",
                "yaml-eslint-parser"
            ],
            "isIgnored": true
        },
        {
            "packages": ["@workleap/*"],
            "dependencyTypes": ["prod", "peer"],
            "range": "^",
            "label": "Packages should use ^ for dependencies and peerDependencies."
        },
        {
            "packages": ["@workleap/*"],
            "dependencyTypes": ["dev"],
            "range": "",
            "label": "Packages should pin devDependencies."
        },
        {
            "packages": ["@rsbuild-sample/*", "@webpack-sample/*", "@storybook-sample/*"],
            "dependencyTypes": ["prod", "dev"],
            "range": "",
            "label": "Samples should pin dependencies and devDependencies."
        },
        {
            "packages": ["workspace-root"],
            "dependencyTypes": ["dev"],
            "range": "",
            "label": "Workspace root should pin devDependencies."
        }
    ],
    "versionGroups": [
        {
            "packages": ["@webpack-sample/*"],
            "dependencies": ["typescript"],
            "dependencyTypes": ["prod", "dev"]
        },
        {
            "packages": ["**"],
            "dependencyTypes": ["prod", "dev", "peer"],
            "preferVersion": "highestSemver",
            "label": "Packages and Samples should have a single version across the repository"
        }
    ]
};
