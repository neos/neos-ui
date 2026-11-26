import {toolbarClasses} from './classes';
import {readRect} from './dom';
import {isClippedByViewport, isPropertyPartiallyVisible, sideOf} from './geometry';
import {PositioningBackend, ToolbarElements, Viewport} from './types';

/**
 * Anchors the toolbar of one editor at its property and keeps it in view while
 * scrolling. All state lives here, on the instance owning the two elements, so
 * an event of one editor can never change another one's toolbar.
 */
export class AnchoredToolbar {
    private visible = false;

    private sticky = false;

    constructor(private readonly elements: ToolbarElements, private readonly backend: PositioningBackend) {}

    get toolbarElement(): HTMLElement {
        return this.elements.toolbar;
    }

    get isVisible(): boolean {
        return this.visible;
    }

    get isSticky(): boolean {
        return this.sticky;
    }

    /**
     * Property nodes are replaced without a blur, e.g. by a re-render. Detached
     * nodes have an empty rect, which would place the toolbar at the top left of
     * the viewport, so such instances are not worth keeping or updating.
     */
    get isAlive(): boolean {
        return this.elements.toolbar.isConnected && this.elements.property.isConnected;
    }

    activate(viewport: Viewport): void {
        this.visible = true;
        this.elements.toolbar.classList.add(toolbarClasses.visible);
        this.update(viewport);
    }

    deactivate(): void {
        this.visible = false;
        this.elements.toolbar.classList.remove(toolbarClasses.visible);
        this.setSticky(false);
    }

    /**
     * Re-evaluates stickiness and writes the resulting placement. Called on focus,
     * on scroll and on resize of the guest frame.
     */
    update(viewport: Viewport): void {
        if (!this.visible) {
            return;
        }

        if (!this.isAlive) {
            this.deactivate();
            return;
        }

        this.updateStickiness(viewport);

        if (this.sticky) {
            this.backend.placeSticky(this.elements, viewport);
        } else {
            this.backend.placeAnchored(this.elements, viewport);
        }
    }

    private updateStickiness(viewport: Viewport): void {
        const propertyRect = readRect(this.elements.property);

        if (!isPropertyPartiallyVisible(propertyRect)) {
            this.setSticky(false);
            return;
        }

        if (this.sticky) {
            // Stay sticky while the property is partially visible,
            // instead of re-evaluating the position which sticky itself changes.
            return;
        }

        // If the toolbar is not fully visible, pin it independent of the property's position.
        const toolbarRect = readRect(this.elements.toolbar);
        if (isClippedByViewport(toolbarRect, viewport, sideOf(toolbarRect, propertyRect))) {
            this.setSticky(true);
        }
    }

    private setSticky(sticky: boolean): void {
        if (this.sticky === sticky) {
            return;
        }

        this.sticky = sticky;
        if (sticky) {
            this.backend.enterSticky(this.elements);
        } else {
            this.backend.leaveSticky(this.elements);
        }
    }
}
