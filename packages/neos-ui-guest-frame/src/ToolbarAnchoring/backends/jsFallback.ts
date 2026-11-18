import {attachToProperty} from '../attach';
import {toolbarClasses} from '../classes';
import {applyPlacement, clearPlacement, readRect, readSize} from '../dom';
import {anchoredFallbackPlacement, stickyPlacement} from '../geometry';
import {PositioningBackend, ToolbarElements} from '../types';

/**
 * Browsers without CSS anchor positioning support, see
 * https://caniuse.com/css-anchor-position; delete this file once all supported
 * engines have it.
 *
 * Anchored placement is `position: absolute` in document coordinates, sticky is
 * `position: fixed` in viewport ones, both computed here. Align-right is
 * emulated while sticky; align-bottom is not emulated while anchored, so short
 * properties near the top pin slightly more eagerly than anchor-capable engines.
 */
export const jsFallbackBackend: PositioningBackend = {
    needsResizeObserver: true,

    attach: attachToProperty,

    // The `@supports not (anchor-name: ...)` rules turn the sticky class into
    // `position: fixed`, so there is nothing else to prepare.
    enterSticky: ({toolbar}: ToolbarElements) => {
        toolbar.classList.add(toolbarClasses.sticky);
    },

    leaveSticky: ({toolbar}: ToolbarElements) => {
        toolbar.classList.remove(toolbarClasses.sticky);
        clearPlacement(toolbar);
    },

    placeAnchored: ({toolbar, property}: ToolbarElements, viewport) => {
        applyPlacement(toolbar, anchoredFallbackPlacement(readRect(property), readSize(toolbar), viewport));
    },

    placeSticky: ({toolbar, property}: ToolbarElements, viewport) => {
        applyPlacement(toolbar, stickyPlacement(readRect(property), readSize(toolbar), viewport));
    }
};
