import {anchorNameDatasetKey, toolbarClasses} from './classes';
import {cssAnchorsBackend} from './backends/cssAnchors';
import {jsFallbackBackend} from './backends/jsFallback';
import {MAX_TRACKED_TOOLBARS, ToolbarRegistry} from './registry';
import {Rect, ToolbarElements} from './types';

interface MockOptions {
    rect?: Partial<Rect>;
    width?: number;
    height?: number;
    anchorName?: string;
}

interface MockElement {
    rect: Rect;
    dataset: Record<string, string>;
    style: Record<string, string>;
    classes: Set<string>;
    isConnected: boolean;
    offsetWidth: number;
    offsetHeight: number;
    classList: {
        add: (...names: string[]) => void;
        remove: (...names: string[]) => void;
        contains: (name: string) => boolean;
    };
    getBoundingClientRect: () => Rect;
}

const mockElement = (options: MockOptions = {}): MockElement => {
    const classes = new Set<string>();

    return {
        rect: {top: 0, right: 0, bottom: 0, left: 0, ...options.rect},
        dataset: options.anchorName ? {[anchorNameDatasetKey]: options.anchorName} : {},
        style: {},
        classes,
        isConnected: true,
        offsetWidth: options.width ?? 300,
        offsetHeight: options.height ?? 34,
        classList: {
            add: (...names: string[]) => names.forEach(name => classes.add(name)),
            remove: (...names: string[]) => names.forEach(name => classes.delete(name)),
            contains: name => classes.has(name)
        },
        getBoundingClientRect() {
            return this.rect;
        }
    };
};

const asHtmlElement = (element: MockElement): HTMLElement => element as unknown as HTMLElement;

const createToolbars = (
    toolbar: MockOptions = {},
    property: MockOptions = {}
): {toolbar: MockElement; property: MockElement; elements: ToolbarElements} => {
    const toolbarElement = mockElement(toolbar);
    const propertyElement = mockElement({anchorName: '--neos-cke5-toolbar', ...property});

    return {
        toolbar: toolbarElement,
        property: propertyElement,
        elements: {toolbar: asHtmlElement(toolbarElement), property: asHtmlElement(propertyElement)}
    };
};

interface MockWindow {
    innerWidth: number;
    innerHeight: number;
    scrollX: number;
    scrollY: number;
    listeners: Set<EventListener>;
    addEventListener: (type: string, listener: EventListener) => void;
    removeEventListener: (type: string, listener: EventListener) => void;
}

const mockWindow = (): MockWindow => {
    const listeners = new Set<EventListener>();

    return {
        innerWidth: 1024,
        innerHeight: 720,
        scrollX: 0,
        scrollY: 0,
        listeners,
        addEventListener: (_type, listener) => {
            listeners.add(listener);
        },
        removeEventListener: (_type, listener) => {
            listeners.delete(listener);
        }
    };
};

const mockDocument = (): Document => ({documentElement: asHtmlElement(mockElement())} as unknown as Document);

/** Registry over an environment whose document and window can be replaced. */
const createRegistry = (backend = jsFallbackBackend) => {
    const environment = {document: mockDocument(), window: mockWindow()};
    const registry = new ToolbarRegistry({
        getWindow: () => environment.window as never,
        getDocument: () => environment.document
    }, backend);

    return {
        registry,
        environment,
        navigate: () => {
            environment.document = mockDocument();
            environment.window = mockWindow();
        }
    };
};

const scrollTo = (window: MockWindow) => {
    window.listeners.forEach(listener => listener({type: 'scroll'} as Event));
    jest.advanceTimersByTime(10);
};

// Anchored placement clipped at the top: the situation which needs pinning.
const clippedToolbars = () => createToolbars(
    {rect: {top: -1034, right: 400, bottom: -1000, left: 100}},
    {rect: {top: -1000, right: 500, bottom: 3000, left: 100}}
);

// A toolbar which is fully visible in the viewport.
const inViewToolbars = () => createToolbars(
    {rect: {top: 100, right: 400, bottom: 134, left: 100}},
    {rect: {top: 134, right: 500, bottom: 600, left: 100}}
);

beforeEach(() => {
    jest.useFakeTimers();
});

