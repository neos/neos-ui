import debounce from 'lodash.debounce';

import {AnchoredToolbar} from './AnchoredToolbar';
import {isAttached} from './attach';
import {positioningBackend} from './backends';
import {readViewport} from './dom';
import {guestFrameEnvironment} from './guestFrame';
import {GuestFrameWindowLike, PositioningBackend, ToolbarElements, ToolbarEnvironment} from './types';

/**
 * Upper bound of tracked toolbars. Instances are released on blur and pruned
 * when their elements leave the document, so normally one entry is tracked.
 * Reaching this cap means a release path is broken, so entries are dropped loudly.
 */
export const MAX_TRACKED_TOOLBARS = 32;

export interface AnchoringStats {
    /** Number of guest frame documents the registry has been scoped to. */
    generation: number;
    tracked: number;
    /** Toolbars dropped because their elements left the document. */
    pruned: number;
    /** Toolbars dropped by the cap. Anything but zero here is a bug. */
    evicted: number;
}

/**
 * Owns the toolbar anchoring of one guest frame document: scroll listener,
 * resize observer and active toolbar. Being document-scoped is what stops a
 * navigation from keeping the previous document alive.
 */
export class ToolbarRegistry {
    private readonly toolbars = new Map<HTMLElement, AnchoredToolbar>();

    private active: AnchoredToolbar | null = null;

    private document: Document | null = null;

    private scrollTarget: GuestFrameWindowLike | null = null;

    private resizeObserver: ResizeObserver | null = null;

    private pruned = 0;

    private evicted = 0;

    private generation = 0;

    /**
     * Only the active toolbar is updated, so the debounce already is a single
     * batched read and write pass per scroll gesture.
     */
    private readonly handleScroll = debounce(() => this.updateActive(), 5);

    constructor(
        private readonly env: ToolbarEnvironment = guestFrameEnvironment,
        private readonly backend: PositioningBackend = positioningBackend
    ) {}

    /**
     * Prepares a freshly created editor's toolbar for anchoring. Cheap and
     * idempotent; no instance is created before the property is edited.
     */
    attach(elements: ToolbarElements): void {
        // Every editor of a new document attaches before it can be edited, the
        // earliest point at which a navigation is noticed.
        if (!this.ensureDocumentScope()) {
            return;
        }

        if (!isAttached(elements.toolbar)) {
            this.backend.attach(elements);
        }
    }

    /**
     * Makes the given toolbar the active one. The previous one is released as
     * well, even when its editor never reported a blur.
     */
    activate(elements: ToolbarElements): void {
        const toolbar = this.acquire(elements);

        if (!toolbar) {
            return;
        }

        this.ensureScrollHandling();
        this.makeActive(toolbar);
    }

    /**
     * Releases the toolbar of a blurred editor. An untracked toolbar never
     * touches the active one, so a late blur is harmless.
     */
    deactivate(toolbarElement: HTMLElement): void {
        const toolbar = this.toolbars.get(toolbarElement);

        if (!toolbar) {
            return;
        }

        toolbar.deactivate();
        this.toolbars.delete(toolbarElement);

        if (this.active === toolbar) {
            this.active = null;
            this.handleScroll.cancel();
        }
    }

    getStats(): AnchoringStats {
        return {
            generation: this.generation,
            tracked: this.toolbars.size,
            pruned: this.pruned,
            evicted: this.evicted
        };
    }

    private acquire(elements: ToolbarElements): AnchoredToolbar | null {
        if (!this.ensureDocumentScope()) {
            return null;
        }

        this.attach(elements);

        const existing = this.toolbars.get(elements.toolbar);
        if (existing) {
            return existing;
        }

        this.prune();
        this.enforceCap();

        const toolbar = new AnchoredToolbar(elements, this.backend);
        this.toolbars.set(elements.toolbar, toolbar);
        return toolbar;
    }

