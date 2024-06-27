/*
 * This file is part of the Neos.Neos.Ui package.
 *
 * (c) Contributors of the Neos Project - www.neos.io
 *
 * This package is Open Source Software. For the full copyright and license
 * information, please view the LICENSE file which was distributed with this
 * source code.
 */
import {requireGlobals} from './global';
import {TranslationAddress} from './model';
import {substitutePlaceholders} from './registry';

/**
 * Retrieves a the translation string that is identified by the given fully
 * qualified translation address (a string following the pattern
 * "{Package.Key:SourceName:actual.trans.unit.id}"), then the translation will
 * be looked up in the respective package and *.xlf file.
 *
 * If no translation string can be found for the given address, the given
 * fallback value will be returned.
 *
 * If a translation string was found and it contains substition placeholders
 * (e.g.: "{0}", or "{somePlaceholder}"), the placeholders will be replaced
 * with the corresponding values that were passed as parameters.
 *
 * Optionally, a quantity can be provided, which will then be used to determine
 * a plural version of the translation string, within the plural rules set
 * within the currently registered locale.
 *
 * @api
 * @param {string} fullyQualifiedTranslationAddressAsString The translation address
 * @param {string | [string, string]} fallback The string that shall be displayed, when no translation string could be found. If a tuple of two values is given, the first value will be treated as the singular, the second value as the plural form.
 * @param {(string | number)[] | Record<string, string | number>} [parameters] The values to replace substitution placeholders with in the translation string
 * @param {quantity} [quantity] The key of the package in which to look for the translation file
 */
export function translate(
    fullyQualifiedTranslationAddressAsString: string,
    fallback: string | [string, string],
    parameters: (string | number)[] | Record<string, string | number> = [],
    quantity: number = 0
): string {
    const {translationRepository} = requireGlobals();
    const translationAddress = TranslationAddress.fromString(fullyQualifiedTranslationAddressAsString);
    const translation = translationRepository.findOneByAddress(translationAddress);

    if (translation === null) {
        return renderFallback(fallback, quantity, parameters);
    }

    return translation.render(parameters, quantity);
}

function renderFallback(
    fallback: string | [string, string],
    quantity: number,
    parameters: (string | number)[] | Record<string, string | number>
) {
    const fallbackHasPluralForms = Array.isArray(fallback);
    let result: string;
    if (fallbackHasPluralForms) {
        result = quantity === 1 ? fallback[0] : fallback[1];
    } else {
        result = fallback;
    }

    return substitutePlaceholders(result, parameters);
}