afterEach(() => {
    jest.useRealTimers();
});

describe('attach', () => {
    it('anchors the toolbar at its property and is idempotent', () => {
        const {registry} = createRegistry();
        const {toolbar, property, elements} = createToolbars({}, {anchorName: '--neos-cke5-toolbar-1'});

        registry.attach(elements);
        registry.attach(elements);

        expect(toolbar.classes.has(toolbarClasses.anchored)).toBe(true);
        expect(toolbar.style.positionAnchor).toBe('--neos-cke5-toolbar-1');
        expect(toolbar.dataset[anchorNameDatasetKey]).toBe('--neos-cke5-toolbar-1');
        expect(property.classes.has(toolbarClasses.anchored)).toBe(false);
    });

    it('creates no instance, so a document full of editables costs nothing', () => {
        const {registry} = createRegistry();

        registry.attach(createToolbars().elements);
        registry.attach(createToolbars().elements);

        expect(registry.getStats()).toEqual({generation: 1, tracked: 0, pruned: 0, evicted: 0});
    });
});

describe('placement', () => {
    it('pins the toolbar while its placement above the property is clipped', () => {
        const {registry} = createRegistry();
        const {toolbar, elements} = clippedToolbars();

        registry.activate(elements);

        expect(toolbar.classes.has(toolbarClasses.visible)).toBe(true);
        expect(toolbar.classes.has(toolbarClasses.sticky)).toBe(true);
        expect(toolbar.style.top).toBe('5px');
        expect(toolbar.style.left).toBe('100px');
    });

    it('does not pin a toolbar which is fully visible', () => {
        const {registry} = createRegistry();
        const {toolbar, elements} = inViewToolbars();

        registry.activate(elements);

        expect(toolbar.classes.has(toolbarClasses.visible)).toBe(true);
        expect(toolbar.classes.has(toolbarClasses.sticky)).toBe(false);
    });

    it('does not pin a toolbar which anchor positioning placed below a short property', () => {
        const {registry} = createRegistry();
        const {toolbar, elements} = createToolbars(
            {rect: {top: 40, right: 400, bottom: 74, left: 100}},
            {rect: {top: 10, right: 500, bottom: 40, left: 100}}
        );

        registry.activate(elements);

        expect(toolbar.classes.has(toolbarClasses.sticky)).toBe(false);
    });

    it('pins a toolbar which anchor positioning placed at the end of a long property', () => {
        const {registry} = createRegistry();
        const {toolbar, elements} = createToolbars(
            {rect: {top: 3000, right: 400, bottom: 3034, left: 100}},
            {rect: {top: -400, right: 500, bottom: 3000, left: 100}}
        );

        registry.activate(elements);

        expect(toolbar.classes.has(toolbarClasses.sticky)).toBe(true);
        expect(toolbar.style.top).toBe('5px');
    });

    it('flips the toolbar below the property once its end reaches the pinned position', () => {
        const {registry, environment} = createRegistry();
        const {toolbar, property, elements} = clippedToolbars();

        registry.activate(elements);
        expect(toolbar.style.top).toBe('5px');

        property.rect = {top: -2000, right: 500, bottom: 20, left: 100};
        scrollTo(environment.window);

        expect(toolbar.style.top).toBe('20px');

        // past the property's end the anchored placement follows it off screen
        property.rect = {top: -2000, right: 500, bottom: -40, left: 100};
        scrollTo(environment.window);

        expect(toolbar.classes.has(toolbarClasses.sticky)).toBe(false);
        expect(toolbar.classes.has(toolbarClasses.visible)).toBe(true);
        expect(toolbar.style.top).toBe('-2034px');
    });

    it('hands the toolbar back to the anchor when sticky ends', () => {
        const {registry, environment} = createRegistry(cssAnchorsBackend);
        const {toolbar, property, elements} = clippedToolbars();

        registry.attach(elements);
        registry.activate(elements);

        expect(toolbar.style.positionAnchor).toBe('');
        expect(toolbar.style.bottom).toBe('auto');

        property.rect = {top: 134, right: 500, bottom: 600, left: 100};
        toolbar.rect = {top: 100, right: 400, bottom: 134, left: 100};
        scrollTo(environment.window);

        expect(toolbar.classes.has(toolbarClasses.sticky)).toBe(false);
        expect(toolbar.style.positionAnchor).toBe('--neos-cke5-toolbar');
        expect(toolbar.style.top).toBe('');
    });
});

