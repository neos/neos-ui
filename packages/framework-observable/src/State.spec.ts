/*
 * This file is part of the Neos.Neos.Ui package.
 *
 * (c) Contributors of the Neos Project - www.neos.io
 *
 * This package is Open Source Software. For the full copyright and license
 * information, please view the LICENSE file which was distributed with this
 * source code.
 */
import {createState, mapState, pickState} from './State';

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


describe('Mapped State', () => {
    test('map from filled object value', () => {
        const state$ = createState<{a: number}>({a: 0});

        const mappedState$ = mapState(state$, (state) => state.a);

        expect(state$.current).toEqual({a: 0});
        expect(mappedState$.current).toEqual(0);

        state$.update((value) => ({ a: value.a + 1 }));
        expect(state$.current).toEqual({ a: 1 });
        expect(mappedState$.current).toEqual(1);

        state$.update((value) => ({ a: value.a + 1 }));
        expect(state$.current).toEqual({ a: 2 });
        expect(mappedState$.current).toEqual(2);

        state$.update((value) => ({ a: value.a + 1 }));
        expect(state$.current).toEqual({ a: 3 });
        expect(mappedState$.current).toEqual(3);
    });

    test('subscribe to mapped state updates: subscriber receives current value immediately', () => {
        const state$ = createState<{a: number}>({a: 0});

        const mappedState$ = mapState(state$, (state) => state.a);

        const subscriber1 = {
            next: jest.fn()
        };
        const subscriber2 = {
            next: jest.fn()
        };

        mappedState$.subscribe(subscriber1);
        expect(subscriber1.next).toHaveBeenCalledTimes(1);
        expect(subscriber1.next).toHaveBeenNthCalledWith(1, 0);

        state$.update((value) => ({a: value.a + 1}));
        state$.update((value) => ({a: value.a + 1}));
        state$.update((value) => ({a: value.a + 1}));

        mappedState$.subscribe(subscriber2);
        expect(subscriber2.next).toHaveBeenCalledTimes(1);
        expect(subscriber2.next).toHaveBeenNthCalledWith(1, 3);
    });

    test('subscribe to picked state updates: subscriber receives all updates', () => {
        const state$ = createState<{a: number}>({a: 0});

        const mappedState$ = mapState(state$, (state) => state.a);

        const subscriber = {
            next: jest.fn()
        };

        mappedState$.subscribe(subscriber);
        state$.update((value) => ({a: value.a + 1}));
        state$.update((value) => ({a: value.a + 1}));
        state$.update((value) => ({a: value.a + 1}));

        expect(subscriber.next).toHaveBeenCalledTimes(4);
        expect(subscriber.next).toHaveBeenNthCalledWith(1, 0);
        expect(subscriber.next).toHaveBeenNthCalledWith(2, 1);
        expect(subscriber.next).toHaveBeenNthCalledWith(3, 2);
        expect(subscriber.next).toHaveBeenNthCalledWith(4, 3);
    });
});

