import manifest from '@neos-project/neos-ui-extensibility';

import {registerLinkTypes, registerDialog, createEditor} from '@neos-project/neos-ui-link-editor-core';
import {registerInspectorEditors} from '@neos-project/neos-ui-link-editor-inspector-editor';
import {registerLinkButton} from '@neos-project/neos-ui-link-editor-link-button';

manifest('link-editor', {}, (globalRegistry) => {
    const editor = createEditor();

    registerLinkTypes(globalRegistry);
    registerDialog(globalRegistry, editor);
    registerInspectorEditors(globalRegistry, editor);
    registerLinkButton(globalRegistry, editor);
});
