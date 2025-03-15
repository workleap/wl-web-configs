// @ts-check

/** @type {import("syncpack").RcFile} */
export default {
    "lintFormatting": false,
    "dependencyTypes": ["prod", "dev"],
    "semverGroups": [
        {
            "range": "^",
            "dependencyTypes": ["prod"],
            "dependencies": ["**"],
            "packages": ["@workleap/**"]
        },
        {
            "range": "",
            "dependencyTypes": ["prod", "dev"],
            "dependencies": ["**"],
            "packages": ["**"],
            "label": "packages version should be pinned"
        },
    ],
    "versionGroups": [
        {
            "dependencyTypes": ["prod", "dev"],
            "dependencies": ["typescript"],
            "packages": ["@webpack-sample/*"],
        },
        {
            "dependencyTypes": ["prod", "dev"],
            "preferVersion": "highestSemver",
            "dependencies": ["**"],
            "packages": ["**"],
            "label": "packages should have a single version across the repository"
        }
    ]
};
