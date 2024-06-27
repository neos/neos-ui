/*
 * This file is part of the Neos.Neos.Ui package.
 *
 * (c) Contributors of the Neos Project - www.neos.io
 *
 * This package is Open Source Software. For the full copyright and license
 * information, please view the LICENSE file which was distributed with this
 * source code.
 */
import {Locale, TranslationRepository, type TranslationsDTO} from '../model';

import {setGlobals} from './globals';

/**
 * Sets up the application-wide globals for translation.
 *
 * You may use this function for setting up translations in a testing scenario.
 * Make sure to run teardownI18n to clean up the globals after your testing
 * scenario is finished.
 *
 * @param {string} localeIdentifier The locale identifier (e.g. "en-US")
 * @param {string} pluralRulesAsString Comma-separated list of plural rules (each one of: "zero", "one", "two", "few", "many" or "other")
 * @param {TranslationsDTO} translations The translations as provided by the /neos/xliff.json endpoint
 */
export function setupI18n(
    localeIdentifier: string,
    pluralRulesAsString: string,
    translations: TranslationsDTO
): void {
    const locale = Locale.create(localeIdentifier, pluralRulesAsString);
    const translationRepository = TranslationRepository.fromDTO(
        locale,
        translations
    );

    setGlobals({locale, translationRepository});
}