describe('switching between editors', () => {
    it('releases the previous toolbar even without a blur of its editor', () => {
        const {registry} = createRegistry();
        const first = createToolbars({rect: {top: 66, right: 400, bottom: 100, left: 100}},
            {rect: {top: 100, right: 500, bottom: 600, left: 100}});
        const second = createToolbars({rect: {top: 66, right: 400, bottom: 100, left: 100}},
            {rect: {top: 100, right: 500, bottom: 600, left: 100}});

        registry.activate(first.elements);
        registry.activate(second.elements);

        expect(first.toolbar.classes.has(toolbarClasses.visible)).toBe(false);
        expect(second.toolbar.classes.has(toolbarClasses.visible)).toBe(true);
    });

    it('leaves the active toolbar alone when an old editor blurs late', () => {
        const {registry, environment} = createRegistry();
        const first = clippedToolbars();
        const second = clippedToolbars();

        registry.activate(first.elements);
        registry.activate(second.elements);

        registry.deactivate(asHtmlElement(first.toolbar));

        expect(second.toolbar.classes.has(toolbarClasses.visible)).toBe(true);
        expect(second.toolbar.style.top).toBe('5px');
        expect(environment.window.listeners.size).toBe(1);

        registry.deactivate(asHtmlElement(second.toolbar));

        expect(second.toolbar.classes.has(toolbarClasses.visible)).toBe(false);
        expect(second.toolbar.style.top).toBe('');
    });
});

describe('memory', () => {
    it('drops the instance whose property node left the document', () => {
        const {registry} = createRegistry();
        const removed = clippedToolbars();
        const alive = inViewToolbars();

        registry.activate(removed.elements);
        removed.property.isConnected = false;

        registry.activate(alive.elements);

        expect(registry.getStats().pruned).toBe(1);
        expect(registry.getStats().tracked).toBe(1);
        expect(removed.toolbar.classes.has(toolbarClasses.visible)).toBe(false);
    });

    it('releases the state of the previous document on navigation', () => {
        const {registry, environment, navigate} = createRegistry();
        const oldToolbars = clippedToolbars();
        const newToolbars = inViewToolbars();
        const previousWindow = environment.window;

        registry.activate(oldToolbars.elements);
        expect(previousWindow.listeners.size).toBe(1);
        expect(registry.getStats().generation).toBe(1);

        navigate();

        // the first editor of the new document notices the swap
        registry.attach(newToolbars.elements);

        expect(registry.getStats()).toEqual({generation: 2, tracked: 0, pruned: 0, evicted: 0});
        expect(previousWindow.listeners.size).toBe(0);
        expect(oldToolbars.toolbar.classes.has(toolbarClasses.visible)).toBe(false);

        registry.activate(newToolbars.elements);
        expect(environment.window.listeners.size).toBe(1);
    });

    it('attaches the scroll listener once per document instead of once per editor', () => {
        const {registry, environment} = createRegistry();

        for (let index = 0; index < 5; index++) {
            registry.activate(createToolbars({rect: {top: 100, right: 400, bottom: 134, left: 100}}).elements);
        }
        scrollTo(environment.window);

        expect(environment.window.listeners.size).toBe(1);
    });

    it('caps the tracked toolbars and says so when nothing released them', () => {
        const warn = jest.spyOn(console, 'warn').mockImplementation(() => undefined);
        const {registry} = createRegistry();
        const toolbars: Array<ReturnType<typeof createToolbars>> = [];

        // toolbars of properties which stay in the document and never blur
        for (let index = 0; index <= MAX_TRACKED_TOOLBARS; index++) {
            toolbars.push(createToolbars({rect: {top: 100, right: 400, bottom: 134, left: 100}}));
        }
        toolbars.forEach(toolbar => registry.activate(toolbar.elements));

        expect(registry.getStats().tracked).toBe(MAX_TRACKED_TOOLBARS);
        expect(registry.getStats().evicted).toBe(1);
        expect(warn).toHaveBeenCalled();

        warn.mockRestore();
    });
});
