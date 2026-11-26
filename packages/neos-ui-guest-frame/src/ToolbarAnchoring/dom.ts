import {anchorNameDatasetKey} from './classes';
import {GuestFrameWindowLike, Placement, Rect, Size, Viewport} from './types';

// Anchor positioning properties are missing from the TS 4.6 dom lib
type StyleWithAnchors = CSSStyleDeclaration & Record<'positionAnchor' | 'anchorName' | 'positionTryFallbacks', string | undefined>;

export const readRect = (element: HTMLElement): Rect => {
    const {top, right, bottom, left} = element.getBoundingClientRect();
    return {top, right, bottom, left};
};

export const readSize = (element: HTMLElement): Size => ({
    width: element.offsetWidth,
    height: element.offsetHeight
});

export const readViewport = (guestFrameWindow: GuestFrameWindowLike): Viewport => ({
    width: guestFrameWindow.innerWidth,
    height: guestFrameWindow.innerHeight,
    scrollX: guestFrameWindow.scrollX,
    scrollY: guestFrameWindow.scrollY
});

export const readAnchorName = (element: HTMLElement): string => element.dataset[anchorNameDatasetKey] || '';

export const setPositionAnchor = (element: HTMLElement, anchorName: string): void => {
    (element.style as StyleWithAnchors).positionAnchor = anchorName;
};

export const applyPlacement = (element: HTMLElement, placement: Placement): void => {
    element.style.top = placement.top + 'px';
    element.style.left = typeof placement.left === 'number' ? placement.left + 'px' : placement.left;
    element.style.right = typeof placement.right === 'number' ? placement.right + 'px' : placement.right;
};

/**
 * Removes the sticky coordinates to prevent conflicts with CSS anchors.
 */
export const clearPlacement = (element: HTMLElement): void => {
    element.style.top = '';
    element.style.bottom = '';
    element.style.left = '';
    element.style.right = '';
};
