import { defineConfig, globalIgnores } from "eslint/config";
import { coreConfig, type CoreConfigOptions, coreGlobalIgnores } from "../core.ts";
import { jestConfig, type JestConfigOptions, jestGlobalIgnores } from "../jest.ts";
import { jsonConfig, JsonConfigOptions, jsonGlobalIgnores } from "../json.ts";
import { jsxAllyConfig, type JsxAllyConfigOptions, jsxAllyGlobalIgnores } from "../jsxAlly.ts";
import { packageJsonConfig, type PackageJsonConfigOptions, packageJsonGlobalIgnores } from "../packageJson.ts";
import { WorkleapPlugin } from "../plugins/workleapPlugin.ts";
import { reactConfig, type ReactConfigOptions, reactGlobalIgnores } from "../react.ts";
import { storybookConfig, type StorybookConfigOptions, storybookGlobalIgnores } from "../storybook.ts";
import { testingLibraryConfig, type TestingLibraryConfigOptions, testingLibraryGlobalIgnores } from "../testingLibrary.ts";
import { typescriptConfig, type TypescriptConfigOptions, typescriptGlobalIgnores } from "../typescript.ts";
import { vitestConfig, type VitestConfigOptions, vitestGlobalIgnores } from "../vitest.ts";
import { yamlConfig, type YamlConfigOptions, yamlGlobalIgnores } from "../yaml.ts";

/*

error  Parsing error: C:\Dev\workleap\wl-web-configs\samples\storybook\rsbuild\.storybook\main.ts was not found by the project service. Consider either including it in the tsconfig.json or including it in allowDefaultProject

-> It usually means that the project tsconfig.json file cannot find the specified file
-> Make sure to clear the ESLint cache after such an error because update the tsconfig.json file doesn't invalidate the ESLint cache

*/

/*

import { defineConfig, globalIgnores } from "eslint/config";
import { defineReactLibraryConfig } from  "@workleap/eslint-configs";

export default defineConfig([
    globalIgnores([
        "/reports/**"
    ]),
    defineReactLibraryConfig(import.meta.dirname)
]);

*/

/*

The key insight was that ESLint 9's flat config system requires ignores to be specified in the configuration
file itself for optimal performance, rather than relying on CLI flags (--ignore-pattern). The ignores array at the beginning of the
 config ensures files are filtered out during the file discovery phase, not after.

*/

export interface DefineWebApplicationConfigOptions {
    testFramework?: "vitest" | "jest";
    core?: CoreConfigOptions;
    jest?: JestConfigOptions;
    json?: JsonConfigOptions;
    jsxAlly?: JsxAllyConfigOptions;
    packageJson?: PackageJsonConfigOptions;
    react?: ReactConfigOptions;
    storybook?: StorybookConfigOptions;
    testingLibrary?: TestingLibraryConfigOptions;
    typescript?: TypescriptConfigOptions;
    vitest?: VitestConfigOptions;
    yaml?: YamlConfigOptions;
}

/**
 * @param tsconfigRootDir The directory of the tsconfig file to use for rules that needs a TypeScript type check: https://typescript-eslint.io/packages/parser/#tsconfigrootdir.
 * @param options An optional object of options for the ESlint core and plugins rules.
 */
export const defineWebApplicationConfig = (tsconfigRootDir: string, options: DefineWebApplicationConfigOptions = {}) => {
    const {
        testFramework = "vitest",
        core,
        jest,
        json,
        jsxAlly,
        packageJson,
        react,
        storybook,
        testingLibrary,
        typescript,
        vitest,
        yaml
    } = options;

    return defineConfig([
        // node_modules folder is ignored by default.
        globalIgnores([
            "dist",
            "**/__snapshots__/*",
            ".turbo",
            ...coreGlobalIgnores,
            ...jestGlobalIgnores,
            ...jsonGlobalIgnores,
            ...jsxAllyGlobalIgnores,
            ...packageJsonGlobalIgnores,
            ...reactGlobalIgnores,
            ...storybookGlobalIgnores,
            ...testingLibraryGlobalIgnores,
            ...typescriptGlobalIgnores,
            ...vitestGlobalIgnores,
            ...yamlGlobalIgnores
        ]),
        ...coreConfig(core),
        ...jestConfig({
            ...jest,
            enabled: jest?.enabled ?? testFramework === "jest"
        }),
        ...jsonConfig(json),
        ...jsxAllyConfig(jsxAlly),
        ...packageJsonConfig(packageJson),
        ...reactConfig(react),
        ...storybookConfig(storybook),
        ...testingLibraryConfig(testingLibrary),
        ...typescriptConfig(tsconfigRootDir, typescript),
        // Temporary fix until the vitest plugin support defineConfig and the types are fixed.
        ...(vitestConfig({
            ...vitest,
            enabled: vitest?.enabled ?? testFramework === "vitest"
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        }) as any),
        ...yamlConfig(yaml),
        {
            plugins: {
                "@workleap": WorkleapPlugin
            },
            rules: {
                "@workleap/strict-css-modules-names": "warn"
            }
        }
    ]);
};
