import type { Rule } from "eslint";
import type ESTree from "estree";
import { basename, parse, sep } from "path";

export const sanitizePath = (filePath: string) => {
    return filePath.replace(/\//g, sep).trim();
};

export const splitPath = (filePath: string) => {
    return sanitizePath(filePath).split(sep);
};

export function getFilePath(context: Rule.RuleContext) {
    return sanitizePath(context.getFilename());
}

export function getFileName(context: Rule.RuleContext) {
    return basename(getFilePath(context));
}

const rule: Rule.RuleModule = {
    meta: {
        type: "suggestion",
        docs: {
            description: "CSS Modules should have the same name as a component and located in the same folder",
            category: "Strict",
            recommended: false,
            url: "https://github.com/workleap/wl-web-configs/blob/main/packages/eslint-plugin/docs/rules/strict-css-modules-names.md"
        }
    },
    create: function(context) {
        const parsedPath = parse(getFileName(context));

        const getNodeSource = (node: ESTree.ImportDeclaration) => {
            return sanitizePath(node.source != null ? node.source.value as string : "");
        };

        const isCssModule = (source: string) => {
            return source.endsWith(".module.css");
        };

        const isStylesheetInSameFolder = (source: string) => {
            return splitPath(source).length <= 2; // ./myImage.svg
        };

        return {
            ImportDeclaration: function(node) {
                const importSource = getNodeSource(node);

                if (isCssModule(importSource)) {
                    const validCssFilename = `${parsedPath.name}.module.css`;

                    if (!isStylesheetInSameFolder(importSource)) {
                        // ./myImage.svg
                        context.report({
                            node,
                            message: `CSS Modules should be associated to one component and located in the same folder ./${validCssFilename}. If the module is already used by another component, create a new one.`
                        });
                    } else {
                        const validCssPath = `.${sep}${validCssFilename}`;
                        const isNamingValid = importSource === validCssPath;
                        if (!isNamingValid) {
                            context.report({
                                node,
                                message: `CSS Modules should be associated to one component and should be named ./${validCssFilename}. If the module is already used by another component, create a new one.`
                            });
                        }
                    }
                }
            }
        };
    }
};

export { rule as strictCssModulesNamesRule };
