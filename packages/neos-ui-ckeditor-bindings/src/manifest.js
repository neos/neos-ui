import manifest from '@neos-project/neos-ui-extensibility';
import {SynchronousMetaRegistry} from '@neos-project/neos-ui-extensibility/src/registry';

import EditorToolbar from './EditorToolbar';

import createCkEditor from './createCkEditor';
import boostrapCkEditorApi from './boostrapCkEditorApi';

import initializeFormattingRulesRegistry from './manifest.formattingRules';
import initializeRichtextToolbarRegistry from './manifest.richtextToolbar';
import initializePluginsRegistry from './manifest.plugins';

manifest('@neos-project/neos-ui-ckeditor-bindings', {}, globalRegistry => {
    const ckEditorRegistry = globalRegistry.set(
        'ckEditor',
        new SynchronousMetaRegistry(`
            # Registries for CK Editor

            - formattingRules for connecting with the toolbar
        `)
    );

    const formattingRulesRegistry = initializeFormattingRulesRegistry(ckEditorRegistry);
    const pluginsRegistry = initializePluginsRegistry(ckEditorRegistry);
    initializeRichtextToolbarRegistry(ckEditorRegistry);

    //
    // Add CK Editor to the list of inline editors
    //
    const inlineEditorRegistry = globalRegistry.get('inlineEditors');
    inlineEditorRegistry.set('ckeditor', {
        bootstrap: boostrapCkEditorApi(formattingRulesRegistry, pluginsRegistry),
        createInlineEditor: createCkEditor,
        ToolbarComponent: EditorToolbar
    });
});
