//
// Checks if the given item is empty
//
export default function isEmpty(item: any): boolean {
    if (item == null) {
        return true;
    }

    if (typeof item === 'number' || typeof item === 'boolean') {
        return false;
    }

    if (Array.isArray(item) || typeof item === 'string') {
        return item.length === 0;
    }

    for (const key in item) {
        if (item.hasOwnProperty(key)) {
            return false;
        }
    }

    return true;
}
