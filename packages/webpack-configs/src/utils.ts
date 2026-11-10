// oxlint-disable-next-line typescript/no-explicit-any
export function isObject(value: any): value is Record<string, unknown> {
    return typeof value === "object" && !Array.isArray(value) && value != null;
}

// oxlint-disable-next-line typescript/no-explicit-any
export function isNull(value: any): value is null {
    return value == null;
}

// oxlint-disable-next-line typescript/no-explicit-any
export function isUndefined(value: any): value is undefined {
    return typeof value === "undefined" || value === undefined;
}

// oxlint-disable-next-line typescript/no-explicit-any
export function isNil(value: any): value is null | undefined {
    return isNull(value) || isUndefined(value);
}
