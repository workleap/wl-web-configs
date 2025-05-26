// @ts-check

/** @type {import("syncpack").RcFile} */
export default {
    "lintFormatting": false,
    // "dependencyTypes": ["prod", "dev"],
    "semverGroups": [
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
