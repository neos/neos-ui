/*
 * This file is part of the Neos.Neos.Ui package.
 *
 * (c) Contributors of the Neos Project - www.neos.io
 *
 * This package is Open Source Software. For the full copyright and license
 * information, please view the LICENSE file which was distributed with this
 * source code.
 */
import {InvalidLocale, Locale} from './Locale';
import {InvalidPluralRules} from './PluralRules';

describe('Locale', () => {
    it('throws when attempted to be created with invalid locale identifier', () => {
        expect(() => Locale.create('an invalid identifier', 'one,other'))
            .toThrow(InvalidLocale.becauseOfInvalidIdentifier('an invalid identifier'));
    });

    it('throws when attempted to be created with invalid plural forms', () => {
        expect(() => Locale.create('en-US', ''))
            .toThrow(InvalidLocale.becauseOfInvalidPluralRules('en-US', InvalidPluralRules.becauseTheyAreEmpty()));
    });

    describe('#getPluralFormIndexForQuantity', () => {
        it('provides the index for lookup of the correct plural form given a quantity', () => {
            const locale_en_US = Locale.create('en-US', 'one,other');
            const locale_ar_EG = Locale.create('ar-EG', 'zero,one,two,few,many');

            expect(locale_en_US.getPluralFormIndexForQuantity(0))
                .toBe(1);
            expect(locale_en_US.getPluralFormIndexForQuantity(1))
                .toBe(0);
            expect(locale_en_US.getPluralFormIndexForQuantity(2))
                .toBe(1);
            expect(locale_en_US.getPluralFormIndexForQuantity(3))
                .toBe(1);

            expect(locale_ar_EG.getPluralFormIndexForQuantity(0))
                .toBe(0);
            expect(locale_ar_EG.getPluralFormIndexForQuantity(1))
                .toBe(1);
            expect(locale_ar_EG.getPluralFormIndexForQuantity(2))
                .toBe(2);
            expect(locale_ar_EG.getPluralFormIndexForQuantity(6))
                .toBe(3);
            expect(locale_ar_EG.getPluralFormIndexForQuantity(18))
                .toBe(4);
        });
    });
});
