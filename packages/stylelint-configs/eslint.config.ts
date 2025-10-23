// @ts-expect-error There's an error because the "module" option must be "CommonJs" for this package.
import { defineTypeScriptLibraryConfig } from "@workleap/eslint-configs";

// eslint-disable-next-line @typescript-eslint/no-unsafe-call
export default defineTypeScriptLibraryConfig(
    // @ts-expect-error There's an error because the "module" option must be "CommonJs" for this package.
    import.meta.dirname,
    {
        packageJson: {
            rules: {
                "package-json/require-type": "off"
            }
        }
    }
);
