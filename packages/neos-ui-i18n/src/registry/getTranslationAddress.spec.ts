/*
 * This file is part of the Neos.Neos.Ui package.
 *
 * (c) Contributors of the Neos Project - www.neos.io
 *
 * This package is Open Source Software. For the full copyright and license
 * information, please view the LICENSE file which was distributed with this
 * source code.
 */
import {getTranslationAddress} from './getTranslationAddress';

describe('getTranslationAddress', () => {
    it('provides a translation address tuple if given a single string as parameter', () => {
        const [packageKey, sourceName, id] = getTranslationAddress(
            'Some.Package:SomeSource:some.transunit.id'
        );

        expect(id).toBe('some.transunit.id');
        expect(sourceName).toBe('SomeSource');
        expect(packageKey).toBe('Some.Package');
    });

    it('provides a translation address tuple if given three separate parameters', () => {
        const [packageKey, sourceName, id] = getTranslationAddress(
            'some.transunit.id',
            'Some.Package',
            'SomeSource'
        );

        expect(id).toBe('some.transunit.id');
        expect(sourceName).toBe('SomeSource');
        expect(packageKey).toBe('Some.Package');
    });
});
