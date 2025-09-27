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

export function pick<V extends Record<string, any>, K extends string & keyof V>(state: State<V>, key: K): State<V[K]> {
    const currentUpperState = state.current;
    if (currentUpperState === null || typeof currentUpperState !== 'object' || Array.isArray(currentUpperState)) {
        throw new Error(`Cannot pick key "${key}" from non object value of type ${currentUpperState === null ? 'null' : (Array.isArray(currentUpperState) ? 'array' : typeof currentUpperState)}`);
    }

    let currentState = currentUpperState[key];
    const listeners = new Set<(value: V) => void>();

    let ignoreUpperStateUpdates: boolean = false;

    // this subscription is not unsubscribed explicitly, but we rely on the garbage collection
    state.subscribe({
        next(nextUpperState) {
            if (ignoreUpperStateUpdates) {
                return;
            }

            const nextState = nextUpperState[key];

            if (currentState !== nextState) {
                currentState = nextState;

                for (const next of listeners) {
                    next(nextState);
                }
            }
        }
    });

    const pickedState: State<V> = {
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
                    next(nextState);
                }

                try {
                    ignoreUpperStateUpdates = true;
                    state.update((currentUpperState) => ({
                        ...currentUpperState,
                        [key]: nextState
                    }));
                } finally {
                    ignoreUpperStateUpdates = false;
                }
            }
        }
    };

    return Object.freeze(pickedState);
}
