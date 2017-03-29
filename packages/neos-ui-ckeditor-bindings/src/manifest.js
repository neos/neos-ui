import manifest from '@neos-project/neos-ui-extensibility';
import {SynchronousMetaRegistry} from '@neos-project/neos-ui-extensibility/src/registry';

import EditorToolbar from './EditorToolbar';

import createCkEditor from './createCkEditor';
import boostrapCkEditorApi from './boostrapCkEditorApi';

import initializeFormattingRulesRegistry from './manifest.formattingRules';
import initializeRichtextToolbarRegistry from './manifest.richtextToolbar';

manifest('@neos-project/neos-ui-ckeditor-bindings', {}, globalRegistry => {
    const ckEditorRegistry = globalRegistry.add(
        'ckEditor',
        new SynchronousMetaRegistry(`
            # Registries for CK Editor

            - formattingRules for connecting with the toolbar
        `)
    );

    const formattingRulesRegistry = initializeFormattingRulesRegistry(ckEditorRegistry);
    initializeRichtextToolbarRegistry(ckEditorRegistry, globalRegistry.get('@neos-project/neos-ui-contentrepository'));

    //
    // Add CK Editor to the list of inline editors
    //
    const inlineEditorRegistry = globalRegistry.get('inlineEditors');
    inlineEditorRegistry.add('ckeditor', {
        bootstrap: boostrapCkEditorApi(formattingRulesRegistry),
        createInlineEditor: createCkEditor,
        ToolbarComponent: EditorToolbar
    });
});
