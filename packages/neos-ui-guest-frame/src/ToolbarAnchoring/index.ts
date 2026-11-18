/**
 * Anchoring and stickiness of the CKEditor 5 formatting toolbars; the geometry
 * constants are shared with the node toolbars. All placement rules and browser
 * workarounds live here.
 */
export {anchoredToolbars, MAX_TRACKED_TOOLBARS, ToolbarRegistry} from './registry';
export type {AnchoringStats} from './registry';
export {AnchoredToolbar} from './AnchoredToolbar';
export {supportsCSSAnchors, positioningBackend} from './backends';
export {cssAnchorsBackend} from './backends/cssAnchors';
export {jsFallbackBackend} from './backends/jsFallback';
export {
    PROPERTY_VISIBLE_THRESHOLD,
    STICKY_TOP_OFFSET,
    anchoredFallbackPlacement,
    isClippedByViewport,
    isPropertyPartiallyVisible,
    sideOf,
    stickyHorizontal,
    stickyPlacement,
    stickyVertical
} from './geometry';
export type {
    Coordinate,
    GuestFrameWindowLike,
    Placement,
    PositioningBackend,
    Rect,
    Side,
    Size,
    ToolbarElements,
    ToolbarEnvironment,
    Viewport
} from './types';
