import type { Linter } from "eslint";

// Copied from: https://github.com/eslint/rewrite/blob/main/packages/config-helpers/src/types.ts
/**
 * Infinite array type.
 */
export type InfiniteArray<T> = T | InfiniteArray<T>[];

// Copied from: https://github.com/eslint/rewrite/blob/main/packages/config-helpers/src/types.ts
/**
 * The type of array element in the `extends` property after flattening.
 */
export type SimpleExtendsElement = string | Linter.Config;

// Copied from: https://github.com/eslint/rewrite/blob/main/packages/config-helpers/src/types.ts
/**
 * The type of array element in the `extends` property before flattening.
 */
export type ExtendsElement = SimpleExtendsElement | InfiniteArray<Linter.Config>;

// Copied from: https://github.com/eslint/rewrite/blob/main/packages/config-helpers/src/types.ts
/**
 * Config with extends. Valid only inside of `defineConfig()`.
 */
export interface ConfigWithExtends extends Linter.Config {
    extends?: ExtendsElement[];
}

/**
 * ESLint configuration array type with extends support
 */
export type ESLintConfigArray = ConfigWithExtends[];
