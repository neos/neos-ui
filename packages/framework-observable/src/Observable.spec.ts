/*
 * This file is part of the Neos.Neos.Ui package.
 *
 * (c) Contributors of the Neos Project - www.neos.io
 *
 * This package is Open Source Software. For the full copyright and license
 * information, please view the LICENSE file which was distributed with this
 * source code.
 */
import {createObservable} from './Observable';

describe('Observable', () => {
    test('emit some values and subscribe', () => {
        const observable$ = createObservable((next) => {
            next(1);
            next(2);
            next(3);
        });
        const subscriber = {
            next: jest.fn()
        };

        observable$.subscribe(subscriber);

        expect(subscriber.next).toHaveBeenCalledTimes(3);
        expect(subscriber.next).toHaveBeenNthCalledWith(1, 1);
        expect(subscriber.next).toHaveBeenNthCalledWith(2, 2);
        expect(subscriber.next).toHaveBeenNthCalledWith(3, 3);
    });

    test('emit some values and subscribe a couple of times', () => {
        const observable$ = createObservable((next) => {
            next(1);
            next(2);
            next(3);
        });
        const subscriber1 = {
            next: jest.fn()
        };
        const subscriber2 = {
            next: jest.fn()
        };
        const subscriber3 = {
            next: jest.fn()
        };

        observable$.subscribe(subscriber1);
        observable$.subscribe(subscriber2);
        observable$.subscribe(subscriber3);

        expect(subscriber1.next).toHaveBeenCalledTimes(3);
        expect(subscriber1.next).toHaveBeenNthCalledWith(1, 1);
        expect(subscriber1.next).toHaveBeenNthCalledWith(2, 2);
        expect(subscriber1.next).toHaveBeenNthCalledWith(3, 3);

        expect(subscriber2.next).toHaveBeenCalledTimes(3);
        expect(subscriber2.next).toHaveBeenNthCalledWith(1, 1);
        expect(subscriber2.next).toHaveBeenNthCalledWith(2, 2);
        expect(subscriber2.next).toHaveBeenNthCalledWith(3, 3);

        expect(subscriber3.next).toHaveBeenCalledTimes(3);
        expect(subscriber3.next).toHaveBeenNthCalledWith(1, 1);
        expect(subscriber3.next).toHaveBeenNthCalledWith(2, 2);
        expect(subscriber3.next).toHaveBeenNthCalledWith(3, 3);
    });

    test('emit no values, subscribe and unsubscribe', () => {
        const unsubscribe = jest.fn();
        const observable$ = createObservable(() => {
            return unsubscribe;
        });
        const subscriber = {
            next: jest.fn()
        };

        const subscription = observable$.subscribe(subscriber);
        subscription.unsubscribe();

        expect(subscriber.next).toHaveBeenCalledTimes(0);
        expect(unsubscribe).toHaveBeenCalledTimes(1);
    });

    test('emit no values, subscribe and unsubscribe with void observer', () => {
        const observable$ = createObservable(() => {});
        const subscriber = {
            next: jest.fn()
        };

        const subscription = observable$.subscribe(subscriber);

        expect(() => subscription.unsubscribe()).not.toThrow();
        expect(subscriber.next).toHaveBeenCalledTimes(0);
    });
});
