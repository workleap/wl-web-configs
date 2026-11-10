export function isBoolean(value: unknown): value is boolean {
    return typeof value === "boolean";
}

// oxlint-disable-next-line typescript/no-explicit-any
export function isFunction(value: unknown): value is (...args: any[]) => unknown {
    return typeof value === "function";
}
