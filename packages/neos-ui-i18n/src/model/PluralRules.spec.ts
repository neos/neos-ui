/*
 * This file is part of the Neos.Neos.Ui package.
 *
 * (c) Contributors of the Neos Project - www.neos.io
 *
 * This package is Open Source Software. For the full copyright and license
 * information, please view the LICENSE file which was distributed with this
 * source code.
 */
import {InvalidPluralRule, PluralRule} from './PluralRule';
import {InvalidPluralRules, PluralRules} from './PluralRules';

describe('PluralRules', () => {
    it('can be created from string', () => {
        expect(PluralRules.fromString('one,other'))
            .toStrictEqual(PluralRules.of(PluralRule.ONE, PluralRule.OTHER));

        expect(PluralRules.fromString('one,two,few,many,other'))
            .toStrictEqual(PluralRules.of(PluralRule.ONE, PluralRule.TWO, PluralRule.FEW, PluralRule.MANY, PluralRule.OTHER));
    });

    it('throws when attempted to be created from an empty string', () => {
        expect(() => PluralRules.fromString(''))
            .toThrow(InvalidPluralRules.becauseTheyAreEmpty());
    });

    it('throws when attempted to be created from an invalid string', () => {
        expect(() => PluralRules.fromString(',,,'))
            .toThrow(InvalidPluralRules.becauseOfInvalidPluralRule(0, InvalidPluralRule.becauseItIsEmpty()));
        expect(() => PluralRules.fromString('one,two,twenty,other'))
            .toThrow(InvalidPluralRules.becauseOfInvalidPluralRule(2, InvalidPluralRule.becauseItIsUnknown('twenty')));
    });

    describe('#getIndexOf', () => {
        it('returns the index of the given plural case', () => {
            const pluralRules = PluralRules.fromString('one,two,few,many,other');

            expect(pluralRules.getIndexOf(PluralRule.ONE))
                .toBe(0);
            expect(pluralRules.getIndexOf(PluralRule.TWO))
                .toBe(1);
            expect(pluralRules.getIndexOf(PluralRule.FEW))
                .toBe(2);
            expect(pluralRules.getIndexOf(PluralRule.MANY))
                .toBe(3);
            expect(pluralRules.getIndexOf(PluralRule.OTHER))
                .toBe(4);
        });
    })
});
