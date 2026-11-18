import {Coordinate, Placement, Rect, Side, Size, Viewport} from './types';

/**
 * Distance the sticky toolbar is pinned to the top of the viewport.
 * @see the `top` of `.neos-ck-anchored-toolbar--sticky` in
 * cke-overwrites.vanilla-css (neos-ui-ckeditor5-bindings), covering the first frame.
 */
export const STICKY_TOP_OFFSET = 5;

/**
 * A property counts as "in view" while its top is above this offset. Shared
 * with the `ContextToolbar`, so both pin at the same scroll position.
 */
export const PROPERTY_VISIBLE_THRESHOLD = 50;

export const isPropertyPartiallyVisible = (property: Rect): boolean =>
    property.top < PROPERTY_VISIBLE_THRESHOLD && property.bottom > 0;

/**
 * Which side of the property the toolbar is rendered at: above by default,
 * below if anchor positioning fell back; the positioning fallback only knows above.
 */
export const sideOf = (toolbar: Rect, property: Rect): Side =>
    toolbar.top >= property.top ? 'below' : 'above';

/**
 * Whether the toolbar is clipped by the viewport, judged against the edge its
 * current placement can be clipped by. Above, the comparison runs against the
 * sticky offset instead of zero, so entering sticky cannot flicker.
 */
export const isClippedByViewport = (toolbar: Rect, viewport: Viewport, side: Side): boolean =>
    side === 'below'
        ? toolbar.bottom > viewport.height
        : toolbar.top < STICKY_TOP_OFFSET;

/**
 * Right-aligns the sticky toolbar to the property when it would overflow the
 * viewport, mimicking the `--neos-ck-toolbar-align-right` fallback.
 */
export const stickyHorizontal = (property: Rect, toolbar: Size, viewport: Viewport): {left: Coordinate; right: Coordinate} =>
    property.left + toolbar.width > viewport.width
        ? {left: 'auto', right: viewport.width - property.right}
        : {left: property.left, right: 'auto'};

/**
 * Vertical placement of the sticky toolbar: pinned to the top of the viewport,
 * but never further down than the end of the edited property.
 */
export const stickyVertical = (property: Rect, toolbar: Size, viewport: Viewport): number => {
    if (property.bottom - toolbar.height >= STICKY_TOP_OFFSET) {
        // The property still spans past the pinned position -> keep it at the top.
        return STICKY_TOP_OFFSET;
    }
    if (property.bottom + toolbar.height <= viewport.height) {
        // The property ends -> flip below it and follow its bottom edge, never
        // past the end of the element.
        return property.bottom;
    }
    // Neither pinning nor flipping fits (short viewport) -> leave with the property.
    return property.bottom - toolbar.height;
};

export const stickyPlacement = (property: Rect, toolbar: Size, viewport: Viewport): Placement => ({
    ...stickyHorizontal(property, toolbar, viewport),
    top: stickyVertical(property, toolbar, viewport)
});

/**
 * For the positioning fallback while not sticky: directly above the property,
 * in document coordinates (`position: absolute`).
 */
export const anchoredFallbackPlacement = (property: Rect, toolbar: Size, viewport: Viewport): Placement => ({
    left: property.left + viewport.scrollX,
    right: 'auto',
    top: property.top - toolbar.height + viewport.scrollY
});
