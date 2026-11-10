import { defineConfig } from "oxlint";

export default defineConfig({
    // oxlint also honors .gitignore (dist, storybook-static, ...).
    // - .claude/ holds the vendored skills (skills-lock.json), which upstream replaces wholesale, and, in a main
    //   checkout, the agent worktrees.
    // - mockServiceWorker.js is MSW's generated worker (`msw init`).
    ignorePatterns: [".claude/**", "docs/**", "**/mockServiceWorker.js"],
    // Setting `plugins` overwrites oxlint's default plugin set (eslint, typescript, unicorn, oxc),
    // so the defaults must be listed explicitly alongside the extras we want enabled.
    plugins: ["eslint", "typescript", "unicorn", "oxc", "react", "import", "jsx-a11y", "promise", "react-perf"],
    // Type-aware rules run through oxlint-tsgolint.
    options: { typeAware: true },
    categories: {
        suspicious: "warn",
        perf: "warn"
    },
    rules: {
        "oxc/no-barrel-file": "warn",
        // It replaces a spread by Object.assign which often breaks the behavior since it update the source object rather than cloning.
        "oxc/no-map-spread": "off",
        "unicorn/consistent-function-scoping": "off",
        "eslint/array-callback-return": "warn",
        "eslint/curly": "warn",
        "eslint/eqeqeq": ["warn", "smart"],
        "eslint/no-caller": "warn",
        "eslint/no-console": "off",
        "eslint/no-eval": "warn",
        "eslint/no-extend-native": "warn",
        "eslint/no-extra-bind": "warn",
        "eslint/no-lone-blocks": "warn",
        "eslint/no-loop-func": "warn",
        "eslint/no-new-wrappers": "warn",
        "eslint/no-param-reassign": "warn",
        "eslint/no-script-url": "warn",
        "eslint/no-self-compare": "warn",
        "eslint/no-sequences": "warn",
        "eslint/no-template-curly-in-string": "warn",
        "eslint/no-throw-literal": "warn",
        "eslint/no-unneeded-ternary": "warn",
        "eslint/no-useless-computed-key": "warn",
        "eslint/no-useless-concat": "warn",
        "eslint/no-useless-constructor": "warn",
        "eslint/no-useless-rename": "warn",
        "eslint/no-var": "warn",
        "eslint/prefer-const": "warn",
        "import/no-cycle": "warn",
        "import/no-duplicates": "warn",
        "import/no-self-import": "warn",
        "import/no-unassigned-import": "off",
        "react/button-has-type": "warn",
        "react/jsx-key": "warn",
        "react/jsx-no-constructed-context-values": "warn",
        "react/jsx-no-duplicate-props": "warn",
        "react/no-array-index-key": "warn",
        "react/react-in-jsx-scope": "off",
        "react/rules-of-hooks": "warn",
        "react/exhaustive-deps": "warn",
        "react-perf/jsx-no-new-function-as-prop": "off",
        "typescript/consistent-type-imports": "warn",
        "typescript/no-import-type-side-effects": "error",
        "typescript/no-explicit-any": "warn",
        "typescript/no-unsafe-type-assertion": "off",
        "typescript/consistent-return": "off",
        "typescript/no-misused-promises": ["warn", { checksVoidReturn: { attributes: false } }],
        "typescript/return-await": "warn",
        // A `default` branch is a deliberate catch-all; only a switch that can fall through is a finding.
        "typescript/switch-exhaustiveness-check": ["warn", { considerDefaultExhaustiveForUnions: true }],
        "typescript/use-unknown-in-catch-callback-variable": "warn",
        "jsx-a11y/no-autofocus": "off",
        "jsx-a11y/anchor-is-valid": "warn"
    },
    overrides: [
        {
            // Every project tests with Vitest, except the webpack samples, which test with Jest. Each plugin is enabled only
            // where its runner is used: the two plugins share most rules, so enabling both reports every finding twice.
            // A plugin's rules can only be configured in the override that enables it: a later override is ignored.
            files: ["packages/**", "samples/rsbuild/**", "samples/storybook/**"],
            plugins: ["vitest"],
            rules: {
                "vitest/no-conditional-expect": "off",
                // `vi.fn()` without type parameters is fine when the test never reads the mock's arguments back.
                "vitest/require-mock-type-parameters": "off"
            }
        },
        {
            files: ["samples/webpack/**"],
            plugins: ["jest"],
            rules: {
                "jest/no-conditional-expect": "off"
            }
        },
        {
            files: ["**/*.stories.tsx", "**/.storybook/**"],
            rules: {
                "react-perf/jsx-no-jsx-as-prop": "off",
                "react-perf/jsx-no-new-object-as-prop": "off"
            }
        },
        {
            files: ["**/*.test.ts", "**/*.test.tsx"],
            rules: {
                "typescript/no-explicit-any": "off",
                // `expect(spy.method)` reads the method unbound by design.
                "typescript/unbound-method": "off",
                // Assertions such as `config.module?.rules![1]` assert the shape under test: a crash is a failed test.
                "eslint/no-unsafe-optional-chaining": "off",
                // Assertions compare webpack's RuleSetCondition (a RegExp at runtime) through `toString()`.
                "typescript/no-base-to-string": "off"
            }
        }
    ]
});
