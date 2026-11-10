---
"@workleap/stylelint-configs": major
---

Support Stylelint 18 and drop support for Stylelint 16.

- The `stylelint` peer dependency is now `^18.0.0`, and `stylelint-config-standard` is updated from `^39.0.1` to `^41.0.0`.
- Stylelint 18 requires Node.js `^22.22.2`, `^24.15.0` or `>=26.0.0`.
- The `declaration-block-single-line-max-declarations` rule was removed from the config because Stylelint 18 removed it. Prettier still puts each declaration on its own line.
- `stylelint-config-recommended` 19, which `stylelint-config-standard` 41 extends, adds the `at-charset-rule-no-invalid`, `selector-no-deprecated`, `selector-no-invalid`, `selector-no-unmatchable` and `value-no-invalid` rules. They report warnings, so projects that run Stylelint with `--max-warnings=0` may need to fix new problems.
- Stylelint 18 no longer resolves `extends` and `plugins` paths written without a file extension (e.g. `./my-config` instead of `./my-config.js`), nor packages installed in the global `node_modules` directory.
- If you call Stylelint from code, note that Stylelint 17 removed its CommonJS Node.js API. Running the CLI or extending the config isn't affected.

To upgrade, install `stylelint@^18.0.0` alongside the new version of `@workleap/stylelint-configs`, and remove `declaration-block-single-line-max-declarations` from your own `.stylelintrc.json` if you configured it there. See the [Stylelint 17](https://stylelint.io/migration-guide/to-17) and [Stylelint 18](https://stylelint.io/migration-guide/to-18) migration guides.
