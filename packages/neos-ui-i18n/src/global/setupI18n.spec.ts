/*
 * This file is part of the Neos.Neos.Ui package.
 *
 * (c) Contributors of the Neos Project - www.neos.io
 *
 * This package is Open Source Software. For the full copyright and license
 * information, please view the LICENSE file which was distributed with this
 * source code.
 */
import {Locale} from '../model';
import {TranslationRepository} from '../registry/TranslationRepository';
import {requireGlobals, unsetGlobals} from './globals';
import {setupI18n} from './setupI18n';

describe('setupI18n', () => {
    afterEach(() => {
        unsetGlobals();
    });

    it('registers a global locale and sets up a global translation repository', () => {
        setupI18n('en-US', 'one,other', {
            'Neos_Neos_Ui': {
                'Main': {
                    'trans-unit_id': 'Some Translation'
                }
            }
        });

        const {locale, translationRepository} = requireGlobals();

        expect(locale).toStrictEqual(Locale.create('en-US', 'one,other'));
        expect(translationRepository)
            .toStrictEqual(
                TranslationRepository.fromDTO(
                    Locale.create('en-US', 'one,other'),
                    {
                        'Neos_Neos_Ui': {
                            'Main': {
                                'trans-unit_id': 'Some Translation'
                            }
                        }
                    }
                )
            );
    });
});
