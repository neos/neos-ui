/*
 * This file is part of the Neos.Neos.Ui package.
 *
 * (c) Contributors of the Neos Project - www.neos.io
 *
 * This package is Open Source Software. For the full copyright and license
 * information, please view the LICENSE file which was distributed with this
 * source code.
 */
import {Locale, registerLocale} from '../model';

import {TranslationAddress} from './TranslationAddress';
import {Translation} from './Translation';
import {
    TranslationRepository,
    TranslationRepositoryIsNotAvailable,
    TranslationsCannotBeRegistered,
    getTranslationRepository,
    registerTranslations,
    unregisterTranslations
} from './TranslationRepository';

describe('TranslationRepository', () => {
    const locale_en_US = Locale.create('en-US', 'one,other');

    it('can find a translation by its translation address', () => {
        const translationRepository = TranslationRepository.fromDTO(locale_en_US, {
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
            .toStrictEqual(Translation.fromDTO(locale_en_US, 'The Translation'));
    });

    describe('singleton', () => {
        test('getTranslationRepository throws if called before translations have been registered', () => {
            expect(() => getTranslationRepository())
                .toThrow(
                    TranslationRepositoryIsNotAvailable
                        .becauseTranslationsHaveNotBeenRegisteredYet()
                );
        });

        test('getTranslationRepository returns the singleton TranslationRepository instance after translations have been registered', () => {
            registerLocale('en-US', 'one,other');
            registerTranslations({
                'Neos_Neos': { // eslint-disable-line quote-props
                    'Main': { // eslint-disable-line quote-props
                        'someLabel': 'The Translation' // eslint-disable-line quote-props
                    }
                }
            });

            expect(getTranslationRepository())
                .toStrictEqual(
                    TranslationRepository.fromDTO(locale_en_US, {
                        'Neos_Neos': { // eslint-disable-line quote-props
                            'Main': { // eslint-disable-line quote-props
                                'someLabel': 'The Translation' // eslint-disable-line quote-props
                            }
                        }
                    })
                );

            expect(getTranslationRepository())
                .toBe(getTranslationRepository());
        });

        test('registerTranslations throws if called more than once', () => {
            expect(() => registerTranslations({
                'Neos_Neos': { // eslint-disable-line quote-props
                    'Main': { // eslint-disable-line quote-props
                        'someLabel': 'The Translation' // eslint-disable-line quote-props
                    }
                }
            })).toThrow(
                TranslationsCannotBeRegistered
                    .becauseTranslationsHaveAlreadyBeenRegistered()
            );
        });

        test('unregisterTranslations allows to run registerTranslations again for testing purposes', () => {
            unregisterTranslations();
            expect(() => registerTranslations({
                'Neos_Neos': { // eslint-disable-line quote-props
                    'Main': { // eslint-disable-line quote-props
                        'someLabel': 'The Translation' // eslint-disable-line quote-props
                    }
                }
            })).not.toThrow();
        });
    });
});
