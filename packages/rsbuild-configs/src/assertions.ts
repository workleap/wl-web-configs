export function isBoolean(value: unknown): value is boolean {
    return typeof value === "boolean";
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isFunction(value: unknown): value is (...args: any[]) => unknown {
    return typeof value === "function";
}
