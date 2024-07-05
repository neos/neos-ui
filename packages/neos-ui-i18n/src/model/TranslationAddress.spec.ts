/*
 * This file is part of the Neos.Neos.Ui package.
 *
 * (c) Contributors of the Neos Project - www.neos.io
 *
 * This package is Open Source Software. For the full copyright and license
 * information, please view the LICENSE file which was distributed with this
 * source code.
 */
import {TranslationAddress, TranslationAddressIsInvalid} from './TranslationAddress';

describe('TranslationAddress', () => {
    it('can be created from parts', () => {
        const translationAddress = TranslationAddress.create({
            id: 'some.transunit.id',
            sourceName: 'SomeSource',
            packageKey: 'Some.Package'
        });

        expect(translationAddress.id).toBe('some.transunit.id');
        expect(translationAddress.sourceName).toBe('SomeSource');
        expect(translationAddress.packageKey).toBe('Some.Package');
        expect(translationAddress.fullyQualified).toBe('Some.Package:SomeSource:some.transunit.id');
    });

    it('can be created from string', () => {
        const translationAddress = TranslationAddress.fromString(
            'Some.Package:SomeSource:some.transunit.id'
        );

        expect(translationAddress.id).toBe('some.transunit.id');
        expect(translationAddress.sourceName).toBe('SomeSource');
        expect(translationAddress.packageKey).toBe('Some.Package');
        expect(translationAddress.fullyQualified).toBe('Some.Package:SomeSource:some.transunit.id');
    });

    it('throws if given an invalid string', () => {
        expect(() => TranslationAddress.fromString('foo bar'))
            .toThrow(
                TranslationAddressIsInvalid
                    .becauseStringDoesNotAdhereToExpectedFormat('foo bar')
            );
    });
});
