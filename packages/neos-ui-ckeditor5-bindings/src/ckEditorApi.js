import debounce from 'lodash.debounce';
import DecoupledEditor from '@ckeditor/ckeditor5-editor-decoupled/src/decouplededitor';
import {actions} from '@neos-project/neos-ui-redux-store';
import {cleanupContentBeforeCommit} from './cleanupContentBeforeCommit'
import './placeholder.vanilla-css';

let currentEditor = null;
let editorConfig = {};

// We cache the "formattingUnderCursor"; to only emit events when it really changed.
// As there is only a single cursor active at any given time, it is safe to do this caching here inside the singleton object.
let lastFormattingUnderCursorSerialized = '';

// We get the state of all commands from CKE5 and serialize it into "formattingUnderCursor"
const handleUserInteractionCallback = () => {
    if (!currentEditor) {
        return;
    }
    const formattingUnderCursor = {};
    [...currentEditor.commands].forEach(commandTuple => {
        const [commandName, command] = commandTuple;
        if (command.value !== undefined) {
            formattingUnderCursor[commandName] = command.value;
        }
    });

    const formattingUnderCursorSerialized = JSON.stringify(formattingUnderCursor);
    if (formattingUnderCursorSerialized !== lastFormattingUnderCursorSerialized) {
        editorConfig.setFormattingUnderCursor(formattingUnderCursor);
        lastFormattingUnderCursorSerialized = formattingUnderCursorSerialized;
    }
};

export const bootstrap = _editorConfig => {
    editorConfig = _editorConfig;
};

export const createEditor = store => async options => {
    const {propertyDomNode, propertyName, editorOptions, globalRegistry, userPreferences, onChange} = options;

    const clonedTemporaryPropertyDomNode = propertyDomNode.cloneNode(true);

    const ckEditorConfig = editorConfig.configRegistry.getCkeditorConfig({
        editorOptions,
        userPreferences,
        globalRegistry,
        propertyDomNode
    });

    const initialData = propertyDomNode.innerHTML;

    class NeosEditor extends DecoupledEditor {
        constructor(...args) {
            super(...args);
            // We attach all options for this editor to the editor DOM node, so it would be easier to access them from CKE plugins
            // this has to be done after / in the constructor as `create` is async and plugins accessing .neos have to account for this
            // https://github.com/neos/neos-ui/issues/3223
            this.neos = options;
        }
    }

    return NeosEditor
        .create(clonedTemporaryPropertyDomNode, {...ckEditorConfig, initialData})
        .then(editor => {
            const debouncedOnChange = debounce(() => onChange(cleanupContentBeforeCommit(editor.getData())), 1500, {maxWait: 5000});

            const firstUpcastedData = cleanupContentBeforeCommit(editor.getData());
            const hasMarkupDerivation = firstUpcastedData !== initialData;

            if (!hasMarkupDerivation) {
                propertyDomNode.replaceWith(clonedTemporaryPropertyDomNode)
                clonedTemporaryPropertyDomNode.dataset.neosInlineEditorIsInitialized = true
            } else {
                const openMarkupDerivationDialogOnClickInText = () => {
                    let cleanupSubscription = null;
                    const waitForConfirmation = () => {
                        const {acknowledgement} = store.getState().ui.inlineEditorMarkupDerivationDialog;
                        switch (acknowledgement) {
                            case 'CONFIRMED':
                                cleanupSubscription?.()
                                propertyDomNode.removeEventListener('click', openMarkupDerivationDialogOnClickInText)

                                debouncedOnChange()
                                propertyDomNode.replaceWith(clonedTemporaryPropertyDomNode)
                                clonedTemporaryPropertyDomNode.dataset.neosInlineEditorIsInitialized = true

                                editor.editing.view.focus();
                                break;
                            case 'CANCELED':
                                cleanupSubscription?.()
                                break;
                        }
                    };
                    cleanupSubscription = store.subscribe(waitForConfirmation)
                    store.dispatch(actions.UI.InlineEditorMarkupDerivationDialog.open())
                    console.warn('ckeditor formatting derivation', initialData, firstUpcastedData)
                };

                propertyDomNode.dataset.neosInlineEditorMarkupDerivation = true
                propertyDomNode.addEventListener('click', openMarkupDerivationDialogOnClickInText)
            }

            editor.model.document.on('change:data', debouncedOnChange);
            editor.ui.focusTracker.on('change:isFocused', event => {
                if (!event.source.isFocused) {
                    // when another editor is focused commit all possible pending changes
                    debouncedOnChange.flush();
                    return
                }

                currentEditor = editor;
                editorConfig.setCurrentlyEditedPropertyName(propertyName);
                handleUserInteractionCallback();
            });

            editor.keystrokes.set('Ctrl+K', (_, cancel) => {
                store.dispatch(actions.UI.ContentCanvas.toggleLinkEditor());
                cancel();
            });

            editor.model.document.on('change', () => handleUserInteractionCallback());
            return editor;
        }).catch(e => {
            if (e instanceof TypeError && e.message.match(/Class constructor .* cannot be invoked without 'new'/)) {
                console.error('Neos.Ui: Youre probably using a CKeditor plugin which needs to be rebuild.\nsee https://github.com/neos/neos-ui/issues/3287\n\nOriginal Error:\n\n' + e.stack);
            } else {
                console.error(e);
            }
        });
};

export const executeCommand = (command, argument, reFocusEditor = true) => {
    currentEditor.execute(command, argument);
    if (reFocusEditor) {
        currentEditor.editing.view.focus();
    }
};
