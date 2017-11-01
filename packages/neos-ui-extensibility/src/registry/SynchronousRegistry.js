import AbstractRegistry from './AbstractRegistry';
import positionalArraySorter from '@neos-project/positional-array-sorter';

export default class SynchronousRegistry extends AbstractRegistry {
    constructor(description) {
        super(description);

        this._registry = [];
    }

    /*
     * Sets a key in a registry to the given value
     *
     * @param string key Registry key to set. May contain slashes to delimit nested keys, e.g. "nested/key".
     * @param Object value A value to set.
     * @param string|number position A position inside a registry that the given element should get, supports full positionalArraySorter syntax. Defaults to 0.
     * @return returns the value element.
     */
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
        const indexOfItemWithTheSameKey = this._registry.findIndex(item => item.key === key);
        if (indexOfItemWithTheSameKey === -1) {
            this._registry.push(entry);
        } else {
            this._registry[indexOfItemWithTheSameKey] = entry;
        }

        return value;
    }

    /*
     * Gets a registry value at a certain key
     *
     * @param string key
     * @return Object value
     */
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

    /*
     * Gets all values starting with a certain key, as an Object
     *
     * @param string searchKey to match, e.g. `test` would match `test/abc` and `test/abc2`, but not `test` itself
     * @return Object Result Object
     */
    getChildrenAsObject(searchKey) {
        const result = {};
        this._getChildrenWrapped(searchKey).forEach(item => {
            result[item.key] = item.value;
        });
        return result;
    }

    /*
     * Gets all values starting with a certain key, as a list
     *
     * @param string searchKey to match, e.g. `test` would match `test/abc` and `test/abc2`, but not `test` itself
     * @return array
     */
    getChildren(searchKey) {
        return this._getChildrenWrapped(searchKey).map(item => item.value);
    }

    /*
     * Checks if a certain key exists in the registry
     *
     * @param string key
     * @return true|undefined
     */
    has(key) {
        if (typeof key !== 'string') {
            throw new Error('Key must be a string');
        }
        return this._registry.find(item => item.key === key) && true;
    }

    _getAllWrapped() {
        return positionalArraySorter(this._registry);
    }

    /*
     * Gets all values, as an object
     *
     * @return Object Result object
     */
    getAllAsObject() {
        const result = {};
        this._getAllWrapped().forEach(item => {
            result[item.key] = item.value;
        });
        return result;
    }

    /*
     * Gets all values, as a list, with id property on each object set to its key
     *
     * @return array Result list
     */
    getAllAsList() {
        return this._getAllWrapped().map(item => Object.assign({id: item.key}, item.value));
    }
}
