import {SynchronousRegistry} from '@neos-project/neos-ui-extensibility/src/registry';

export default class CkEditorPluginsRegistry extends SynchronousRegistry {
    getExtraPluginsString() {
        return this._registry.map(i => i.key).join(',');
    }
}
