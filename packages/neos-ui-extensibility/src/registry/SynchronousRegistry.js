import AbstractRegistry from './AbstractRegistry';
import {positionalArraySorter} from '@neos-project/utils-helpers'

export default class SortedSynchronousRegistry extends AbstractRegistry {
    constructor(description) {
        super(description);

        this._registry = [];
    }

    set(key, value, position = 0) {
        if (typeof key !== 'string') {
            throw new Error('Key must be a string');
        }
        if (typeof position !== 'string' && typeof position !== 'number') {
            throw new Error('Position must be a string or a number');
        }
        const entry = {key, value};
        if (position) {
            entry.position = position;
        }
        this._registry.push(entry);

        return value;
    }

    get(key) {
        if (typeof key !== 'string') {
            throw new Error('Key must be a string');
        }
        const result = this._registry.find(item => item.key === key);
        return result ? result.value : false;
    }

    _getChildrenWrapped(searchKey) {
        const unsortedChildren = this._registry.filter(item => item.key.indexOf(searchKey + '/') === 0);
        return positionalArraySorter(unsortedChildren);
    }

    getChildrenAsObject(searchKey) {
        const result = {};
        this._getChildrenWrapped(searchKey).forEach(item => {
            result[item.key] = item.value;
        });
        return result;
    }

    getChildren(searchKey) {
        return this._getChildrenWrapped(searchKey).map(item => item.value);
    }

    has(key) {
        if (typeof key !== 'string') {
            throw new Error('Key must be a string');
        }
        return this._registry.find(item => item.key === key) && true;
    }

    _getAllWrapped() {
        return positionalArraySorter(this._registry);
    }

    getAllAsObject() {
        const result = {};
        this._getAllWrapped().forEach(item => {
            result[item.key] = item.value;
        });
        return result;
    }

    getAllAsList() {
        return this._getAllWrapped().map(item => Object.assign({id: item.key}, item.value));
    }
}
