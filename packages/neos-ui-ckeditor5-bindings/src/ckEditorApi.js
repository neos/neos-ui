import debounce from 'lodash.debounce';
import {getGuestFrameElement, getGuestFrameDocument, getGuestFrameWindow} from '@neos-project/neos-ui-guest-frame/src/dom';
import {isDraggingNode} from '@neos-project/neos-ui-guest-frame/src/InlineUI/DragAndDropUi';
import {DecoupledEditor} from '@ckeditor/ckeditor5-editor-decoupled';
import {Template, BodyCollection} from '@ckeditor/ckeditor5-ui';
import {createElement} from '@ckeditor/ckeditor5-utils';

import {cleanupContentBeforeCommit} from './cleanupContentBeforeCommit'

import '@ckeditor/ckeditor5-theme-lark/dist/index.css';
import '@ckeditor/ckeditor5-clipboard/dist/index.css';
import '@ckeditor/ckeditor5-core/dist/index.css';
import '@ckeditor/ckeditor5-engine/dist/index.css';
import '@ckeditor/ckeditor5-enter/dist/index.css';
import '@ckeditor/ckeditor5-paragraph/dist/index.css';
import '@ckeditor/ckeditor5-select-all/dist/index.css';
import '@ckeditor/ckeditor5-style/dist/index.css';
import '@ckeditor/ckeditor5-table/dist/index.css';
import '@ckeditor/ckeditor5-typing/dist/index.css';
import '@ckeditor/ckeditor5-ui/dist/index.css';
import '@ckeditor/ckeditor5-undo/dist/index.css';
import '@ckeditor/ckeditor5-upload/dist/index.css';
import '@ckeditor/ckeditor5-utils/dist/index.css';
import '@ckeditor/ckeditor5-watchdog/dist/index.css';
import '@ckeditor/ckeditor5-widget/dist/index.css';

import './cke-overwrites.vanilla-css';

// We need to detect if the browser supports CSS anchor positioning.
// If not, we need to manually position the toolbars on scroll/resize.
// This fallback should be removed once all supported browsers have CSS anchor support.
// See https://caniuse.com/css-anchor-position
const supportsCSSAnchors = 'anchorName' in document.documentElement.style;

let currentEditor = null;
let currentPropertyDomNode = null;
let editorConfig = {};
let resizeObserver = null;

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

// Helper function to update toolbar position when CSS anchors are not supported
const updateToolbarPosition = () => {
    if (!currentEditor || !currentPropertyDomNode || supportsCSSAnchors) {
        return;
    }

    const toolbar = currentEditor.ui.view.toolbar.element;
    // Only reposition if toolbar is visible
    if (!toolbar.classList.contains('neos-ck-anchored-toolbar--visible')) {
        return;
    }

    const guestFrameWindow = getGuestFrameWindow();
    toolbar.style.left = (currentPropertyDomNode.getBoundingClientRect().left + guestFrameWindow.scrollX) + 'px';
    toolbar.style.top = (currentPropertyDomNode.getBoundingClientRect().top - toolbar.offsetHeight + guestFrameWindow.scrollY) + 'px';
};

export const bootstrap = _editorConfig => {
    editorConfig = _editorConfig;
};

/**
 * A custom BodyCollection implementation that attaches to the DOM of the guest frame.
 * This is necessary because the editor runs in a separate iframe and needs to manage its own body.
 * The editor doesn't allow a custom position for the collection currently. See https://github.com/ckeditor/ckeditor5/issues/5319
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

        const guestFrame = getGuestFrameElement();
        if (!guestFrame) {
            return;
        }

        const guestFrameDocument = getGuestFrameDocument();
        if (!guestFrameDocument || guestFrameDocument.readyState === 'loading') {
            // When we navigate to other documents we need to reattach the body collection after the guest frame is loaded.
            guestFrame.addEventListener('load', () => this.attachToDom(), {once: true});
            return;
        }

        // Create a shared wrapper if there were none or the previous one got disconnected from DOM
        // This wrapper is stored as a static property to ensure it is reused across instances.
        if (!GuestFrameBodyCollection._bodyWrapper || !GuestFrameBodyCollection._bodyWrapper.isConnected ||
            GuestFrameBodyCollection._bodyWrapper.ownerDocument !== guestFrameDocument) {
            GuestFrameBodyCollection._bodyWrapper = createElement(
                guestFrameDocument,
                'div',
                {class: 'ck-body-wrapper'}
            );
            guestFrameDocument.body.appendChild(GuestFrameBodyCollection._bodyWrapper);
        }

        GuestFrameBodyCollection._bodyWrapper.appendChild(this._bodyCollectionContainer);
    }
}

export const createEditor = () => async options => {
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

            if (!supportsCSSAnchors) {
                // Set up ResizeObserver to update toolbar position on window resize
                if (resizeObserver) {
                    return;
                }
                resizeObserver = new ResizeObserver(() => {
                    updateToolbarPosition();
                });
                resizeObserver.observe(getGuestFrameDocument().documentElement);
            }
        }
    }

    return NeosEditor
        .create(propertyDomNode, ckEditorConfig)
        .then(editor => {
            const debouncedOnChange = debounce(() => onChange(cleanupContentBeforeCommit(editor.getData())), 1500, {maxWait: 5000});
            editor.model.document.on('change:data', debouncedOnChange);
            editor.ui.focusTracker.on('change:isFocused', (event, name, isFocused) => {
                // Ignore event if we are currently dragging content
                if (isDraggingNode()) {
                    event.stop();
                    return;
                }

                if (!isFocused) {
                    // Double-check that the editor is still not focused
                    if (editor.ui.focusTracker.isFocused) {
                        return;
                    }

                    // Check if focus moved to a CKEditor UI element (like the toolbar) or refocused the window.
                    // If so, we should not treat this as leaving the editor
                    const {activeElement} = getGuestFrameDocument();
                    const isWithinEditor =
                        activeElement === editor.sourceElement ||
                        editor.ui.view.toolbar.element.contains(activeElement);
                    if (isWithinEditor) {
                        return;
                    }

                    // when another editor is focused commit all possible pending changes
                    debouncedOnChange.flush();
                    editor.ui.view.toolbar.element.classList.remove('neos-ck-anchored-toolbar--visible');
                    return;
                }

                currentEditor = editor;
                currentPropertyDomNode = propertyDomNode;

                if (editor.ui.view.toolbar.items.length > 0) {
                    editor.ui.view.toolbar.element.classList.add('neos-ck-anchored-toolbar--visible');
                    if (!supportsCSSAnchors) {
                        updateToolbarPosition();
                    }
                }

                editorConfig.setCurrentlyEditedPropertyName(propertyName);
                handleUserInteractionCallback();
            }, {priority: 'highest'});

            editor.model.document.on('change', () => handleUserInteractionCallback());

            // As we use the DecoupledEditor, we need to manually add the toolbar to the Neos backend container, so it is visible in the UI
            editor.ui.view.body.bodyCollectionContainer.appendChild(editor.ui.view.toolbar.element)

            // Anchor the toolbar to the dom-node representing the edited property
            editor.ui.view.toolbar.element.style.positionAnchor = propertyDomNode.dataset.neosInlineEditorAnchorName;
            editor.ui.view.toolbar.element.classList.add('neos-ck-anchored-toolbar');

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
    currentEditor?.execute(command, argument);
    if (reFocusEditor) {
        currentEditor.editing.view.focus();
    }
};
