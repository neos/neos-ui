import manifest from '@neos-project/neos-ui-extensibility';
import {SynchronousMetaRegistry} from '@neos-project/neos-ui-extensibility/src/registry';

import EditorToolbar from './EditorToolbar';

import initializeCkEditor from './initializeCkEditor';
import initializeCkEditorApi from './initializeCkEditorApi';
import getEnabledFormattingRulesFromEditorOptions from './getEnabledFormattingRulesFromEditorOptions';

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

    const formattingRules = initializeFormattingRulesRegistry(ckEditorRegistry);
    initializeRichtextToolbarRegistry(ckEditorRegistry, globalRegistry.get('@neos-project/neos-ui-contentrepository'));

    //
    // Add CK Editor to the list of inline editors
    //
    const inlineEditorRegistry = globalRegistry.get('inlineEditorRegistry');
    inlineEditorRegistry.add('ckeditor', {
        createInlineEditor: initializeCkEditor,
        initializeInlineEditorApi: initializeCkEditorApi(formattingRules),
        getEnabledFormattingRulesFromEditorOptions: getEnabledFormattingRulesFromEditorOptions(formattingRules),
        ToolbarComponent: EditorToolbar
    });
});
