export function isBoolean(value: unknown): value is boolean {
    return typeof value === "boolean";
}

// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
export function isFunction(value: unknown): value is Function {
    return typeof value === "function";
}
