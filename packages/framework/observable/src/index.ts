/**
 * @neos-project/framework-observable - Observable pattern implementation for the Neos UI
 *   Copyright (C) 2023 Contributors of Neos CMS
 *
 *   This program is free software: you can redistribute it and/or modify
 *   it under the terms of the GNU General Public License as published by
 *   the Free Software Foundation, either version 3 of the License, or
 *   (at your option) any later version.
 *
 *   This program is distributed in the hope that it will be useful,
 *   but WITHOUT ANY WARRANTY; without even the implied warranty of
 *   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *   GNU General Public License for more details.
 *
 *   You should have received a copy of the GNU General Public License
 *   along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

export interface Subscriber<V> {
    next: (value: V) => void;
    error?: (error: Error) => void;
}

export interface Subscription {
    unsubscribe: () => void;
}

export interface Observer<V> {
    (subscriber: Subscriber<V>): Subscription;
}

export interface Observable<V> {
    subscribe: (subscriber: Subscriber<V>) => Subscription;
    map: <R>(mapFn: (value: V) => R) => Observable<R>;
    reduce: <R>(
        reducerFn: (current: R, next: V) => R,
        initialValue: R
    ) => Observable<R>;
}

export const createObservable = <V>(observer: Observer<V>): Observable<V> => {
    const subscribe = (subscriber: Subscriber<V>) => observer(subscriber);

    const map = <R>(mapFn: (value: V) => R) =>
        createObservable<R>((subscriber) =>
            subscribe({
                ...subscriber,
                next: (value) => subscriber.next(mapFn(value)),
            })
        );
    const reduce = <R>(
        reducerFn: (current: R, next: V) => R,
        initialValue: R
    ) => {
        const { update, ...observable } = createState<R>(initialValue);

        subscribe({
            next: (value) => update((current) => reducerFn(current, value)),
        });

        return observable;
    };

    return Object.freeze({
        subscribe,
        map,
        reduce,
    });
};

export interface State<V> extends Observable<V> {
    readonly current: V;
    update: (updateFn: (current: V) => V) => void;
}

export const createState = <S>(initialState: S): State<S> => {
    let currentState = initialState;
    const subscribers = new Set<Subscriber<S>>();
    const observable = createObservable<S>((subscriber) => {
        subscribers.add(subscriber);
        subscriber.next(currentState);

        return Object.freeze({
            unsubscribe: () => {
                subscribers.delete(subscriber);
            },
        });
    });

    return Object.freeze({
        ...observable,

        get current() {
            return currentState;
        },

        update: (updateFn: (current: S) => S) => {
            const nextState = updateFn(currentState);

            if (currentState !== nextState) {
                currentState = nextState;

                for (const subscriber of subscribers) {
                    subscriber.next(currentState);
                }
            }
        },
    });
};

export interface Channel<V> extends Observable<V> {
    publish: (value: V) => void;
}

export const createChannel = <V>(): Channel<V> => {
    const subscribers = new Set<Subscriber<V>>();
    const observable = createObservable<V>((subscriber) => {
        subscribers.add(subscriber);

        return Object.freeze({
            unsubscribe: () => {
                subscribers.delete(subscriber);
            },
        });
    });

    return Object.freeze({
        ...observable,

        publish: (value: V) => {
            for (const subscriber of subscribers) {
                subscriber.next(value);
            }
        },
    });
};

export const combine = <T extends Array<any>>(
    ...observables: { [K in keyof T]: Observable<T[K]> }
): Observable<{ [K in keyof T]: T[K] }[number]> =>
    createObservable((subscriber) => {
        const subscriptions = observables.map((o) => o.subscribe(subscriber));

        return Object.freeze({
            unsubscribe: () => subscriptions.forEach((s) => s.unsubscribe()),
        });
    });
