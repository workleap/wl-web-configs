---
order: 70
label: Integrate with VS Code
meta:
    title: Integrate with VS Code - ESLint
---

# Integrate with VS Code

[ESLint VS Code extension](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) greatly improve the development experience by **automatically linting** the code as you type and **automatically formatting** the code according to your ESLint configuration whenever you save.

## Install ESLint extension

Open VS Code and install the [dbaeumer.vscode-eslint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) extension.

## Configure VS Code

Then, add the following settings to your solution [VS Code settings file](https://code.visualstudio.com/docs/getstarted/settings):

```json ./vscode/settings.json
{
    "editor.codeActionsOnSave": {
        "source.fixAll": "explicit", // Makes sure ESLint is run on save
        "source.sortImports": "explicit" // Let VS Code handle import sorting, it's snappier and more reliable than ESLint
    },
    "editor.formatOnSave": true,
    "typescript.format.enable": false, // Disables the default formatter to use ESLint instead
    "javascript.format.enable": false, // Disables the default formatter to use ESLint instead
    "json.format.enable": false, // Disables the default formatter to use ESLint instead
    "eslint.probe": [ // Enables YAML files formatting.
        "javascript",
        "javascriptreact",
        "typescript",
        "typescriptreact",
        "json",
        "jsonc",
        "yaml"
    ]
```

## Install EditorConfig extension

Finally, install the [EditorConfig.EditorConfig](https://marketplace.visualstudio.com/items?itemName=EditorConfig.EditorConfig) extension.

## Try it :rocket:

Restart VS Code, open a JavaScript file, type invalid code (e.g. `var x = 0;`), then save. The code should have been formatted automatically (e.g. `const x = 0;`).


