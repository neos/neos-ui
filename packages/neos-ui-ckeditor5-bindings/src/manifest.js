import manifest from '@neos-project/neos-ui-extensibility';

import InlineEditorToolbar from './EditorToolbar';
import {bootstrap, createEditor} from './ckEditorApi';
import {SynchronousMetaRegistry} from '@neos-project/neos-ui-extensibility/src/registry';

import initializeRichtextToolbarRegistry from './manifest.richtextToolbar';
import initializeConfigRegistry from './manifest.config';

manifest('@neos-project/neos-ui-ckeditor5-bindings', {}, globalRegistry => {
    const ckEditorRegistry = globalRegistry.set(
        'ckEditor5',
        new SynchronousMetaRegistry(`
            # Registries for CK Editor 5

            We provide a very slim configuration API over CKE5:
            - manifest.config.js: configuration registry
            - manifest.richtextToolbar.js: registry for our custom toolbar

            See their manifest files for more details
        `)
    );
    const richtextToolbarRegistry = initializeRichtextToolbarRegistry(ckEditorRegistry);
    const configRegistry = initializeConfigRegistry(ckEditorRegistry);

    const inlineEditorRegistry = globalRegistry.get('inlineEditors');
    inlineEditorRegistry.set('ckeditor5', {
        bootstrap: ({setFormattingUnderCursor, setCurrentlyEditedPropertyName}) => bootstrap({
            setFormattingUnderCursor,
            setCurrentlyEditedPropertyName,
            toolbarItems: richtextToolbarRegistry.getAllAsList(),
            configRegistry
        }),
        createInlineEditor: createEditor,
        ToolbarComponent: InlineEditorToolbar
    });
});
