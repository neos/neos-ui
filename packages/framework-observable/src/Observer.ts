/*
 * This file is part of the Neos.Neos.Ui package.
 *
 * (c) Contributors of the Neos Project - www.neos.io
 *
 * This package is Open Source Software. For the full copyright and license
 * information, please view the LICENSE file which was distributed with this
 * source code.
 */

/**
 * An Observer is a function that emits values via its `next` callback. It can
 * return a function that handles all logic that must be performed when a
 * Subscription is cancelled (e.g. clearTimeout or similar cancellation
 * effects).
 */
export interface Observer<V> {
    (next: (value: V) => void, fail: (error: any) => void): void | (() => void);
}
