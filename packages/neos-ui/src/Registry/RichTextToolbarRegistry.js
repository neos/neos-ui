import {SynchronousRegistry} from '@neos-project/neos-ui-extensibility/src/registry';

export default class RichTextToolbarRegistry extends SynchronousRegistry {
    constructor(...args) {
        super(...args);

        this.TRISTATE_DISABLED = 0;
        this.TRISTATE_ON = 1;
        this.TRISTATE_OFF = 2;
    }
}
