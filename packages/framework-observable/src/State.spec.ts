/*
 * This file is part of the Neos.Neos.Ui package.
 *
 * (c) Contributors of the Neos Project - www.neos.io
 *
 * This package is Open Source Software. For the full copyright and license
 * information, please view the LICENSE file which was distributed with this
 * source code.
 */
import {createState} from './State';

describe('State', () => {
    test('get current value', () => {
        const state$ = createState(0);

        expect(state$.current).toBe(0);

        state$.update((value) => value + 1);
        expect(state$.current).toBe(1);

        state$.update((value) => value + 1);
        expect(state$.current).toBe(2);

        state$.update((value) => value + 1);
        expect(state$.current).toBe(3);
    });

    test('subscribe to state updates: subscriber receives current value immediately', () => {
        const state$ = createState(0);
        const subscriber1 = {
            next: jest.fn()
        };
        const subscriber2 = {
            next: jest.fn()
        };

        state$.subscribe(subscriber1);
        expect(subscriber1.next).toHaveBeenCalledTimes(1);
        expect(subscriber1.next).toHaveBeenNthCalledWith(1, 0);

        state$.update((value) => value + 1);
        state$.update((value) => value + 1);
        state$.update((value) => value + 1);

        state$.subscribe(subscriber2);
        expect(subscriber2.next).toHaveBeenCalledTimes(1);
        expect(subscriber2.next).toHaveBeenNthCalledWith(1, 3);
    });

    test('subscribe to state updates: subscriber receives all updates', () => {
        const state$ = createState(0);
        const subscriber = {
            next: jest.fn()
        };

        state$.subscribe(subscriber);
        state$.update((value) => value + 1);
        state$.update((value) => value + 1);
        state$.update((value) => value + 1);

        expect(subscriber.next).toHaveBeenCalledTimes(4);
        expect(subscriber.next).toHaveBeenNthCalledWith(1, 0);
        expect(subscriber.next).toHaveBeenNthCalledWith(2, 1);
        expect(subscriber.next).toHaveBeenNthCalledWith(3, 2);
        expect(subscriber.next).toHaveBeenNthCalledWith(4, 3);
    });
});
