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
 * A Subscriber can be attached to an Observable. It receives values from the
 * Observable in its `next` callback function. It may also provide an optional
 * `error` callback, that will only be called if the Observable emits an Error.
 */
export interface Subscriber<V> {
    next: (value: V) => void;
    error?: (error: Error) => void;
}
