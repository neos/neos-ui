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
import {State} from './State';

/**
 * An ActionObservable is a special kind of Observable which allows setting its value from outside.
 *
 * Unlike {@link State} there is no initial default value, and also we don't keep track of the value.
 * A new subscriber to the ActionObservable Observable will not receive the last value.
 *
 * Via the `next` method, a ActionObservable's value can be set. When called,
 * Subscribers to the state are immediately informed about the new value - and only new values after their registration.
 */
export interface ActionObservable<V> extends Observable<V> {
    next: (nextState: V) => void;
}

/**
 * Creates a new empty ActionObservable
 */
export function createActionObservable<V>(): ActionObservable<V> {
    const listeners = new Set<(value: V) => void>();
    const actionObservable = {
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

    return Object.freeze(actionObservable);
}
