/*
 * This file is part of the Neos.Neos.Ui package.
 *
 * (c) Contributors of the Neos Project - www.neos.io
 *
 * This package is Open Source Software. For the full copyright and license
 * information, please view the LICENSE file which was distributed with this
 * source code.
 */
import {createActionObservable} from './ActionObservable';

describe('ActionObservable', () => {
    test('subscribe to actionObservable updates: subscriber receives all updates', () => {
        const actionObservable$ = createActionObservable();
        const subscriber = {
            next: jest.fn()
        };

        actionObservable$.subscribe(subscriber);
        actionObservable$.next(1);
        actionObservable$.next(2);
        actionObservable$.next(3);

        expect(subscriber.next).toHaveBeenCalledTimes(3);
        expect(subscriber.next).toHaveBeenNthCalledWith(1, 1);
        expect(subscriber.next).toHaveBeenNthCalledWith(2, 2);
        expect(subscriber.next).toHaveBeenNthCalledWith(3, 3);
    });

    test('subscribe to actionObservable updates: subscriber receives only new values', () => {
        const actionObservable$ = createActionObservable();
        const subscriber1 = {
            next: jest.fn()
        };
        const subscriber2 = {
            next: jest.fn()
        };

        actionObservable$.subscribe(subscriber1);
        expect(subscriber1.next).toHaveBeenCalledTimes(0);

        actionObservable$.next(1);
        expect(subscriber1.next).toHaveBeenCalledTimes(1);
        expect(subscriber1.next).toHaveBeenNthCalledWith(1, 1);

        actionObservable$.subscribe(subscriber2);
        expect(subscriber2.next).toHaveBeenCalledTimes(0);

        actionObservable$.next(2);
        expect(subscriber1.next).toHaveBeenCalledTimes(2);
        expect(subscriber1.next).toHaveBeenNthCalledWith(2, 2);

        expect(subscriber2.next).toHaveBeenCalledTimes(1);
        expect(subscriber2.next).toHaveBeenNthCalledWith(1, 2);
    });
});
