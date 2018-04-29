import {SynchronousRegistry} from '@neos-project/neos-ui-extensibility/src/registry';

export default class HotkeyRegistry extends SynchronousRegistry {
    constructor(hotkeyConfiguration, ...args) {
        super(...args);
        this._hotkeyConfiguration = hotkeyConfiguration ? hotkeyConfiguration : {};
    }

    /*
     * Sets a key in a registry to the given value and replaces "keys" value according to frontendConfiguration
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
        if (this._hotkeyConfiguration[key] && typeof this._hotkeyConfiguration[key] === 'string') {
            value.keys = this._hotkeyConfiguration[key];
            return super.set(key, value, position);
        }
    }
}
