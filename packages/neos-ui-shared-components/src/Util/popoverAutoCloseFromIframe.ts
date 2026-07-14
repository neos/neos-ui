const closeAllOpenPopovers = () => {
    for (const elementWithPopover of document.querySelectorAll('[popover]:popover-open')) {
        /**
         * Handling of all states {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/popover}
         */
        // @ts-ignore update typescript?
        const popoverAttribute = elementWithPopover.popover;

        if (popoverAttribute === 'manual') {
            continue;
        }

        if (popoverAttribute === 'auto') {
            // @ts-ignore update typescript?
            elementWithPopover.togglePopover();
            continue;
        }

        console.warn(`Support for popover="${popoverAttribute}" is not implemented, skipping element`, elementWithPopover);
    }
};

interface Disposable {
    dispose(): void;
}

/**
 * HTML Popovers are autoclosed when clicking outside or pressing escape.
 *
 * That applies only to the main frame, other frames are handled manually.
 *
 * See {@link https://developer.mozilla.org/en-US/docs/Web/API/Popover_API}
 * @param iFrame
 */
export function popoverAutoCloseFromIframe(iFrame: HTMLIFrameElement): Disposable {
    const escapeListener = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
            closeAllOpenPopovers();
        }
    };

    const leftClickListener = () => {
        closeAllOpenPopovers();
    }

    iFrame.addEventListener('keydown', escapeListener);
    iFrame.addEventListener('click', leftClickListener);

    return {
        dispose() {
            iFrame.removeEventListener('keydown', escapeListener);
            iFrame.removeEventListener('click', leftClickListener);
        }
    }
}
