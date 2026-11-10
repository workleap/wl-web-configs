// Using "unknown" loses the typings.
// oxlint-disable-next-line typescript/no-explicit-any
export function isFunction(value: unknown): value is (...args: any[]) => any {
    return typeof value === "function";
}
