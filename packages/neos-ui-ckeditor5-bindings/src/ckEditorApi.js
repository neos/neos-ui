import debounce from 'lodash.debounce';
import {getGuestFrameElement, getGuestFrameDocument, getGuestFrameWindow} from '@neos-project/neos-ui-guest-frame/src/dom';
import {isDraggingNode} from '@neos-project/neos-ui-guest-frame/src/InlineUI/DragAndDropUi';
import {DecoupledEditor} from '@ckeditor/ckeditor5-editor-decoupled';
import {Template, BodyCollection} from '@ckeditor/ckeditor5-ui';
import {createElement} from '@ckeditor/ckeditor5-utils';

import {cleanupContentBeforeCommit} from './cleanupContentBeforeCommit'

import '@ckeditor/ckeditor5-ui/dist/index.css';
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
let currentScrollTarget = null;

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

// Update toolbar position. For the non-anchor fallback this always runs;
// for CSS-anchor supported browsers it only kicks in when sticky is active,
// taking over from anchor positioning with explicit coordinates to keep the
// rendered position and hit-test area in sync (overriding anchor-driven
// positions via CSS class can desync them on some engines).
const updateToolbarPosition = () => {
    if (!currentEditor || !currentPropertyDomNode) {
        return;
    }

    const toolbar = currentEditor.ui.view.toolbar.element;
    if (!toolbar.classList.contains('neos-ck-anchored-toolbar--visible')) {
        return;
    }

    if (toolbar.classList.contains('neos-ck-anchored-toolbar--sticky')) {
        setStickyToolbarCoordinates(toolbar);
        return;
    }

    if (supportsCSSAnchors) {
        return;
    }

    const guestFrameWindow = getGuestFrameWindow();
    const propertyRect = currentPropertyDomNode.getBoundingClientRect();
    toolbar.style.left = (propertyRect.left + guestFrameWindow.scrollX) + 'px';
    toolbar.style.top = (propertyRect.top - toolbar.offsetHeight + guestFrameWindow.scrollY) + 'px';
};

// Computes sticky toolbar inline coordinates. Mimics the
// `--neos-ck-toolbar-align-right` fallback that anchor positioning would have
// applied when the toolbar would overflow the viewport's right edge: in that
// case right-align the toolbar to the property's right edge instead.
const setStickyToolbarCoordinates = toolbar => {
    if (!currentPropertyDomNode) {
        return;
    }
    const propertyRect = currentPropertyDomNode.getBoundingClientRect();
    const guestFrameWindow = getGuestFrameWindow();
    const viewportWidth = guestFrameWindow.innerWidth;

    if (propertyRect.left + toolbar.offsetWidth > viewportWidth) {
        toolbar.style.left = 'auto';
        toolbar.style.right = (viewportWidth - propertyRect.right) + 'px';
    } else {
        toolbar.style.left = propertyRect.left + 'px';
        toolbar.style.right = 'auto';
    }
    toolbar.style.top = '5px';
};

// Enables JS-driven sticky positioning, disabling CSS anchor positioning
// so the rendered position and hit-test area stay in sync.
const enableStickyPositioning = () => {
    const toolbar = currentEditor.ui.view.toolbar.element;
    toolbar.classList.add('neos-ck-anchored-toolbar--sticky');
    if (supportsCSSAnchors && currentPropertyDomNode) {
        toolbar.style.positionAnchor = '';
        toolbar.style.bottom = 'auto';
        setStickyToolbarCoordinates(toolbar);
    }
};

// Restores CSS anchor positioning after sticky was active.
// Accepts an explicit toolbar and anchorName so it works correctly in blur
// handlers where currentEditor/currentPropertyDomNode may already point to a
// different editor instance.
const disableStickyPositioning = (toolbar, anchorName) => {
    if (!toolbar) {
        return;
    }
    toolbar.classList.remove('neos-ck-anchored-toolbar--sticky');
    if (supportsCSSAnchors) {
        toolbar.style.positionAnchor = anchorName || '';
        toolbar.style.top = '';
        toolbar.style.bottom = '';
        toolbar.style.left = '';
        toolbar.style.right = '';
    }
};

// Update stickiness of the toolbar - pin to viewport top when the toolbar is above
// the property and would be clipped by the viewport. Only applies when the toolbar
// is in the "above" placement (not the below fallback).
const updateToolbarStickiness = () => {
    if (!currentEditor || !currentPropertyDomNode) {
        return;
    }

    const toolbar = currentEditor.ui.view.toolbar.element;
    if (!toolbar.classList.contains('neos-ck-anchored-toolbar--visible')) {
        return;
    }

    const propertyRect = currentPropertyDomNode.getBoundingClientRect();

    // Match the ContextToolbar threshold
    const propertyIsPartiallyVisible = propertyRect.top < 50 && propertyRect.bottom > 0;

    const isCurrentlySticky = toolbar.classList.contains('neos-ck-anchored-toolbar--sticky');

    if (!propertyIsPartiallyVisible) {
        if (isCurrentlySticky) {
            disableStickyPositioning(toolbar, currentPropertyDomNode.dataset.neosInlineEditorAnchorName);
        }
        return;
    }

    if (isCurrentlySticky) {
        // Once sticky, stay sticky as long as the property is partially visible.
        // This provides hysteresis and prevents flicker from re-evaluating the
        // toolbar's rendered position (which changes when the sticky class is toggled).
        return;
    }

    // Only become sticky when the toolbar is rendered above the property
    // (the default placement or the horizontal-align-right fallback). When it
    // fell back to below the property, pinning it to the top would cover edited text.
    const toolbarRect = toolbar.getBoundingClientRect();
    const toolbarIsAboveProperty = toolbarRect.top < propertyRect.top;

    if (toolbarIsAboveProperty) {
        enableStickyPositioning();
    }
};

// Debounced scroll handler for toolbar position and stickiness updates
const handleToolbarScroll = debounce(() => {
    updateToolbarStickiness();
    updateToolbarPosition();
}, 5);

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
                    updateToolbarStickiness();
                    updateToolbarPosition();
                });
                resizeObserver.observe(getGuestFrameDocument().documentElement);
            }
        }
    }

    const {placeholder, label, initialData, ...rest} = ckEditorConfig;

    return NeosEditor
        .create({
            ...rest,
            root: {
                element: propertyDomNode,
                placeholder,
                label,
                initialData
            }
        })
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
                    disableStickyPositioning(editor.ui.view.toolbar.element, propertyDomNode.dataset.neosInlineEditorAnchorName);
                    if (currentScrollTarget) {
                        currentScrollTarget.removeEventListener('scroll', handleToolbarScroll);
                        currentScrollTarget = null;
                    }
                    handleToolbarScroll.cancel();
                    return;
                }

                currentEditor = editor;
                currentPropertyDomNode = propertyDomNode;

                if (editor.ui.view.toolbar.items.length > 0) {
                    editor.ui.view.toolbar.element.classList.add('neos-ck-anchored-toolbar--visible');
                    const guestFrameWindow = getGuestFrameWindow();
                    if (currentScrollTarget) {
                        currentScrollTarget.removeEventListener('scroll', handleToolbarScroll);
                    }
                    currentScrollTarget = guestFrameWindow;
                    currentScrollTarget.addEventListener('scroll', handleToolbarScroll);
                    updateToolbarStickiness();
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
