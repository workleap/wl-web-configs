# @workleap/browserslist-config

Shareable [browserslist](https://github.com/browserslist/browserslist) configuration for Workleap.

[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](../../LICENSE)
[![npm version](https://img.shields.io/npm/v/@workleap/browserslist-config)](https://www.npmjs.com/package/@workleap/browserslist-config)

## Installation

Install the package.

**With pnpm**

```shell
pnpm add -D @workleap/browserslist-config
```

**With yarn**

```shell
yarn add -D @workleap/browserslist-config
```

**With npm**

```shell
npm install -D @workleap/browserslist-config
```

## Supported Browsers

You can list all supported browsers by following this link:
https://browsersl.ist/#q=%3E+0.2%25%2C+last+2+versions%2C+Firefox+ESR%2C+not+dead

## Usage

Create a `.browserslistrc` file at the root of your project with the following content:
```
extends @workleap/browserslist-config
```

## Maintainers notes

### CJS support

To support CJS projects, this package is build for ESM and CJS formats. To support CJS, `type: "module"` has been temporary removed from the `package.json` file.

Once browserslist and all third parties using browserslist supports ESM, CJS support can be removed.

## License

Copyright © 2023, GSoft inc. This code is licensed under the Apache License, Version 2.0. You may obtain a copy of this license at https://github.com/gsoft-inc/gsoft-license/blob/master/LICENSE.
