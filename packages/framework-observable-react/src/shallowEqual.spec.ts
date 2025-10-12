
import {shallowEqual} from './shallowEqual';

describe('shallowEqual', () => {
    const PRIMITIVE_VALUES = [
        123,
        'foo',
        NaN,
        0,
        true
    ] as const;

    test('compare simple primitive values', () => {
        expect(shallowEqual(null, null)).toBe(true);
        for (const primitiveValue of PRIMITIVE_VALUES) {
            expect(shallowEqual(primitiveValue, primitiveValue)).toBe(true);
            expect(shallowEqual(primitiveValue, 'not in set')).toBe(false);
            expect(shallowEqual(primitiveValue, 42)).toBe(false);
            expect(shallowEqual(primitiveValue, false)).toBe(false);
        }
    });

    test('compare new array references with first level primitive values', () => {
        expect(shallowEqual([true], ['a string'])).toBe(false);
        expect(shallowEqual([true], [true, 'a string'])).toBe(false);
        expect(shallowEqual([true, 1], [true, 'a string'])).toBe(false);

        for (const primitiveValue of PRIMITIVE_VALUES) {
            expect(shallowEqual([primitiveValue], [primitiveValue])).toBe(true);
        }
    });

    test('compare new object references with first level primitive values', () => {
        expect(shallowEqual(null, {})).toBe(false);
        expect(shallowEqual({}, {})).toBe(true);
        expect(shallowEqual({valueA: true}, {valueA: 'a string'})).toBe(false);
        expect(shallowEqual({valueA: true}, {valueA: true, valueB: 'a string'})).toBe(false);
        expect(shallowEqual({valueA: true, valueB: 'a string'}, {valueA: true})).toBe(false);
        expect(shallowEqual({valueA: true, valueB: 1}, {valueA: true, valueB: 'a string'})).toBe(false);

        for (const primitiveValue of PRIMITIVE_VALUES) {
            expect(shallowEqual({valueA: primitiveValue}, {valueA: primitiveValue})).toBe(true);
        }
    });

    test('compare new object references with deep same reference object values', () => {
        const SOME_REUSED_OBJECT = {
            name: 'sun',
            smile: {
                type: 'kind',
                big: true
            }
        };

        expect(shallowEqual({valueA: SOME_REUSED_OBJECT}, {valueA: SOME_REUSED_OBJECT})).toBe(true);
        expect(shallowEqual({valueA: {nested: SOME_REUSED_OBJECT}}, {valueA: {nested: SOME_REUSED_OBJECT}})).toBe(false);
    });
});
