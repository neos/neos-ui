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
 * A State is a special kind of Observable that keeps track of a value over
 * time.
 *
 * It has a public readonly `current` property that allows you to ask for
 * its current value at any point in time. A new subscriber to the State
 * Observable will also immediately receive the current value at the time of
 * subscription.
 *
 * Via the `update` method, a State's value can be modified. When called,
 * Subscribers to the state are immediately informed about the new value.
 */
export interface State<V> extends Observable<V> {
    readonly current: V;
    update: (updateFn: (current: V) => V) => void;
}

/**
 * Creates a new State with the given initial value.
 */
export function createState<V>(initialValue: V): State<V> {
    let currentState = initialValue;
    const listeners = new Set<(value: V) => void>();
    const state: State<V> = {
        ...createObservable((next) => {
            listeners.add(next);
            next(currentState);

            return () => listeners.delete(next);
        }),

        get current() {
            return currentState;
        },

        update(updateFn) {
            const nextState = updateFn(currentState);

            if (currentState !== nextState) {
                currentState = nextState;

                for (const next of listeners) {
                    next(currentState);
                }
            }
        }
    };

    return Object.freeze(state);
}