    private makeActive(toolbar: AnchoredToolbar): void {
        const viewport = readViewport(this.env.getWindow());

        this.toolbars.forEach(other => {
            if (other === toolbar) {
                return;
            }
            // Release toolbars which never reported a blur; keep the instances,
            // `prune` drops them with their property and re-focus reuses them.
            other.destroy();
        });

        // Map order is insertion order, re-adding keeps it ordered by last use.
        this.toolbars.delete(toolbar.toolbarElement);
        this.toolbars.set(toolbar.toolbarElement, toolbar);

        this.active = toolbar;
        toolbar.activate(viewport);
    }

    private updateActive(): void {
        if (!this.active && this.toolbars.size === 0) {
            return;
        }

        if (!this.ensureDocumentScope()) {
            return;
        }

        this.prune();

        if (this.active) {
            this.active.update(readViewport(this.env.getWindow()));
        }
    }

    /**
     * Without this reset a navigation keeps the detached document alive through
     * the instances, listener and observer - and the fallback's observer would
     * go on observing the previous document element, which never resizes, so
     * toolbars would silently stop being placed.
     */
    private ensureDocumentScope(): boolean {
        const guestFrameDocument = this.env.getDocument();

        if (!guestFrameDocument) {
            return false;
        }

        if (guestFrameDocument !== this.document) {
            this.releaseDocumentScope();
            this.document = guestFrameDocument;
            this.generation++;
        }

        return true;
    }

    private releaseDocumentScope(): void {
        this.handleScroll.cancel();

        if (this.scrollTarget) {
            this.scrollTarget.removeEventListener('scroll', this.handleScroll);
            this.scrollTarget = null;
        }

        if (this.resizeObserver) {
            this.resizeObserver.disconnect();
            this.resizeObserver = null;
        }

        this.toolbars.forEach(toolbar => toolbar.destroy());
        this.toolbars.clear();
        this.active = null;
        this.document = null;
    }

    private ensureScrollHandling(): void {
        const guestFrameWindow = this.env.getWindow();

        if (this.scrollTarget !== guestFrameWindow) {
            if (this.scrollTarget) {
                this.scrollTarget.removeEventListener('scroll', this.handleScroll);
            }
            this.scrollTarget = guestFrameWindow;
            guestFrameWindow.addEventListener('scroll', this.handleScroll);
        }

        // The document element changes size on window resizes and on re-renders of
        // the content canvas, which both need a repositioning of the toolbar.
        if (this.backend.needsResizeObserver && !this.resizeObserver && typeof ResizeObserver !== 'undefined') {
            const guestFrameDocument = this.env.getDocument();
            if (guestFrameDocument) {
                this.resizeObserver = new ResizeObserver(() => this.handleScroll());
                this.resizeObserver.observe(guestFrameDocument.documentElement);
            }
        }
    }

    /**
     * Forgets the toolbars whose elements left the document - replaced property
     * nodes never come back, this is what bounds the registry.
     */
    private prune(): void {
        this.toolbars.forEach((toolbar, element) => {
            if (toolbar.isAlive) {
                return;
            }
            toolbar.destroy();
            this.toolbars.delete(element);
            if (this.active === toolbar) {
                this.active = null;
            }
            this.pruned++;
        });
    }

    private enforceCap(): void {
        if (this.toolbars.size < MAX_TRACKED_TOOLBARS) {
            return;
        }

        this.toolbars.forEach((toolbar, element) => {
            if (this.toolbars.size < MAX_TRACKED_TOOLBARS || toolbar === this.active) {
                return;
            }

            toolbar.destroy();
            this.toolbars.delete(element);
            this.evicted++;
            console.warn(`ToolbarAnchoring: dropped a toolbar which was never released, the registry ` +
                `exceeded ${MAX_TRACKED_TOOLBARS} entries. This is a bug, see ToolbarRegistry.getStats().`);
        });
    }
}

/** The anchoring of the current guest frame document, used by the editor bootstrap. */
export const anchoredToolbars = new ToolbarRegistry();
