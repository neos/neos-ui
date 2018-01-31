import {SynchronousRegistry} from '@neos-project/neos-ui-extensibility/src/registry';
import Mousetrap from 'mousetrap';


export default class HotkeyRegistry extends SynchronousRegistry {
    constructor() {
        super();
        this.activeInGuest = true;
    }

    setActiveInGuest(value) {
        this.activeInGuest = value;
    }

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
        Mousetrap.unbind(value.defaultKey);
        if (this.mousetrapGuest) {
            this.mousetrapGuest.unbind(value.defaultKey);
        }
    }

    bindAll(el) {
        const items = this.getAllAsList();
        this.mousetrapGuest = new Mousetrap(el);

        for (let i=0; i<items.length; i++) {
            let callback = items[i].callback;
            this.mousetrapGuest.bind(items[i].defaultKey, () => {
                if (this.activeInGuest) {
                    callback();
                }
            });
        }
    }
}
