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

// Distance the sticky toolbar is pinned to the top of the viewport.
// Mirrors the `top` of `.neos-ck-anchored-toolbar--sticky` in cke-overwrites.vanilla-css.
const stickyToolbarTopOffset = 5;

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
// Vertically it is pinned to the top of the viewport, and flipped below the
// property as soon as the property's end reaches the toolbar, so it never
// floats past the element the user is editing.
const setStickyToolbarCoordinates = toolbar => {
    if (!currentPropertyDomNode) {
        return;
    }
    const propertyRect = currentPropertyDomNode.getBoundingClientRect();
    const guestFrameWindow = getGuestFrameWindow();
    const viewportWidth = guestFrameWindow.innerWidth;
    const toolbarHeight = toolbar.offsetHeight;

    if (propertyRect.left + toolbar.offsetWidth > viewportWidth) {
        toolbar.style.left = 'auto';
        toolbar.style.right = (viewportWidth - propertyRect.right) + 'px';
    } else {
        toolbar.style.left = propertyRect.left + 'px';
        toolbar.style.right = 'auto';
    }

    if (propertyRect.bottom - toolbarHeight >= stickyToolbarTopOffset) {
        // The property still spans past the pinned position -> keep it at the top.
        toolbar.style.top = stickyToolbarTopOffset + 'px';
    } else if (propertyRect.bottom + toolbarHeight <= guestFrameWindow.innerHeight) {
        // The end of the property reached the pinned position -> flip the toolbar
        // below the property (like the `--neos-ck-toolbar-align-bottom` fallback)
        // and let it follow the property's bottom edge, instead of scrolling past
        // the end of the element.
        toolbar.style.top = propertyRect.bottom + 'px';
    } else {
        // Neither pinning nor flipping fits (very short viewport) -> let the
        // toolbar leave with the property rather than covering the content below it.
        toolbar.style.top = (propertyRect.bottom - toolbarHeight) + 'px';
    }
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
// The anchor name is taken from the toolbar itself, so this stays correct for
// editors which are not the currently focused one (blur handlers can run after
// another editor has taken over).
const disableStickyPositioning = toolbar => {
    if (!toolbar) {
        return;
    }
    toolbar.classList.remove('neos-ck-anchored-toolbar--sticky');
    // Drop the inline coordinates sticky has set, otherwise they would conflict
    // with the anchor- respectively fallback positioning (a leftover `right`
    // together with `left` even stretches the toolbar).
    toolbar.style.top = '';
    toolbar.style.bottom = '';
    toolbar.style.left = '';
    toolbar.style.right = '';
    if (supportsCSSAnchors) {
        toolbar.style.positionAnchor = toolbar.dataset.neosInlineEditorAnchorName || '';
    }
};

// Hides and unpins the toolbars of all other editors.
// Focus can be taken over without the previously edited property firing a blur,
// for example when its dom node is replaced by a re-render of another node; in
// that case its toolbar would stay visible - possibly still pinned to the top of
// the viewport - so we take the shared state away explicitly.
const deactivateOtherToolbars = activeToolbar => {
    const toolbars = getGuestFrameDocument().querySelectorAll('.ck.ck-toolbar.neos-ck-anchored-toolbar');
    [...toolbars].forEach(toolbar => {
        if (toolbar === activeToolbar) {
            return;
        }
        toolbar.classList.remove('neos-ck-anchored-toolbar--visible');
        disableStickyPositioning(toolbar);
    });
};

// Update stickiness of the toolbar: while the edited property is in view and its
// anchored placement is not fully visible, take over positioning and pin the
// toolbar to the top of the viewport (see `setStickyToolbarCoordinates`).
const updateToolbarStickiness = () => {
    if (!currentEditor || !currentPropertyDomNode) {
        return;
    }

    const toolbar = currentEditor.ui.view.toolbar.element;
    if (!toolbar.classList.contains('neos-ck-anchored-toolbar--visible')) {
        return;
    }

    // The property node can be replaced without a blur event, e.g. when another
    // node is selected and the guest frame re-renders. A detached node has an
    // empty rect, so hide the toolbar instead of positioning it at the top of the
    // viewport; the next focus anchors it to the new property node.
    if (!currentPropertyDomNode.isConnected) {
        toolbar.classList.remove('neos-ck-anchored-toolbar--visible');
        disableStickyPositioning(toolbar);
        return;
    }

    const propertyRect = currentPropertyDomNode.getBoundingClientRect();

    // Match the ContextToolbar threshold
    const propertyIsPartiallyVisible = propertyRect.top < 50 && propertyRect.bottom > 0;

    const isCurrentlySticky = toolbar.classList.contains('neos-ck-anchored-toolbar--sticky');

    if (!propertyIsPartiallyVisible) {
        if (isCurrentlySticky) {
            disableStickyPositioning(toolbar);
        }
        return;
    }

    if (isCurrentlySticky) {
        // Once sticky, stay sticky as long as the property is partially visible.
        // This provides hysteresis and prevents flicker from re-evaluating the
        // toolbar's rendered position (which changes when the sticky class is toggled).
        return;
    }

    // The toolbar is anchored above the property, unless anchor positioning moved
    // it to the `--neos-ck-toolbar-align-bottom` placement at the property's end
    // (`--neos-ck-toolbar-align-right` only shifts it horizontally). So test it
    // against the viewport edge it can be clipped by: above the property that is
    // the top edge, below the property the bottom edge. Only pin the toolbar when
    // it is not fully visible - clipped above the property, or placed at the end
    // of a long property, where it would be off-screen. A toolbar that is attached
    // to the bottom of the property inside the viewport needs no pinning.
    const toolbarRect = toolbar.getBoundingClientRect();
    const toolbarIsBelowProperty = toolbarRect.top >= propertyRect.top;
    const toolbarIsClippedByViewport = toolbarIsBelowProperty
        ? toolbarRect.bottom > getGuestFrameWindow().innerHeight
        : toolbarRect.top < stickyToolbarTopOffset;

    if (toolbarIsClippedByViewport) {
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
                    disableStickyPositioning(editor.ui.view.toolbar.element);

                    // Only tear down the shared scroll handling if this editor still
                    // owns it. Focus is not guaranteed to leave this editor before it
                    // enters the next one, so a late blur must not remove the listener
                    // (or cancel the pending update) of the newly focused editor.
                    if (currentEditor !== editor) {
                        return;
                    }

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
                    deactivateOtherToolbars(editor.ui.view.toolbar.element);
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

            // Anchor the toolbar to the dom-node representing the edited property.
            // The anchor name is kept on the toolbar element as well, so its
            // positioning can be restored without knowing which property the editor
            // was created for. Note that `ui.view.toolbar` is the view component, the
            // DOM node we style and mark up is its `element`.
            const toolbarElement = editor.ui.view.toolbar.element;
            const anchorName = propertyDomNode.dataset.neosInlineEditorAnchorName || '';
            toolbarElement.dataset.neosInlineEditorAnchorName = anchorName;
            toolbarElement.style.positionAnchor = anchorName;
            toolbarElement.classList.add('neos-ck-anchored-toolbar');

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
