import {PositioningBackend} from '../types';

import {cssAnchorsBackend} from './cssAnchors';
import {jsFallbackBackend} from './jsFallback';

// Without anchor positioning support the toolbar is placed on scroll and
// resize instead, see https://caniuse.com/css-anchor-position
export const supportsCSSAnchors = 'anchorName' in document.documentElement.style;

/**
 * The backend for the current browser, selected once per page and injected into
 * the registry, so tests can run both of them.
 */
export const positioningBackend: PositioningBackend = supportsCSSAnchors ? cssAnchorsBackend : jsFallbackBackend;
