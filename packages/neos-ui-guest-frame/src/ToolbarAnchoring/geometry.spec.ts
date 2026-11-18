import {
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
import {Placement, Rect, Size, Viewport} from './types';

const rect = (top: number, bottom: number, left = 100, right = 500): Rect => ({top, right, bottom, left});

const size = (width = 300, height = 34): Size => ({width, height});

const viewport = (width = 1024, height = 720, scrollX = 0, scrollY = 0): Viewport => ({width, height, scrollX, scrollY});

describe('isPropertyPartiallyVisible', () => {
    it('is true while the property crosses the threshold and is not scrolled out', () => {
        expect(isPropertyPartiallyVisible(rect(10, 500))).toBe(true);
        expect(isPropertyPartiallyVisible(rect(-2000, 300))).toBe(true);
        expect(isPropertyPartiallyVisible(rect(400, 900))).toBe(false);
        expect(isPropertyPartiallyVisible(rect(-300, -10))).toBe(false);
    });

    it('uses the same threshold as the ContextToolbar', () => {
        expect(isPropertyPartiallyVisible(rect(PROPERTY_VISIBLE_THRESHOLD - 1, 500))).toBe(true);
        expect(isPropertyPartiallyVisible(rect(PROPERTY_VISIBLE_THRESHOLD, 500))).toBe(false);
    });

    it('ends stickiness exactly at the top edge of the viewport', () => {
        expect(isPropertyPartiallyVisible(rect(-100, 0))).toBe(false);
        expect(isPropertyPartiallyVisible(rect(-100, 1))).toBe(true);
    });
});

describe('sideOf', () => {
    it('is above for the default placement', () => {
        expect(sideOf(rect(96, 130, 100, 400), rect(130, 600))).toBe('above');
    });

    it('is below for the align-bottom placement', () => {
        expect(sideOf(rect(600, 634, 100, 400), rect(130, 600))).toBe('below');
    });
});

describe('isClippedByViewport', () => {
    it('compares an above placement against the sticky offset, not against zero', () => {
        expect(isClippedByViewport(rect(-34, 0), viewport(), 'above')).toBe(true);
        expect(isClippedByViewport(rect(4, 38), viewport(), 'above')).toBe(true);
        // entering sticky is position neutral at this boundary
        expect(isClippedByViewport(rect(STICKY_TOP_OFFSET, 39), viewport(), 'above')).toBe(false);
    });

    it('compares a below placement against the bottom of the viewport', () => {
        expect(isClippedByViewport(rect(690, 724), viewport(), 'below')).toBe(true);
        expect(isClippedByViewport(rect(300, 334), viewport(), 'below')).toBe(false);
    });

    it('does not pin a toolbar which is attached below a short property inside the viewport', () => {
        const property = rect(10, 40);
        const toolbar = rect(property.bottom, property.bottom + size().height);

        expect(sideOf(toolbar, property)).toBe('below');
        expect(isClippedByViewport(toolbar, viewport(), 'below')).toBe(false);
    });

    it('pins a toolbar which fell back to the end of a long property', () => {
        // where anchor positioning places a toolbar that does not fit above
        const property = rect(-400, 3000);
        const toolbar = rect(property.bottom, property.bottom + size().height);

        expect(sideOf(toolbar, property)).toBe('below');
        expect(isClippedByViewport(toolbar, viewport(), 'below')).toBe(true);
    });
});

describe('stickyHorizontal', () => {
    it('aligns the toolbar to the left edge of the property', () => {
        expect(stickyHorizontal(rect(0, 500, 100, 500), size(), viewport())).toEqual({left: 100, right: 'auto'});
    });

    it('right-aligns it to the property when it would overflow the viewport', () => {
        expect(stickyHorizontal(rect(0, 500, 900, 1000), size(300), viewport(1024)))
            .toEqual({left: 'auto', right: 24});
    });
});

describe('stickyVertical', () => {
    it('pins the toolbar to the top while the property spans past it', () => {
        expect(stickyVertical(rect(-1000, 2000), size(), viewport())).toBe(STICKY_TOP_OFFSET);
    });

    it('flips it below the property once the property ends above the pinned position', () => {
        // 20 - 34 < STICKY_TOP_OFFSET, so the pinned toolbar would reach past the
        // property, and 20 + 34 fits into the viewport
        expect(stickyVertical(rect(-1000, 20), size(), viewport())).toBe(20);
    });

    it('never scrolls the toolbar past the end of the property', () => {
        const property = rect(-1000, 30);

        expect(property.bottom - size(300, 34).height).toBeLessThan(STICKY_TOP_OFFSET);
        expect(stickyVertical(property, size(300, 34), viewport())).toBe(property.bottom);
    });

    it('leaves the view with the property when neither pinning nor flipping fits', () => {
        // a viewport shorter than two toolbars
        expect(stickyVertical(rect(-100, 30), size(300, 34), viewport(1024, 50))).toBe(-4);
    });
});

describe('stickyPlacement', () => {
    it('combines the horizontal fallback with the vertical placement', () => {
        const placement = stickyPlacement(rect(-1000, 3000, 900, 1000), size(300, 34), viewport(1024)) as Placement;

        expect(placement).toEqual({left: 'auto', right: 24, top: STICKY_TOP_OFFSET});
    });
});

describe('anchoredFallbackPlacement', () => {
    it('places the toolbar above the property in document coordinates', () => {
        const placement = anchoredFallbackPlacement(rect(130, 600), size(300, 34), viewport(1024, 720, 0, 250));

        expect(placement).toEqual({left: 100, right: 'auto', top: 130 - 34 + 250});
    });
});
