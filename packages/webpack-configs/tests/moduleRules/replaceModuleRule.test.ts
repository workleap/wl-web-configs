import type { Configuration, RuleSetRule, RuleSetUseItem } from "webpack";
import { matchLoaderName, matchTest, replaceModuleRule } from "../../src/transformers/moduleRules.ts";

test("when a matching module rule is found in the rules array, replace the module rule", () => {
    const newRule: RuleSetRule = {
        test: /\.(ts|tsx)/i,
        loader: "swc-loader"
    };

    const config: Configuration = {
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

test("when a matching module rule is found in a \"oneOf\" prop, replace the module rule", () => {
    const newRule: RuleSetRule = {
        test: /\.(ts|tsx)/i,
        loader: "swc-loader"
    };

    const config: Configuration = {
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

test("when a matching module rule is found in a \"use\" prop, replace the module rule", () => {
    const newRule: RuleSetUseItem = {
        loader: "swc-loader"
    };

    const config: Configuration = {
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

test("when no matching module rule is found, do nothing", () => {
    jest.spyOn(console, "log").mockImplementation(jest.fn());

    const newRule: RuleSetRule = {
        test: /\.(ts|tsx)/i,
        loader: "swc-loader"
    };

    const config: Configuration = {
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

    replaceModuleRule(config, matchTest(/\.(ts|tsx)/i), newRule);

    expect(config.module?.rules?.length).toBe(2);

    jest.spyOn(console, "log").mockRestore();
});
