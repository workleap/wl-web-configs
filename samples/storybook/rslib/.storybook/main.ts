import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import type { StorybookConfig } from "storybook-react-rsbuild";

const require = createRequire(import.meta.url);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getAbsolutePath(value: string): any {
    return dirname(require.resolve(join(value, "package.json")));
}

const storybookConfig: StorybookConfig = {
    framework: getAbsolutePath("storybook-react-rsbuild"),
    addons: [
        getAbsolutePath("@storybook/addon-links"),
        getAbsolutePath("storybook-addon-rslib")
    ],
    stories: [
        "../../../rsbuild/components/src/**/*.stories.(tsx|mdx)"
    ]
};

export default storybookConfig;