describe('Picked State', () => {
    test('constraints: pick from non object value', () => {
        const number$ = createState(0);

        // @ts-ignore
        expect(() => pickState(number$, 'a')).toThrow('Cannot pick key "a" from non object value of type number');

        const null$ = createState(null);

        // @ts-ignore
        expect(() => pickState(null$, 'a')).toThrow('Cannot pick key "a" from non object value of type null');


        const list$ = createState([]);

        // @ts-ignore
        expect(() => pickState(list$, 'a')).toThrow('Cannot pick key "a" from non object value of type array');
    });

    test('constraints: pick from object value and set from outside to non object', () => {
        const numberOrObject$ = createState<{a?: number} | number>({});

        // @ts-expect-error typing already prevents this case but we test this for there is lots of untyped code
        const pickedState$ = pickState(numberOrObject$, 'a');
        expect(pickedState$.current).toEqual(undefined);

        // todo
        numberOrObject$.update(() => 0);
    });

    test('pick from initially empty object value', () => {
        const state$ = createState<{a?: number}>({});

        const pickedState$ = pickState(state$, 'a');

        expect(state$.current).toEqual({});
        expect(pickedState$.current).toEqual(undefined);

        state$.update((value) => ({ a: (value.a ?? 0) + 1 }));
        expect(state$.current).toEqual({ a: 1 });
        expect(pickedState$.current).toEqual(1);

        pickedState$.update((value) => (value ?? 0) + 1);
        expect(state$.current).toEqual({ a: 2 });
        expect(pickedState$.current).toEqual(2);

        state$.update((value) => ({ a: (value.a ?? 0) + 1 }));
        expect(state$.current).toEqual({ a: 3 });
        expect(pickedState$.current).toEqual(3);

        pickedState$.update((value) => (value ?? 0) + 1);
        expect(state$.current).toEqual({ a: 4 });
        expect(pickedState$.current).toEqual(4);
    });

    test('pick from initially filled object value', () => {
        const state$ = createState<{a: number}>({a: 0});

        const pickedState$ = pickState(state$, 'a');

        expect(state$.current).toEqual({a: 0});
        expect(pickedState$.current).toEqual(0);

        state$.update((value) => ({ a: value.a + 1 }));
        expect(state$.current).toEqual({ a: 1 });
        expect(pickedState$.current).toEqual(1);

        pickedState$.update((value) => value + 1);
        expect(state$.current).toEqual({ a: 2 });
        expect(pickedState$.current).toEqual(2);

        state$.update((value) => ({ a: value.a + 1 }));
        expect(state$.current).toEqual({ a: 3 });
        expect(pickedState$.current).toEqual(3);

        pickedState$.update((value) => value + 1);
        expect(state$.current).toEqual({ a: 4 });
        expect(pickedState$.current).toEqual(4);
    });

    test('subscribe to picked state updates: subscriber receives current value immediately', () => {
        const state$ = createState<{a: number}>({a: 0});

        const pickedState$ = pickState(state$, 'a');

        const subscriber1 = {
            next: jest.fn()
        };
        const subscriber2 = {
            next: jest.fn()
        };

        pickedState$.subscribe(subscriber1);
        expect(subscriber1.next).toHaveBeenCalledTimes(1);
        expect(subscriber1.next).toHaveBeenNthCalledWith(1, 0);

        pickedState$.update((value) => value + 1);
        // from outside
        state$.update((value) => ({a: value.a + 1}));
        pickedState$.update((value) => value + 1);

        pickedState$.subscribe(subscriber2);
        expect(subscriber2.next).toHaveBeenCalledTimes(1);
        expect(subscriber2.next).toHaveBeenNthCalledWith(1, 3);
    });

    test('subscribe to picked state updates: subscriber receives all updates', () => {
        const state$ = createState<{a: number}>({a: 0});

        const pickedState$ = pickState(state$, 'a');

        const subscriber = {
            next: jest.fn()
        };

        pickedState$.subscribe(subscriber);
        pickedState$.update((value) => value + 1);
        // from outside
        state$.update((value) => ({a: value.a + 1}));
        pickedState$.update((value) => value + 1);

        expect(subscriber.next).toHaveBeenCalledTimes(4);
        expect(subscriber.next).toHaveBeenNthCalledWith(1, 0);
        expect(subscriber.next).toHaveBeenNthCalledWith(2, 1);
        expect(subscriber.next).toHaveBeenNthCalledWith(3, 2);
        expect(subscriber.next).toHaveBeenNthCalledWith(4, 3);
    });

    test('subscribe to picked state updates: subscriber ignores other state updates', () => {
        const state$ = createState<{a: number, b: number}>({a: 0, b: 0});

        const pickedState$ = pickState(state$, 'a');

        const subscriber = {
            next: jest.fn()
        };

        pickedState$.subscribe(subscriber);
        state$.update((value) => ({...value, b: value.b + 1}));

        expect(subscriber.next).toHaveBeenCalledTimes(1);
        expect(subscriber.next).toHaveBeenNthCalledWith(1, 0);
    });

    test('subscribe and unsubscribe and resubscribe to picked state updates', () => {
        const state$ = createState<{a: number}>({a: 0});

        const pickedState$ = pickState(state$, 'a');

        const subscriber1 = {
            next: jest.fn()
        };
        const subscriber2 = {
            next: jest.fn()
        };

        const subscription1 = pickedState$.subscribe(subscriber1);

        pickedState$.update((value) => value + 1);
        expect(subscriber1.next).toHaveBeenCalledTimes(2);
        expect(subscriber1.next).toHaveBeenNthCalledWith(1, 0);
        expect(subscriber1.next).toHaveBeenNthCalledWith(2, 1);

        subscription1.unsubscribe();
        // update from outside when no one is listening
        state$.update((value) => ({a: value.a + 1}));
        expect(subscriber1.next).toHaveBeenCalledTimes(2);
        expect(pickedState$.current).toEqual(2);

        // resubscribe
        pickedState$.subscribe(subscriber2);
        pickedState$.update((value) => value + 1);

        expect(subscriber2.next).toHaveBeenCalledTimes(2);
        expect(subscriber2.next).toHaveBeenNthCalledWith(1, 2);
        expect(subscriber2.next).toHaveBeenNthCalledWith(2, 3);
    });
});
