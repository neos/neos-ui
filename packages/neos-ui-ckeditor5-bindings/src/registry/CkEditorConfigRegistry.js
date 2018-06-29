import {SynchronousRegistry} from '@neos-project/neos-ui-extensibility/src/registry';

export default class CkEditorConfigRegistry extends SynchronousRegistry {
    getCkeditorConfig(additionalInformation) {
        return this._registry.map(i => i.value).reduce((acc, value) => value(acc, additionalInformation), {});
    }
}
