// Using "unknown" loses the typings.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isFunction(value: unknown): value is (...args: any[]) => any {
    return typeof value === "function";
}
