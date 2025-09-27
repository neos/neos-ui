/*
 * This file is part of the Neos.Neos.Ui package.
 *
 * (c) Contributors of the Neos Project - www.neos.io
 *
 * This package is Open Source Software. For the full copyright and license
 * information, please view the LICENSE file which was distributed with this
 * source code.
 */
import {createObservable, Observable} from './Observable';

/**
 * An Channel is a special kind of Observable which allows setting its value from outside.
 *
 * Via the `next` method, a Channel's value can be set. When called,
 * Subscribers to the state are immediately informed about the new value - and only new values after their registration.
 */
export interface Channel<V> extends Observable<V> {
    next: (nextState: V) => void;
}

/**
 * Creates a new empty Channel
 */
export function createChannel<V>(): Channel<V> {
    const listeners = new Set<(value: V) => void>();
    const channel = {
        ...createObservable<V>((next) => {
            listeners.add(next);

            return () => listeners.delete(next);
        }),

        next(nextState: V) {
            for (const next of listeners) {
                next(nextState);
            }
        }
    };

    return Object.freeze(channel);
}
