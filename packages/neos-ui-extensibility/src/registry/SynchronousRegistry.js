import AbstractRegistry from './AbstractRegistry';

export default class SynchronousRegistry extends AbstractRegistry {
    constructor(description) {
        super(description);

        // internal registry, containing the keys as object keys, and the values being the values in the registry.
        this._registry = {};
        this._keys = [];
    }

    add(key, value) {
        // TODO: implement position in registry!
        // TODO: "key" must be string!
        this._registry[key] = value;
        this._keys.push(key);

        return this._registry[key];
    }

    get(key) {
        // TODO: "key" must be string!
        return this._registry[key];
    }

    has(key) {
        // TODO: "key" must be string!
        return {}.hasOwnProperty.call(this._registry, key);
    }

    getAllAsObject() {
        return Object.assign({}, this._registry);
    }

    getAllAsList() {
        return Object.keys(this._registry).map(key => Object.assign({id: key}, this._registry[key]));
    }
}
