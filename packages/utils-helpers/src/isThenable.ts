//
// Determines whether a value is a thenable
//
export default function isThenable(maybeThenable : any) : boolean {
    if (typeof maybeThenable !== 'object') {
        return false;
    }

    if (typeof maybeThenable.then !== 'function') {
        return false;
    }

    return true;
}
