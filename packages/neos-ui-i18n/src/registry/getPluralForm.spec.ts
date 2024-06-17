/*
 * This file is part of the Neos.Neos.Ui package.
 *
 * (c) Contributors of the Neos Project - www.neos.io
 *
 * This package is Open Source Software. For the full copyright and license
 * information, please view the LICENSE file which was distributed with this
 * source code.
 */
import {getPluralForm} from './getPluralForm';

describe('getPluralForm', () => {
    it('returns translation if translation has no plural form', () => {
        expect(getPluralForm('has no plural form'))
            .toBe('has no plural form');
        expect(getPluralForm('has no plural form', 0))
            .toBe('has no plural form');
        expect(getPluralForm('has no plural form', 1))
            .toBe('has no plural form');
        expect(getPluralForm('has no plural form', 2))
            .toBe('has no plural form');
        expect(getPluralForm('has no plural form', 42))
            .toBe('has no plural form');
    });

    it('returns singular if translation has plural form and quantity is one', () => {
        expect(getPluralForm(['has singular form', 'has plural form'], 1))
            .toBe('has singular form');
    });

    it('returns singular if translation has plural form and quantity is zero', () => {
        expect(getPluralForm(['has singular form', 'has plural form'], 0))
            .toBe('has singular form');
        expect(getPluralForm(['has singular form and default quantity is 0', 'has plural form and default quantity is 0']))
            .toBe('has singular form and default quantity is 0');
    });

    it('returns plural if translation has plural form and quantity greater than one', () => {
        expect(getPluralForm(['has singular form', 'has plural form'], 2))
            .toBe('has plural form');
        expect(getPluralForm(['has singular form', 'has plural form'], 42))
            .toBe('has plural form');
    });
});
