import Immutable from 'immutable';

function resolvePath(path) {
    if (typeof path === 'string') {
        return path.split('.');
    }

    return path;
}

export function $immutable(value) {
    return Immutable.fromJS(value);
}

export function $get(realm, path) {
    const result = resolvePath(path).reduce((prev, cur) => prev.get(cur), realm);

    if (typeof result === "object" && !result instanceof Immutable.Iterable) {
        console.warn(`object at path ${path} is not Immutable, but will be converted.`, result);
        return Immutable.fromJS(result);
    }

    return result;
}

export function $mapGet(realm, path) {
    return realm.map(r => $get(r, path));
}

export function $set(realm, path, value) {
    return realm.setIn(resolvePath(path), Immutable.fromJS(value));
}

export function $updateIn(realm, path, updater) {
    return realm.updateIn(resolvePath(path), updater);
}

export function $merge(realm, path, value) {
    return realm.mergeIn(resolvePath(path), Immutable.fromJS(value));
}

export function $mergeDeep(realm, path, value) {
    return realm.mergeDeepIn(resolvePath(path), Immutable.fromJS(value));
}

export function $delete(realm, path) {
    return realm.deleteIn(resolvePath(path));
}
