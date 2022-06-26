export function nullToUndefined<T>(type: T | null): T | undefined {
    if  (type === null) return
    return type
}