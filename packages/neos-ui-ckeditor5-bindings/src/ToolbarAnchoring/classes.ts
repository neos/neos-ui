/**
 * The contract between the anchoring code and `cke-overwrites.vanilla-css`.
 * Keep both in sync when renaming.
 */
export const toolbarClasses = {
    /** Base class: anchors the toolbar at its property and hides it while unfocused */
    anchored: 'neos-ck-anchored-toolbar',
    /** The toolbar of the currently edited property */
    visible: 'neos-ck-anchored-toolbar--visible',
    /** The toolbar is pinned by the anchoring code instead of the anchor placement */
    sticky: 'neos-ck-anchored-toolbar--sticky'
};

/**
 * Dataset key of the CSS anchor name. Copied from the property node to the
 * toolbar, so a blur handler can restore the anchor without knowing which
 * property its editor had.
 */
export const anchorNameDatasetKey = 'neosInlineEditorAnchorName';
