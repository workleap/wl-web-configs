import path from "node:path";
import type { RuleSetRule, RuleSetUseItem } from "webpack";
import type { WebpackConfig } from "../types.ts";

export type ModuleRuleMatcher = (moduleRule: RuleSetRule | RuleSetUseItem, index: number, array: RuleSetRule[] | RuleSetUseItem[]) => boolean;

export type WithModuleRuleMatcherInfo = {
    info: {
        type: string;
        value: string;
    };
} & ModuleRuleMatcher;

function isNameMatchingLoader(loader: string, name: string) {
    return loader === name || loader.includes(`${path.sep}${name}${path.sep}`) || loader.includes(`@${name}${path.sep}`);
}

export function matchLoaderName(name: string): ModuleRuleMatcher {
    const matcher: WithModuleRuleMatcherInfo = moduleRule => {
        if (typeof moduleRule === "string") {
            return isNameMatchingLoader(moduleRule, name);
        } else {
            if ("loader" in moduleRule && moduleRule.loader) {
                return isNameMatchingLoader(moduleRule.loader, name);
            }
        }

        return false;
    };

    // Add contextual information about the matcher for debugging.
    matcher.info = {
        type: matchLoaderName.name,
        value: name
    };

    return matcher;
}

export type AssetModuleType
    = | "javascript/auto"
      | "javascript/dynamic"
      | "javascript/esm"
      | "json"
      | "webassembly/sync"
      | "webassembly/async"
      | "asset"
      | "asset/source"
      | "asset/resource"
      | "asset/inline";

export function matchAssetModuleType(type: AssetModuleType): ModuleRuleMatcher {
    const matcher: WithModuleRuleMatcherInfo = moduleRule => {
        if (typeof moduleRule !== "string" && "type" in moduleRule) {
            return moduleRule.type === type;
        }

        return false;
    };

    // Add contextual information about the matcher for debugging.
    matcher.info = {
        type: matchAssetModuleType.name,
        value: type
    };

    return matcher;
}

export function matchTest(test: string | RegExp): ModuleRuleMatcher {
    const matcher: WithModuleRuleMatcherInfo = moduleRule => {
        if (typeof moduleRule !== "string" && "test" in moduleRule) {
            if (typeof moduleRule.test === "object" && typeof test === "object") {
                // Assuming it's regular expressions.
                return moduleRule.test.toString() === test.toString();
            }

            return moduleRule.test === test;
        }

        return false;
    };

    // Add contextual information about the matcher for debugging.
    matcher.info = {
        type: matchTest.name,
        value: test.toString()
    };

    return matcher;
}

export interface ModuleRuleMatch {
    moduleRule: RuleSetRule | RuleSetUseItem;
    index: number;
    parent: RuleSetRule[] | RuleSetUseItem[];
}

function toMatch(moduleRule: RuleSetRule | RuleSetUseItem, index: number, parent: RuleSetRule[] | RuleSetUseItem[]) {
    return {
        moduleRule,
        index,
        parent
    };
}

function isRuleSetRule(value: RuleSetRule | RuleSetUseItem): value is RuleSetRule {
    return (value as RuleSetRule).use !== undefined || (value as RuleSetRule).oneOf !== undefined;
}

function findModuleRulesRecursively(moduleRules: RuleSetRule[] | RuleSetUseItem[], matcher: ModuleRuleMatcher, parent: RuleSetRule[] | RuleSetUseItem[], matches: ModuleRuleMatch[]) {
    moduleRules.forEach((x, index, array) => {
        if (x) {
            if (matcher(x, index, array)) {
                matches.push(toMatch(x, index, parent));
            } else {
                if (isRuleSetRule(x)) {
                    if (x.use) {
                        findModuleRulesRecursively(x.use as RuleSetUseItem[], matcher, x.use as RuleSetUseItem[], matches);
                    } else if (x.oneOf) {
                        // This error seems to have been introduced by either TS 5.2. or webpack 5.88.1 (https://github.com/webpack/webpack/releases/tag/v5.88.1),
                        // I am not sure what changed thought.
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-ignore
                        findModuleRulesRecursively(x.oneOf, matcher, x.oneOf, matches);
                    }
                }
            }
        }
    });
}

