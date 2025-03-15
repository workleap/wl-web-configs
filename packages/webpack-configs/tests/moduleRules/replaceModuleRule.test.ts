import { test } from "vitest";
import type { RuleSetRule, RuleSetUseItem, Configuration as WebpackConfig } from "webpack";
import { matchLoaderName, matchTest, replaceModuleRule } from "../../src/transformers/moduleRules.ts";

test.concurrent("when a matching module rule is found in the rules array, replace the module rule", ({ expect }) => {
    const newRule: RuleSetRule = {
        test: /\.(ts|tsx)/i,
        loader: "swc-loader"
    };

    const config: WebpackConfig = {
        module: {
            rules: [
                {
                    test: /\.(ts|tsx)/i,
                    loader: "babel-loader"
                },
                {
                    test: /\.(png|jpe?g|gif)/i,
                    type: "asset/resource"
                }
            ]
        }
    };

    replaceModuleRule(config, matchTest(/\.(ts|tsx)/i), newRule);

    expect(config.module?.rules?.length).toBe(2);
    expect(config.module!.rules![0]).toBe(newRule);
});

test.concurrent("when a matching module rule is found in a \"oneOf\" prop, replace the module rule", ({ expect }) => {
    const newRule: RuleSetRule = {
        test: /\.(ts|tsx)/i,
        loader: "swc-loader"
    };

    const config: WebpackConfig = {
        module: {
            rules: [
                {
                    test: /\.(png|jpe?g|gif)/i,
                    type: "asset/resource"
                },
                {
                    oneOf: [
                        {
                            test: /\.(ts|tsx)/i,
                            loader: "babel-loader"
                        }
                    ]
                }
            ]
        }
    };

    replaceModuleRule(config, matchTest(/\.(ts|tsx)/i), newRule);

    expect((config.module?.rules![1] as RuleSetRule).oneOf!.length).toBe(1);
    expect((config.module?.rules![1] as RuleSetRule).oneOf![0]).toBe(newRule);
});

test.concurrent("when a matching module rule is found in a \"use\" prop, replace the module rule", ({ expect }) => {
    const newRule: RuleSetUseItem = {
        loader: "swc-loader"
    };

    const config: WebpackConfig = {
        module: {
            rules: [
                {
                    test: /\.(ts|tsx)/i,
                    use: [
                        { loader: "babel-loader" }
                    ]
                },
                {
                    test: /\.js/i,
                    include: /node_modules/,
                    resolve: {
                        fullySpecified: false
                    }
                },
                {
                    test: /\.(png|jpe?g|gif)/i,
                    type: "asset/resource"
                }
            ]
        }
    };

    replaceModuleRule(config, matchLoaderName("babel-loader"), newRule);

    expect(((config.module?.rules![0] as RuleSetRule).use as RuleSetUseItem[]).length).toBe(1);
    expect(((config.module?.rules![0] as RuleSetRule).use as RuleSetUseItem[])[0]).toBe(newRule);
});

test.concurrent("when no matching module rule is found, throw an error", ({ expect }) => {
    const newRule: RuleSetRule = {
        test: /\.(ts|tsx)/i,
        loader: "swc-loader"
    };

    const config: WebpackConfig = {
        module: {
            rules: [
                {
                    test: /\.(js|jsx)/i,
                    loader: "babel-loader"
                },
                {
                    test: /\.(png|jpe?g|gif)/i,
                    type: "asset/resource"
                }
            ]
        }
    };

    expect(() => replaceModuleRule(config, matchTest(/\.(ts|tsx)/i), newRule)).toThrow();
});
