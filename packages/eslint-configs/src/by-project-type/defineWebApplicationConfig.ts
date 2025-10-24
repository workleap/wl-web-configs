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

The WHY for the interface instead of using nested "extends".

1- ESlint flat config doesn't support nested "extends":

Each configuration object may have an extends key, but only at the top level — not inside another config that already came from an extends.

Flat config was designed to be explicitly ordered and fully expanded:

- "extends" in flat config is syntactic sugar for concatenating multiple config objects.
- Allowing recursion would make config evaluation order ambiguous and slow.

So ESLint enforces a one-level-deep rule:

- only a top-level config object can have extends.

2- Each object in the array is evaluated independently. "plugins" declared in one object are not inherited by the next object.
So when a second object sets the rule using a plugin "xyz", it doesn’t "see" the plugin "xyz" that’s defined inside a predefine config, and ESLint throws.

3- Trying to redefine a plugin that as already been define in a configuration object will throw: Cannot redefine plugin "xyz".

*/

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

/*

Document the React compiler setting

*/

export interface DefineWebApplicationConfigOptions {
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
};