export function findModuleRule(config: WebpackConfig, matcher: ModuleRuleMatcher) {
    const moduleRules = config.module?.rules;

    if (!moduleRules) {
        return;
    }

    const matches: ModuleRuleMatch[] = [];

    findModuleRulesRecursively(moduleRules as RuleSetRule[], matcher, moduleRules as RuleSetRule[], matches);

    if (matches.length > 1) {
        const matcherInfo = (matcher as WithModuleRuleMatcherInfo).info;

        throw new Error(`[webpack-configs] Found more than 1 matching module rule.\n[webpack-configs] Matcher: "${JSON.stringify(matcherInfo)}"\n[webpack-configs] Matches: "${JSON.stringify(matches.map(x => x.moduleRule))}"`);
    }

    return matches[0];
}

export function findModuleRules(config: WebpackConfig, matcher: ModuleRuleMatcher) {
    const moduleRules = config.module?.rules;

    if (!moduleRules) {
        return;
    }

    const matches: ModuleRuleMatch[] = [];

    findModuleRulesRecursively(moduleRules as RuleSetRule[], matcher, moduleRules as RuleSetRule[], matches);

    return matches;
}

export function addBeforeModuleRule(config: WebpackConfig, matcher: ModuleRuleMatcher, newModuleRules: RuleSetRule[] | RuleSetUseItem[]) {
    const match = findModuleRule(config, matcher);

    if (match) {
        match.parent.splice(match.index, 0, ...newModuleRules);
    } else {
        const matcherInfo = (matcher as WithModuleRuleMatcherInfo).info;

        throw new Error(`[webpack-configs] Couldn't add the new module rules because no match has been found.\n[webpack-configs] Matcher: "${JSON.stringify(matcherInfo)}"`);
    }
}

export function addAfterModuleRule(config: WebpackConfig, matcher: ModuleRuleMatcher, newModuleRules: RuleSetRule[] | RuleSetUseItem[]) {
    const match = findModuleRule(config, matcher);

    if (match) {
        match.parent.splice(match.index + 1, 0, ...newModuleRules);
    } else {
        const matcherInfo = (matcher as WithModuleRuleMatcherInfo).info;

        throw new Error(`[webpack-configs] Couldn't add the new module rules because no match has been found.\n[webpack-configs] Matcher: "${JSON.stringify(matcherInfo)}"`);
    }
}

export function replaceModuleRule(config: WebpackConfig, matcher: ModuleRuleMatcher, newModuleRule: RuleSetRule | RuleSetUseItem) {
    const match = findModuleRule(config, matcher);

    if (match) {
        match.parent[match.index] = newModuleRule;
    } else {
        const matcherInfo = (matcher as WithModuleRuleMatcherInfo).info;

        throw new Error(`[webpack-configs] Couldn't replace the module rule because no match has been found.\n[webpack-configs] Matcher: "${JSON.stringify(matcherInfo)}"`);
    }
}

export function removeModuleRules(config: WebpackConfig, matcher: ModuleRuleMatcher) {
    const moduleRules = config.module?.rules;

    if (!moduleRules) {
        return;
    }

    const matches: ModuleRuleMatch[] = [];

    findModuleRulesRecursively(moduleRules as RuleSetRule[], matcher, moduleRules as RuleSetRule[], matches);

    if (matches.length > 0) {
        // Must keep the initial parent arrays' length to calculate the adjustment
        // once the first match has been deleted.
        const initialParentLengths = new Map<RuleSetRule[] | RuleSetUseItem[], number>(matches.map(x => [x.parent, x.parent.length]));

        matches.forEach(x => {
            const positionAdjustment = initialParentLengths.get(x.parent)! - x.parent.length;

            x.parent.splice(x.index - positionAdjustment, 1);
        });
    } else {
        const matcherInfo = (matcher as WithModuleRuleMatcherInfo).info;

        throw new Error(`[webpack-configs] Didn't remove any module rules because no match has been found.\n[webpack-configs] Matcher: "${matcherInfo}"`);
    }
}
