import {tryDateFrom} from './helpers';

describe('tryDateFrom', () => {
    test('from empty string', () => {
        expect(tryDateFrom('')).toBe(undefined);
    });

    test('from undefined', () => {
        expect(tryDateFrom(undefined)).toBe(undefined);
    });

    test('from null', () => {
        expect(tryDateFrom(null)).toBe(undefined);
    });

    test('from date string', () => {
        expect(tryDateFrom('2023-02-23T00:00:00+00:00')).toBeInstanceOf(Date);
    });

    test('from string "now"', () => {
        expect(tryDateFrom('now')?.valueOf()).not.toBeNaN();
    });

    test('from Date', () => {
        expect(tryDateFrom(new Date())).toBeInstanceOf(Date);
    });
});
