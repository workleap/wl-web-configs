---
order: 60
label: Integrate with VS Code
meta:
    title: Integrate with VS Code - ESLint
---

# Integrate with VS Code

[Stylelint VS Code extension](https://marketplace.visualstudio.com/items?itemName=stylelint.vscode-stylelint) greatly improves the development experience by **automatically linting** the code as you type and **automatically formatting** the code according to your Stylelint configuration whenever you save.

## Install Stylelint extension

Open VS Code and install the [stylelint.vscode-stylelint](https://marketplace.visualstudio.com/items?stylelint.vscode-stylelint.vscode-eslint) extension.

## Configure VS Code

Then, add the following settings to your solution [VS Code settings file](https://code.visualstudio.com/docs/getstarted/settings):

```json ./vscode/settings.json
{
    "editor.codeActionsOnSave": {
        "source.fixAll": "explicit", // Makes sure Stylelint is run on save
    },
    "editor.formatOnSave": true,
    "css.validate": false, // Disables the default formatter to use Stylelint instead
    "scss.validate": false // Disables the default formatter to use Stylelint instead
}
```

## Install EditorConfig extension

Finally, install the [EditorConfig.EditorConfig](https://marketplace.visualstudio.com/items?itemName=EditorConfig.EditorConfig) extension.

## Try it :rocket:

Restart VS Code, open a CSS file, type invalid code in a CSS selector (e.g. `color: #fff`), then save. The code should have been formatted automatically (e.g. `color: #ffffff`).
