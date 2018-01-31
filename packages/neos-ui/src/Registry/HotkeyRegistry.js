import {SynchronousRegistry} from '@neos-project/neos-ui-extensibility/src/registry';
import Mousetrap from 'mousetrap';

export default class HotkeyRegistry extends SynchronousRegistry {

    /*
     * Sets a key in a registry to the given value and bind keyboard event
     *
     * @param string key Registry key to set. May contain slashes to delimit nested keys, e.g. "nested/key".
     * @param Object value A value to set.
     * @param string|number position A position inside a registry that the given element should get, supports full positionalArraySorter syntax. Defaults to 0.
     * @return returns the value element.
     */
    set(key, value, position = 0) {
        value = super.set(key, value, position);

        Mousetrap.bind(value.defaultKey, value.callback);

        return value;
    }

    unset(key) {
        const value = this.get(key);
        Moustrap.unbind(value.defaultKey);
    }
}
