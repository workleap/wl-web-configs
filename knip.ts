import type { KnipConfig } from "knip";

type KnipWorkspaceConfig = NonNullable<KnipConfig["workspaces"]>[string];

type KnipTransformer = (config: KnipWorkspaceConfig) => KnipWorkspaceConfig;

function defineWorkspace({ ignore, ...config }: KnipWorkspaceConfig, transformers?: KnipTransformer[]): KnipWorkspaceConfig {
    let transformedConfig: KnipWorkspaceConfig = {
        ...config,
        ignore: [
            ...(ignore as string[] ?? []),
            "node_modules/**",
            "dist/**"
        ]
    };

    if (transformers) {
        transformedConfig = transformers.reduce((acc, transformer) => transformer(acc), transformedConfig);
    }

    return transformedConfig;
}

const ignoreBrowserslist: KnipTransformer = ({ ignoreDependencies, ...config }) => {
    return {
        ...config,
        ignoreDependencies: [
            ...(ignoreDependencies as string[] ?? []),
            // Browserlist isn't supported by plugins.
            "@workleap/browserslist-config",
            "browserslist"
        ]
    };
};

const configurePostcss: KnipTransformer = config => {
    return {
        ...config,
        postcss: {
            config: ["postcss.config.ts"]
        }
    };
};

const configureMsw: KnipTransformer = ({ entry, ignore, ...config }) => {
    return {
        ...config,
        entry: [
            ...(entry as string[] ?? []),
            "src/mocks/browser.ts",
            "src/mocks/handlers.ts"
        ],
        ignore: [
            ...(ignore as string[] ?? []),
            // MSW isn't supported by plugins.
            "public/mockServiceWorker.js"
        ]
    };
};

const configureWebpack: KnipTransformer = ({ ignoreDependencies, ...config }) => {
    return {
        ...config,
        webpack: {
            config: ["webpack.*.js"]
        },
        ignoreDependencies: [
            ...(ignoreDependencies as string[] ?? []),
            "@svgr/webpack",
            "swc-loader",
            "css-loader",
            "postcss-loader",
            "style-loader",
            "mini-css-extract-plugin"
        ].filter(Boolean) as string[]
    };
};

const configureRsbuild: KnipTransformer = config => {
    return {
        ...config,
        rsbuild: {
            config: ["rsbuild.*.ts"]
        }
    };
};

const configureTsup: KnipTransformer = config => {
    return {
        ...config,
        tsup: {
            config: ["tsup.*.ts"]
        }
    };
};

const configurePackage: KnipTransformer = config => {
    return {
        ...config,
        eslint: true
    };
};

const rootConfig = defineWorkspace({
    ignoreDependencies: [
        // Required for Stylelint (seems like a Knip bug)
        "prettier",
        "ts-node"
    ]
});

const packagesConfig: KnipWorkspaceConfig = defineWorkspace({}, [
    configurePackage
]);

const swcConfig: KnipWorkspaceConfig = defineWorkspace({
    ignoreDependencies: [
        // Omitting the optional peer dependencies from the peerDependencies emits
        // runtime errors like "[ERROR] Could not resolve "browserslist"".
        "@swc/jest",
        "browserslist"
    ]
}, [
    configurePackage
]);

const webpackConfig: KnipWorkspaceConfig = defineWorkspace({
    ignoreDependencies: [
        // Emits an referenced optionap peerDependencies warning but according to PNPM
        // documentation, to specify a version constraint, the optional dependency must be define.
        // See: https://pnpm.io/package_json#peerdependenciesmetaoptional.
        "webpack-dev-server"
    ]
}, [
    configurePackage
]);

const configureWebpackSample: KnipTransformer = ({ entry, ...config }) => {
    return {
        ...config,
        entry: [
            ...(entry as string[] ?? []),
            "src/index.ts",
            "src/index.tsx"
        ],
        eslint: true,
        stylelint: true
    };
};

const webpackSampleAppConfig = defineWorkspace({}, [
    configureWebpackSample,
    ignoreBrowserslist,
    configurePostcss,
    configureWebpack,
    configureMsw
]);

const webpackSampleComponentsConfig = defineWorkspace({}, [
    configureWebpackSample
]);

const webpackSampleTsupLibConfig = defineWorkspace({}, [
    configureWebpackSample,
    configureTsup
]);

const configureRsbuildSample: KnipTransformer = ({ entry, ...config }) => {
    return {
        ...config,
        entry: [
            ...(entry as string[] ?? []),
            "src/index.ts",
            "src/index.tsx"
        ],
        eslint: true,
        stylelint: true
    };
};

const rsbuildSampleAppConfig = defineWorkspace({}, [
    configureRsbuildSample,
    ignoreBrowserslist,
    configureRsbuild,
    configureMsw
]);

const rsbuildSampleComponentsConfig = defineWorkspace({}, [
    configureRsbuildSample
]);

const rsbuildSampleRslibLibConfig = defineWorkspace({}, [
    configureRsbuildSample
]);

const storybookRsbuildSample = defineWorkspace({}, [
    ignoreBrowserslist
]);

const storybookRslibSample = defineWorkspace({}, [
    ignoreBrowserslist
]);

const config: KnipConfig = {
    workspaces: {
        ".": rootConfig,
        "packages/*": packagesConfig,
        "packages/swc-configs": swcConfig,
        "packages/webpack-configs": webpackConfig,
        "samples/webpack/app": webpackSampleAppConfig,
        "samples/webpack/components": webpackSampleComponentsConfig,
        "samples/webpack/tsup-lib": webpackSampleTsupLibConfig,
        "samples/rsbuild/app": rsbuildSampleAppConfig,
        "samples/rsbuild/components": rsbuildSampleComponentsConfig,
        "samples/rsbuild/rslib-lib": rsbuildSampleRslibLibConfig,
        "samples/storybook/rsbuild": storybookRsbuildSample,
        "samples/storybook/rslib": storybookRslibSample
    },
    ignoreWorkspaces: [
        // Until it's migrated to ESLint 9.
        "packages/eslint-plugin",
        // Until it supports ESM.
        "packages/stylelint-configs"
    ],
    exclude: [
        // It cause issues with config like Jest "projects".
        "unresolved"
    ],
    ignoreExportsUsedInFile: true
};

export default config;
