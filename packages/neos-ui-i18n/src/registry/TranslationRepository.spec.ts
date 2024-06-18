/*
 * This file is part of the Neos.Neos.Ui package.
 *
 * (c) Contributors of the Neos Project - www.neos.io
 *
 * This package is Open Source Software. For the full copyright and license
 * information, please view the LICENSE file which was distributed with this
 * source code.
 */
import {TranslationAddress} from './TranslationAddress';
import {Translation} from './Translation';
import {TranslationRepository} from './TranslationRepository';

describe('TranslationRepository', () => {
    it('can find a translation by its translationAddress', () => {
        const translationRepository = TranslationRepository.fromDTO({
            'Neos_Neos': { // eslint-disable-line quote-props
                'Main': { // eslint-disable-line quote-props
                    'someLabel': 'The Translation' // eslint-disable-line quote-props
                }
            }
        });
        const translationAddressThatCanBeFound = TranslationAddress.fromString('Neos.Neos:Main:someLabel');
        const translationAddressThatCannotBeFound = TranslationAddress.fromString('Vendor.Site:Main:someLabel');

        expect(translationRepository.findOneByAddress(translationAddressThatCannotBeFound))
            .toBeNull();
        expect(translationRepository.findOneByAddress(translationAddressThatCanBeFound))
            .toStrictEqual(Translation.fromDTO('The Translation'));
    });
});
