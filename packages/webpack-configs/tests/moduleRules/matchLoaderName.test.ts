import path from "node:path";
import { test } from "vitest";
import type { RuleSetRule, RuleSetUseItem } from "webpack";
import { matchLoaderName } from "../../src/transformers/moduleRules.ts";

test.concurrent("when module rule loader exactly match name, return true", ({ expect }) => {
    const moduleRule: RuleSetRule = {
        loader: "swc-loader"
    };

    const matcher = matchLoaderName("swc-loader");

    expect(matcher(moduleRule, 0, [])).toBeTruthy();
});

test.concurrent("when module rule loader is a path, return true if the name match an exact path segment", ({ expect }) => {
    const moduleRule: RuleSetRule = {
        loader: path.resolve("/node_modules/.pnpm/postcss-loader@7.3.3_postcss@8.4.24_webpack@5.86.0/node_modules/postcss-loader/dist/cjs.js")
    };

    const matcher1 = matchLoaderName("css-loader");
    const matcher2 = matchLoaderName("postcss-loader");

    expect(matcher1(moduleRule, 0, [])).toBeFalsy();
    expect(matcher2(moduleRule, 0, [])).toBeTruthy();
});

test.concurrent("when module rule loader doesn't match name, return false", ({ expect }) => {
    const moduleRule: RuleSetRule = {
        loader: "css-loader"
    };

    const matcher = matchLoaderName("swc-loader");

    expect(matcher(moduleRule, 0, [])).toBeFalsy();
});

test.concurrent("when module rule use item loader exactly match name, return true", ({ expect }) => {
    const moduleRule: RuleSetUseItem = {
        loader: "swc-loader"
    };

    const matcher = matchLoaderName("swc-loader");

    expect(matcher(moduleRule, 0, [])).toBeTruthy();
});

test.concurrent("when module rule use item loader is a path, return true if the name match an exact path segment", ({ expect }) => {
    const moduleRule: RuleSetUseItem = {
        loader: path.resolve("/node_modules/.pnpm/postcss-loader@7.3.3_postcss@8.4.24_webpack@5.86.0/node_modules/postcss-loader/dist/cjs.js")
    };

    const matcher1 = matchLoaderName("css-loader");
    const matcher2 = matchLoaderName("postcss-loader");

    expect(matcher1(moduleRule, 0, [])).toBeFalsy();
    expect(matcher2(moduleRule, 0, [])).toBeTruthy();
});

test.concurrent("when module rule use item loader doesn't match name, return false", ({ expect }) => {
    const moduleRule: RuleSetUseItem = {
        loader: "css-loader"
    };

    const matcher = matchLoaderName("swc-loader");

    expect(matcher(moduleRule, 0, [])).toBeFalsy();
});

test.concurrent("when module rule use item is a string and exactly match name, return true", ({ expect }) => {
    const moduleRule: RuleSetUseItem = "swc-loader";

    const matcher = matchLoaderName("swc-loader");

    expect(matcher(moduleRule, 0, [])).toBeTruthy();
});

test.concurrent("when module rule use item is a string and a path, return true if the name match an exact path segment", ({ expect }) => {
    const moduleRule: RuleSetUseItem = path.resolve("/node_modules/.pnpm/postcss-loader@7.3.3_postcss@8.4.24_webpack@5.86.0/node_modules/postcss-loader/dist/cjs.js");

    const matcher1 = matchLoaderName("css-loader");
    const matcher2 = matchLoaderName("postcss-loader");

    expect(matcher1(moduleRule, 0, [])).toBeFalsy();
    expect(matcher2(moduleRule, 0, [])).toBeTruthy();
});

test.concurrent("when module rule use item is a string and doesn't match name, return false", ({ expect }) => {
    const moduleRule: RuleSetUseItem = "css-loader";

    const matcher = matchLoaderName("swc-loader");

    expect(matcher(moduleRule, 0, [])).toBeFalsy();
});


