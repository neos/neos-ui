import {attachToProperty} from '../attach';
import {toolbarClasses} from '../classes';
import {applyPlacement, clearPlacement, readAnchorName, readRect, readSize, setPositionAnchor} from '../dom';
import {stickyPlacement} from '../geometry';
import {PositioningBackend, ToolbarElements} from '../types';

/**
 * Browsers with CSS anchor positioning support: the browser resolves the anchored
 * placement, including the align-right and align-bottom fallbacks. Once sticky
 * we take over completely and drop the anchor. Keeping both can desynchronize the actual position and hit area.
 */
export const cssAnchorsBackend: PositioningBackend = {
    needsResizeObserver: false,

    attach: attachToProperty,

    enterSticky: ({toolbar}: ToolbarElements) => {
        toolbar.classList.add(toolbarClasses.sticky);
        setPositionAnchor(toolbar, '');
        toolbar.style.bottom = 'auto';
    },

    leaveSticky: ({toolbar}: ToolbarElements) => {
        toolbar.classList.remove(toolbarClasses.sticky);
        clearPlacement(toolbar);
        setPositionAnchor(toolbar, readAnchorName(toolbar));
    },

    // Resolved by the browser from the anchor alone.
    placeAnchored: () => undefined,

    placeSticky: ({toolbar, property}: ToolbarElements, viewport) => {
        applyPlacement(toolbar, stickyPlacement(readRect(property), readSize(toolbar), viewport));
    }
};
