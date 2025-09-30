
/**
 * Copied from https://github.com/facebook/fbjs/blob/main/packages/fbjs/src/core/shallowEqual.js
 * @internal
 */
export function shallowEqual(objA: any, objB: any) {
    if (Object.is(objA, objB)) {
        return true
    }

    if (
        typeof objA !== 'object' ||
        objA === null ||
        typeof objB !== 'object' ||
        objB === null
    ) {
        return false
    }

    const keysA = Object.keys(objA)
    const keysB = Object.keys(objB)

    if (keysA.length !== keysB.length) return false

    for (let i = 0; i < keysA.length; i++) {
        if (
            !Object.prototype.hasOwnProperty.call(objB, keysA[i]) ||
            !Object.is(objA[keysA[i]], objB[keysA[i]])
        ) {
            return false
        }
    }

    return true
}
