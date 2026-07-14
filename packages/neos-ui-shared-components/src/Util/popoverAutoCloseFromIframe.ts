const closeAllOpenPopovers = () => {
    // FIXME possibly respect popover="manual" and keep it open?
    for (const popover of document.querySelectorAll('[popover]:popover-open')) {
        // @ts-ignore update typescript?
        popover.togglePopover();
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
