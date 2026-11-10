// @ts-check

/** @type {import("syncpack").RcFile} */
export default {
    semverGroups: [
        {
            packages: ["@workleap/*"],
            dependencyTypes: ["prod", "peer"],
            range: "^",
            label: "Packages should use ^ for dependencies and peerDependencies."
        },
        {
            packages: ["@workleap/*"],
            dependencyTypes: ["dev"],
            range: "",
            label: "Packages should pin devDependencies."
        },
        {
            packages: ["@rsbuild-sample/*", "@webpack-sample/*", "@storybook-sample/*"],
            dependencyTypes: ["prod", "dev"],
            range: "",
            label: "Samples should pin dependencies and devDependencies."
        },
        {
            packages: ["workspace-root"],
            dependencyTypes: ["dev"],
            range: "",
            label: "Workspace root should pin devDependencies."
        }
    ],
    versionGroups: [
        {
            // tsup bundles declarations with rollup-plugin-dts, which needs the TypeScript compiler API. TypeScript 7 doesn't ship it.
            packages: ["@workleap/tsup-configs", "@webpack-sample/tsup-lib"],
            dependencies: ["typescript"],
            isIgnored: true,
            label: "tsup stays on TypeScript 6."
        },
        {
            // The shared tsconfig files work with both TypeScript 6 and 7. syncpack can't keep a multi-range peer.
            packages: ["@workleap/typescript-configs"],
            dependencies: ["typescript"],
            dependencyTypes: ["peer"],
            isIgnored: true,
            label: "@workleap/typescript-configs supports TypeScript 6 and 7."
        },
        {
            packages: ["**"],
            dependencyTypes: ["prod", "dev", "peer"],
            preferVersion: "highestSemver",
            label: "Packages and Samples should have a single version across the repository"
        }
    ]
};
