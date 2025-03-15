import { describe, test } from "vitest";
import { browserslistToSwc, createSwcTargetsFromBrowserslistEntries } from "../src/browserslistToSwc.ts";

describe("createSwcTargetsFromBrowserslistEntries", () => {
    test.concurrent("when a browser is not supported, do not include a target for the browser", ({ expect }) => {
        const result = createSwcTargetsFromBrowserslistEntries([
            "and_uc 15.5",
            "baidu 13.18",
            "firefox 115"
        ]);

        expect(result).toMatchSnapshot();
    });

    test.concurrent("when a browser is a mobile alias to a desktop browser, include a target for the desktop browser", ({ expect }) => {
        const result = createSwcTargetsFromBrowserslistEntries([
            "and_chr 115",
            "and_ff 115",
            "ie_mob 11",
            "ios_saf 16.5",
            "op_mob 73"
        ]);

        expect(result).toMatchSnapshot();
    });

    test.concurrent("when there are multiple versions of the same browser, only include the oldest version of the browser", ({ expect }) => {
        const result = createSwcTargetsFromBrowserslistEntries([
            "android 115",
            "chrome 115",
            "chrome 113",
            "chrome 108",
            "chrome 112",
            "chrome 107",
            "opera 101",
            "chrome 111",
            "chrome 110",
            "chrome 109",
            "chrome 114",
            "edge 115",
            "edge 114",
            "edge 113",
            "firefox 109",
            "firefox 116",
            "firefox 115",
            "firefox 107",
            "firefox 114",
            "firefox 113",
            "firefox 108",
            "firefox 112",
            "firefox 111",
            "firefox 110"
        ]);

        expect(result).toMatchSnapshot();
    });

    test.concurrent("when a browser is a mobile alias for a desktop browser, and the mobile alias version is older than the oldest desktop browser version, use the alias version", ({ expect }) => {
        const result = createSwcTargetsFromBrowserslistEntries([
            "and_chr 115",
            "chrome 116"
        ]);

        expect(result).toMatchSnapshot();
    });

    test.concurrent("when a browser version is a range, only keep the lower value of the range", ({ expect }) => {
        const result = createSwcTargetsFromBrowserslistEntries([
            "safari 15.2-15.3"
        ]);

        expect(result).toMatchSnapshot();
    });

    test.concurrent("when a browser version has a 0 digit, remove the digit", ({ expect }) => {
        const result = createSwcTargetsFromBrowserslistEntries([
            "samsung 19.0"
        ]);

        expect(result).toMatchSnapshot();
    });

    test.concurrent("when a browser version has an non 0 digit, keep the digit", ({ expect }) => {
        const result = createSwcTargetsFromBrowserslistEntries([
            "safari 15.4"
        ]);

        expect(result).toMatchSnapshot();
    });

    test.concurrent("when a browser version is \"all\", keep \"all\"", ({ expect }) => {
        const result = createSwcTargetsFromBrowserslistEntries([
            "chrome all"
        ]);

        expect(result).toMatchSnapshot();
    });
});

test.concurrent("when queries are provided, use the queries", ({ expect }) => {
    const result = browserslistToSwc({
        queries: ["IE 11", "chrome 113", "firefox 107"]
    });

    expect(result).toMatchSnapshot();
});
