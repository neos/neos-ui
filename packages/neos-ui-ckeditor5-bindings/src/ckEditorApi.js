import debounce from 'lodash.debounce';
import DecoupledEditor from '@ckeditor/ckeditor5-editor-decoupled/src/decouplededitor';
import {Template, BodyCollection} from '@ckeditor/ckeditor5-ui/src';
import {actions} from '@neos-project/neos-ui-redux-store';
import {cleanupContentBeforeCommit} from './cleanupContentBeforeCommit'
// FIXME import from @ckeditor/ckeditor5-engine/theme/placeholder.css instead! (Needs build setup configuration)
import './cke-overwrites.vanilla-css';
import './placeholder.vanilla-css';
import {createElement} from "@ckeditor/ckeditor5-utils";

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

/**
 * A custom BodyCollection implementation that attaches to the DOM of the guest frame.
 * This is necessary because the editor runs in a separate iframe and needs to manage its own body
 */
class GuestFrameBodyCollection extends BodyCollection {
    attachToDom() {
        this._bodyCollectionContainer = new Template({
            tag: 'div',
            attributes: {
                class: [
                    'ck',
                    'ck-reset_all',
                    'ck-body',
                    'ck-rounded-corners'
                ],
                dir: this.locale.uiLanguageDirection,
                role: 'application'
            },
            children: this
        }).render();

        // Get the current document instance each time
        const iframe = document.querySelector('[name="neos-content-main"]');
        const documentForWrapper = iframe?.contentDocument || iframe?.contentWindow?.document;

        // Ensure we have a valid document and it's loaded
        if (!documentForWrapper || documentForWrapper.readyState === 'loading') {
            // Wait for document to be ready if it's still loading
            iframe.addEventListener('load', () => this.attachToDom(), {once: true});
            return;
        }

        // Create a shared wrapper if there were none or the previous one got disconnected from DOM
        if (!BodyCollection._bodyWrapper || !BodyCollection._bodyWrapper.isConnected ||
            BodyCollection._bodyWrapper.ownerDocument !== documentForWrapper) {
            BodyCollection._bodyWrapper = createElement(documentForWrapper, 'div', {class: 'ck-body-wrapper'});
            documentForWrapper.body.appendChild(BodyCollection._bodyWrapper);
        }

        BodyCollection._bodyWrapper.appendChild(this._bodyCollectionContainer);
    }
}

export const createEditor = store => async options => {
    const {propertyDomNode, propertyName, editorOptions, globalRegistry, userPreferences, onChange} = options;
    const ckEditorConfig = editorConfig.configRegistry.getCkeditorConfig({
        editorOptions,
        userPreferences,
        globalRegistry,
        propertyDomNode
    });

    class NeosEditor extends DecoupledEditor {
        constructor(...args) {
            super(...args);
            // We attach all options for this editor to the editor DOM node, so it would be easier to access them from CKE plugins
            // this has to be done after / in the constructor as `create` is async and plugins accessing .neos have to account for this
            // https://github.com/neos/neos-ui/issues/3223
            this.neos = options;
            // Use our own BodyCollection implementation that works within the guest frame
            // noinspection JSConstantReassignment
            this.ui.view.body = new GuestFrameBodyCollection(this.locale);
        }
    }

    return NeosEditor
        .create(propertyDomNode, ckEditorConfig)
        .then(editor => {
            const debouncedOnChange = debounce(() => onChange(cleanupContentBeforeCommit(editor.getData())), 1500, {maxWait: 5000});
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
