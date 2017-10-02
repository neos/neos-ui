import AbstractRegistry from './AbstractRegistry';

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

    getChildren(searchKey) {
        return this._registry.filter(item => item.key.indexOf(searchKey + '/') === 0).map(item => item.value);
    }

    has(key) {
        if (typeof key !== 'string') {
            throw new Error('Key must be a string');
        }
        return this._registry.find(item => item.key === key) && true;
    }

    getAllAsObject() {
        const result = {};
        this._registry.forEach(item => {
            result[item.key] = item.value;
        });
        return result;
    }

    getAllAsList() {
        return this._registry.map(item => item.value);
    }
}
