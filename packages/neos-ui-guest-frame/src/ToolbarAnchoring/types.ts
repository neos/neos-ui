/**
 * The geometry helpers use structural equivalents of `DOMRect` and friends on purpose,
 * so the placement rules can be unit tested with plain objects.
 */

export interface Rect {
    top: number;
    right: number;
    bottom: number;
    left: number;
}

export interface Size {
    width: number;
    height: number;
}

/** Guest frame viewport */
export interface Viewport {
    width: number;
    height: number;
    scrollX: number;
    scrollY: number;
}

/** Which side of the property the toolbar is rendered at. */
export type Side = 'above' | 'below';

/** Inline coordinate value, `auto` mirrors what the CSS fallbacks use. */
export type Coordinate = number | 'auto';

export interface Placement {
    top: number;
    left: Coordinate;
    right: Coordinate;
}

export interface ToolbarElements {
    /** `editor.ui.view.toolbar.element`, the toolbar of a single editor instance */
    toolbar: HTMLElement;
    /** The dom node of the edited property the toolbar is anchored at */
    property: HTMLElement;
}

/**
 * Only the surface of the guest frame `Window` the anchoring uses.
 */
export interface GuestFrameWindowLike {
    innerWidth: number;
    innerHeight: number;
    scrollX: number;
    scrollY: number;
    addEventListener: (type: string, listener: EventListener) => void;
    removeEventListener: (type: string, listener: EventListener) => void;
}

/** Injected guest frame access, so tests need no content canvas iframe. */
export interface ToolbarEnvironment {
    getWindow(): GuestFrameWindowLike;
    getDocument(): Document;
}

/**
 * Places the toolbar: `cssAnchors` lets the browser resolve the anchored
 * placement, `jsFallback` computes everything. Backend-only style writes keep
 * the `supportsCSSAnchors` decision out of the placement rules and let the
 * fallback be removed as one file once anchor positioning is universal.
 */
export interface PositioningBackend {
    /** Whether document resizes have to be observed to reposition the toolbar. */
    readonly needsResizeObserver: boolean;
    /** Prepares a toolbar element to be anchored at its property. */
    attach(elements: ToolbarElements): void;
    /** The sticky placement takes over from the anchored one. */
    enterSticky(elements: ToolbarElements): void;
    /** The toolbar is handed back to the anchored placement. */
    leaveSticky(elements: ToolbarElements): void;
    /** Writes the coordinates of the anchored placement, if the backend needs to. */
    placeAnchored(elements: ToolbarElements, viewport: Viewport): void;
    /** Writes the coordinates of the sticky placement. */
    placeSticky(elements: ToolbarElements, viewport: Viewport): void;
}
