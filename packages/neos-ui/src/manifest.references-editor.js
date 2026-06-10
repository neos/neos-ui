import manifest from '@neos-project/neos-ui-extensibility';

import {registerReferenceInspectorEditor} from '@neos-project/neos-ui-references-editor';

manifest('references-editor', {}, (globalRegistry) => {
    registerReferenceInspectorEditor(globalRegistry);
});
