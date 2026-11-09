import type { WebpackConfig } from "../types.ts";

export type WebpackPlugin = NonNullable<WebpackConfig["plugins"]>[number];

export type PluginMatcher = (plugin: WebpackPlugin, index: number, array: WebpackPlugin[]) => boolean;

export type WithPluginMatcherInfo = {
    info: {
        type: string;
        value: string;
    };
} & PluginMatcher;

export function matchConstructorName(name: string): PluginMatcher {
    const matcher: WithPluginMatcherInfo = plugin => {
        return plugin?.constructor.name === name;
    };

    // Add contextual information about the matcher for debugging.
    matcher.info = {
        type: matchConstructorName.name,
        value: name
    };

    return matcher;
}

export interface PluginMatch {
    plugin: WebpackPlugin;
    index: number;
}

export function findPlugin(config: WebpackConfig, matcher: PluginMatcher) {
    const matches: PluginMatch[] = [];

    config.plugins?.forEach((x, index, array) => {
        if (matcher(x, index, array)) {
            matches.push({
                plugin: x,
                index
            });
        }
    });

    if (matches.length > 1) {
        const matcherInfo = (matcher as WithPluginMatcherInfo).info;

        throw new Error(
            `[webpack-configs] Found more than 1 matching plugin.\n[webp-configs] Matcher: "${JSON.stringify(matcherInfo)}"\n[webpack-configs] Matches: "${JSON.stringify(matches.map(x => x.plugin))}"`
        );
    }

    return matches[0];
}

export function replacePlugin(config: WebpackConfig, matcher: PluginMatcher, newPlugin: WebpackPlugin) {
    const match = findPlugin(config, matcher);

    if (match) {
        config.plugins![match.index] = newPlugin;
    } else {
        const matcherInfo = (matcher as WithPluginMatcherInfo).info;

        throw new Error(
            `[webpack-configs] Couldn't replace the plugin because no match has been found.\n[webpack-configs] Matcher: "${JSON.stringify(matcherInfo)}"`
        );
    }
}

export function addBeforePlugin(config: WebpackConfig, matcher: PluginMatcher, newPlugins: WebpackPlugin[]) {
    const match = findPlugin(config, matcher);

    if (match) {
        config.plugins?.splice(match.index, 0, ...newPlugins);
    } else {
        const matcherInfo = (matcher as WithPluginMatcherInfo).info;

        throw new Error(
            `[webpack-configs] Couldn't add the new plugins because no match has been found.\n[webpack-configs] Matcher: "${JSON.stringify(matcherInfo)}"`
        );
    }
}

export function addAfterPlugin(config: WebpackConfig, matcher: PluginMatcher, newPlugins: WebpackPlugin[]) {
    const match = findPlugin(config, matcher);

    if (match) {
        config.plugins?.splice(match.index + 1, 0, ...newPlugins);
    } else {
        const matcherInfo = (matcher as WithPluginMatcherInfo).info;

        throw new Error(
            `[webpack-configs] Couldn't add the new plugins because no match has been found.\n[webpack-configs] Matcher: "${JSON.stringify(matcherInfo)}"`
        );
    }
}

export function removePlugin(config: WebpackConfig, matcher: PluginMatcher) {
    const countBefore = config.plugins?.length ?? 0;

    config.plugins = config.plugins?.filter((...args) => !matcher(...args));

    const countAfter = config.plugins?.length ?? 0;

    if (countBefore === countAfter) {
        const matcherInfo = (matcher as WithPluginMatcherInfo).info;

        throw new Error(
            `[webpack-configs] Didn't remove any plugin because no match has been found.\n[webpack-configs] Matcher: "${JSON.stringify(matcherInfo)}"`
        );
    }
}
