// Inspired by https://github.com/marcofugaro/browserslist-to-esbuild/blob/main/src/index.js.
//
// This function exist because browserslist-rs (which is used under the hood by SWC) doesn't support browserslist "extends" syntax: https://github.com/browserslist/browserslist-rs#limitations.
// Therefore, we must parse ourself the ".browserslistrc" file to extract the browser entries and transform them into valid SWC "env.targets".
//
// The function will convert an array of browserslist entries from:
//
// ['and_chr 115',   'and_ff 115',   'and_qq 13.1',
// 'and_uc 15.5',   'android 115',  'baidu 13.18',
// 'bb 10',         'bb 7',         'chrome 116',
// 'chrome 115',    'chrome 114',   'chrome 113',
// 'chrome 112',    'chrome 111',   'chrome 110',
// 'chrome 109',    'chrome 108',   'chrome 107',
// 'edge 115',      'edge 114',     'edge 113',
// 'edge 112',      'edge 111',     'edge 110',
// 'edge 109',      'edge 108',     'edge 107',
// 'edge 106',      'firefox 116',  'firefox 115',
// 'firefox 114',   'firefox 113',  'firefox 112',
// 'firefox 111',   'firefox 110',  'firefox 109',
// 'firefox 108',   'firefox 107',  'ie 11',
// 'ie 10',         'ie 9',         'ie 8',
// 'ie 7',          'ie 6',         'ie 5.5',
// 'ie_mob 11',     'ie_mob 10',    'ios_saf 16.5',
// 'ios_saf 16.4',  'ios_saf 16.3', 'ios_saf 16.2',
// 'ios_saf 16.1',  'ios_saf 16.0', 'ios_saf 15.6-15.7',
// 'ios_saf 15.5',  'ios_saf 15.4', 'ios_saf 15.2-15.3',
// 'kaios 3.0-3.1', 'kaios 2.5',    'op_mini all',
// 'op_mob 73',     'opera 101',    'opera 100',
// 'opera 99',      'opera 98',     'opera 97',
// 'opera 96',      'opera 95',     'opera 94',
// 'opera 93',      'opera 92',     'safari 16.5',
// 'safari 16.4',   'safari 16.3',  'safari 16.2',
// 'safari 16.1',   'safari 16.0',  'safari 15.6',
// 'safari 15.5',   'safari 15.4',  'safari 15.2-15.3',
// 'samsung 21',    'samsung 20',   'samsung 19.0',
// 'samsung 18.0',  'samsung 17.0', 'samsung 16.0',
// 'samsung 15.0',  'samsung 14.0', 'samsung 13.0',
// 'samsung 12.0']
//
// To an object literal of SWC "env.targets":
//
// {
//  chrome: '107',
//  firefox: '107',
//  android: '115',
//  edge: '106',
//  ie: '5.5',
//  opera: '73',
//  safari: '15.2',
//  samsung: '12'
// }

import browserslist from "browserslist";

// Original browserslist-rs supported browsers (https://github.com/browserslist/browserslist-rs/blob/99a3244fc8c0e631a80a9cae5c41dca6c5a2aae5/build.rs#L10)
// minus the browsers that are discarted by SWC (https://github.com/swc-project/swc/blob/main/crates/preset_env_base/src/lib.rs#L105).
const SwcSupportedBrowsers = [
    "ie",
    "edge",
    "firefox",
    "chrome",
    "safari",
    "opera",
    "ios",
    "android",
    "op_mob",
    "and_chr",
    "and_ff",
    "ie_mob",
    "samsung"
] as const;

// SWC browsers aliases (https://github.com/swc-project/swc/blob/main/crates/preset_env_base/src/lib.rs#L90).
const SwcMobileBrowserAliases: Record<string, string> = {
    "and_chr": "chrome",
    "and_ff": "firefox",
    "ie_mob": "ie",
    "ios_saf": "ios",
    "op_mob": "opera"
};

function parseBrowserslistEntry(entry: string) {
    // "chrome 11" --> ["chrome", "11"]
    const values = entry.split(" ");

    let browser = values[0];
    let version = values[1];

    // "and_chr" --> "chrome"
    if (SwcMobileBrowserAliases[browser]) {
        browser = SwcMobileBrowserAliases[browser];
    }

    // "11.0-12.0" --> "11.0"
    if (version.includes("-")) {
        version = version.slice(0, version.indexOf("-"));
    }

    // "11.0" --> "11"
    if (version.endsWith(".0")) {
        version = version.slice(0, -2);
    }

    return {
        browser,
        version
    };
}

export function createSwcTargetsFromBrowserslistEntries(entries: string[]) {
    return entries.reduce((acc, x: string) => {
        const { browser, version } = parseBrowserslistEntry(x);

        // Exclude browsers that are not supported by SWC.
        if (!((SwcSupportedBrowsers as unknown) as string[]).includes(browser)) {
            return acc;
        }

        // Let's make TS happy as we are now certain that the browser is part
        // of the supported browsers list.
        const _browser = browser as keyof typeof SwcSupportedBrowsers;

        // SWC "env.targets" only support a single entry per target (browser).
        // Therefore, we loop through the browser versions to keep only the oldest one.
        if (acc[_browser]) {
            if (parseFloat(acc[_browser]) > parseFloat(version)) {
                acc[_browser] = version;
            }
        } else {
            acc[_browser] = version;
        }

        return acc;
    }, {} as Record<keyof typeof SwcSupportedBrowsers, string>);
}

export interface BrowserslistToSwcOptions extends Omit<browserslist.Options, "path"> {
    queries?: string | string[];
}

export function browserslistToSwc(options: BrowserslistToSwcOptions = {}) {
    const {
        queries,
        ...browserlistsOptions
    } = options;

    // Will return the entries matching the "queries" prop when provided, otherwise,
    // the function will load the closest ".browserslistrc" file.
    const entries = browserslist(queries, {
        path: "./browserslistrc",
        ...browserlistsOptions
    });

    return createSwcTargetsFromBrowserslistEntries(entries);
}
