/*
 * This file is part of the Neos.Neos.Ui package.
 *
 * (c) Contributors of the Neos Project - www.neos.io
 *
 * This package is Open Source Software. For the full copyright and license
 * information, please view the LICENSE file which was distributed with this
 * source code.
 */
import type {Subscriber} from './Subscriber';
import type {Subscription} from './Subscription';
import type {Observer} from './Observer';

/**
 * An Observable emits values over time. You can attach a subscriber to it
 * using the Observable's `subscribe` method, or you can perform operations
 * producing new Observables via its `pipe` method.
 */
export interface Observable<V> {
    subscribe: (subscriber: Subscriber<V>) => Subscription;
}

/**
 * Creates an Observable from the given Observer.
 */
export function createObservable<V>(observer: Observer<V>): Observable<V> {
    const observable: Observable<V> = {
        subscribe(subscriber) {
            return Object.freeze({
                unsubscribe: observer(
                    subscriber.next,
                    subscriber.error ?? noop
                ) ?? noop
            });
        }
    };

    return Object.freeze(observable);
}

function noop() {
}
