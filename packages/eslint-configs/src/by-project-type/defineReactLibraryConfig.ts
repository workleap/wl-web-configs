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

export interface DefineReactLibraryConfigOptions {
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
export function defineReactLibraryConfig(tsconfigRootDir: string, options: DefineReactLibraryConfigOptions = {}) {
    const {
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
        ...jestConfig(jest),
        ...jsonConfig(json),
        ...jsxAllyConfig(jsxAlly),
        ...packageJsonConfig(packageJson),
        ...reactConfig(react),
        ...storybookConfig(storybook),
        ...testingLibraryConfig(testingLibrary),
        ...typescriptConfig(tsconfigRootDir, typescript),
        // Temporary fix until the vitest plugin support defineConfig and the types are fixed.
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ...(vitestConfig(vitest) as any),
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
}
