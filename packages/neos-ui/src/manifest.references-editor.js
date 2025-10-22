import manifest from '@neos-project/neos-ui-extensibility';

import {registerDialog, createEditor, registerReferenceInspectorEditor} from '@neos-project/neos-ui-references-editor';

manifest('references-editor', {}, (globalRegistry) => {
    const editor = createEditor();

    registerDialog(globalRegistry, editor);
    registerReferenceInspectorEditor(globalRegistry, editor);
});
