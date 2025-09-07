import manifest from '@neos-project/neos-ui-extensibility';

import {registerLinkTypes, registerDialog, createEditor} from '@neos-project/neos-ui-link-editor-core';
import {registerInspectorEditors} from '@neos-project/neos-ui-link-editor-inspector-editor';
import {registerLinkButton} from '@neos-project/neos-ui-link-editor-link-button';

manifest('link-editor', {}, (globalRegistry, {store, configuration, routes}) => {
    const editor = createEditor();
    const neosContextProperties = {globalRegistry, store, configuration, routes};

    registerLinkTypes(globalRegistry);
    registerDialog(neosContextProperties, editor);
    registerInspectorEditors(neosContextProperties, editor);
    registerLinkButton(neosContextProperties, editor);
});
