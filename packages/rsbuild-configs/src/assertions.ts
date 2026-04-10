export function isBoolean(value: unknown): value is boolean {
    return typeof value === "boolean";
}

export function isFunction(
    value: unknown,
): value is (...args: any[]) => unknown {
    return typeof value === "function";
}
