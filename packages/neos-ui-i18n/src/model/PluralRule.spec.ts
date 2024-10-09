/*
 * This file is part of the Neos.Neos.Ui package.
 *
 * (c) Contributors of the Neos Project - www.neos.io
 *
 * This package is Open Source Software. For the full copyright and license
 * information, please view the LICENSE file which was distributed with this
 * source code.
 */
import {PluralRule, InvalidPluralRule} from './PluralRule';

describe('PluralRule', () => {
    it('can be created from string', () => {
        expect(PluralRule.fromString('zero'))
            .toBe(PluralRule.ZERO);
        expect(PluralRule.fromString('one'))
            .toBe(PluralRule.ONE);
        expect(PluralRule.fromString('two'))
            .toBe(PluralRule.TWO);
        expect(PluralRule.fromString('few'))
            .toBe(PluralRule.FEW);
        expect(PluralRule.fromString('many'))
            .toBe(PluralRule.MANY);
        expect(PluralRule.fromString('other'))
            .toBe(PluralRule.OTHER);
    });

    it('throws when attempted to be created from an empty string', () => {
        expect(() => PluralRule.fromString(''))
            .toThrow(InvalidPluralRule.becauseItIsEmpty());
    });

    it('throws when attempted to be created from an invalid string', () => {
        expect(() => PluralRule.fromString('does-not-exist'))
            .toThrow(InvalidPluralRule.becauseItIsUnknown('does-not-exist'));
        expect(() => PluralRule.fromString('ZeRo'))
            .toThrow(InvalidPluralRule.becauseItIsUnknown('ZeRo'));
    });
});
