/*
 * This file is part of the Neos.Neos.Ui package.
 *
 * (c) Contributors of the Neos Project - www.neos.io
 *
 * This package is Open Source Software. For the full copyright and license
 * information, please view the LICENSE file which was distributed with this
 * source code.
 */
import {createChannel} from './Channel';

describe('Channel', () => {
    test('subscribe to channel updates: subscriber receives all updates', () => {
        const channel$ = createChannel();
        const subscriber = {
            next: jest.fn()
        };

        channel$.subscribe(subscriber);
        channel$.next(1);
        channel$.next(2);
        channel$.next(3);

        expect(subscriber.next).toHaveBeenCalledTimes(3);
        expect(subscriber.next).toHaveBeenNthCalledWith(1, 1);
        expect(subscriber.next).toHaveBeenNthCalledWith(2, 2);
        expect(subscriber.next).toHaveBeenNthCalledWith(3, 3);
    });

    test('subscribe to channel updates: subscriber receives only new values', () => {
        const channel$ = createChannel();
        const subscriber1 = {
            next: jest.fn()
        };
        const subscriber2 = {
            next: jest.fn()
        };

        channel$.subscribe(subscriber1);
        expect(subscriber1.next).toHaveBeenCalledTimes(0);

        channel$.next(1);
        expect(subscriber1.next).toHaveBeenCalledTimes(1);
        expect(subscriber1.next).toHaveBeenNthCalledWith(1, 1);

        channel$.subscribe(subscriber2);
        expect(subscriber2.next).toHaveBeenCalledTimes(0);

        channel$.next(2);
        expect(subscriber1.next).toHaveBeenCalledTimes(2);
        expect(subscriber1.next).toHaveBeenNthCalledWith(2, 2);

        expect(subscriber2.next).toHaveBeenCalledTimes(1);
        expect(subscriber2.next).toHaveBeenNthCalledWith(1, 2);
    });
});
