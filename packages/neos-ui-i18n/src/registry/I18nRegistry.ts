/*
 * This file is part of the Neos.Neos.Ui package.
 *
 * (c) Contributors of the Neos Project - www.neos.io
 *
 * This package is Open Source Software. For the full copyright and license
 * information, please view the LICENSE file which was distributed with this
 * source code.
 */
import {SynchronousRegistry} from '@neos-project/neos-ui-extensibility/src/registry';

import logger from '@neos-project/utils-logger';

import {getTranslationAddress} from './getTranslationAddress';
import {substitutePlaceholders} from './substitutePlaceholders';
import {getPluralForm} from './getPluralForm';
import type {TranslationUnit} from './TranslationUnit';
import type {TranslationAddress} from './TranslationAddress';
import type {TranslationsDTO} from './TranslationUnitRepository';

const errorCache: Record<string, boolean> = {};

type Parameters = (string | number)[] | Record<string, string | number>;

export default class I18nRegistry extends SynchronousRegistry<unknown> {
    private _translations: TranslationsDTO = {};

    /** @internal */
    setTranslations(translations: TranslationsDTO) {
        this._translations = translations;
    }

    /**
     * Retrieves a the translation string that is identified by the given
     * trans-unit id. If that id is a fully qualified trans-unit id (an id
     * following the pattern "{Package.Key:SourceName:actual.trans.unit.id}"),
     * then the translation will be looked up in the respective package and
     * *.xlf file. If it's just a simple trans-unit id, the translation will
     * be looked up in the "Main.xlf" file of the "Neos.Neos" package.
     *
     * If no translation string can be found for the given id, the fully
     * qualified trans-unit id will be returned.
     *
     * @param {string} transUnitIdOrFullyQualifiedTransUnitId A trans-unit id or a fully qualified trans-unit id
     */
    translate(transUnitIdOrFullyQualifiedTransUnitId: string): string;

    /**
     * Retrieves a the translation string that is identified by the given
     * trans-unit id. If that id is a fully qualified trans-unit id (an id
     * following the pattern "{Package.Key:SourceName:actual.trans.unit.id}"),
     * then the translation will be looked up in the respective package and
     * *.xlf file. If it's just a simple trans-unit id, the translation will
     * be looked up in the "Main.xlf" file of the "Neos.Neos" package.
     *
     * If no translation string can be found for the given id, the given
     * fallback value will be returned.
     *
     * @param {string} transUnitIdOrFullyQualifiedTransUnitId A trans-unit id or a fully qualified trans-unit id
     * @param {string} fallback The string that shall be displayed, when no translation string could be found.
     */
    translate(transUnitIdOrFullyQualifiedTransUnitId: string, fallback: string): string;

    /**
     * Retrieves a the translation string that is identified by the given
     * trans-unit id. If that id is a fully qualified trans-unit id (an id
     * following the pattern "{Package.Key:SourceName:actual.trans.unit.id}"),
     * then the translation will be looked up in the respective package and
     * *.xlf file. If it's just a simple trans-unit id, the translation will
     * be looked up in the "Main.xlf" file of the "Neos.Neos" package.
     *
     * If no translation string can be found for the given id, the given
     * fallback value will be returned. If no fallback value has been given,
     * the fully qualified trans-unit id will be returned.
     *
     * If a translation string was found and it contains substition placeholders
     * (e.g.: "{0}", or "{somePlaceholder}"), the placeholders will be replaced
     * with the corresponding values that were passed as parameters.
     *
     * @param {string} transUnitIdOrFullyQualifiedTransUnitId The fully qualified trans-unit id, that follows the format "{Package.Key:SourceName:trans.unit.id}"
     * @param {undefined|string} fallback The string that shall be displayed, when no translation string could be found.
     * @param {Parameters} parameters The values to replace substitution placeholders with in the translation string
     */
    translate(
        transUnitIdOrFullyQualifiedTransUnitId: string,
        fallback: undefined | string,
        parameters: Parameters
    ): string;

    /**
     * Retrieves a the translation string that is identified by the given
     * trans-unit id. The translation file will be looked up inside the package
     * identified by the given package key. The file itself will be the Main.xlf
     * in that package's resource translations.
     *
     * If no translation string can be found for the given id, the given fallback
     * value will be returned. If no fallback value has been given, the fully
     * qualified trans-unit id will be returned.
     *
     * If a translation string was found and it contains substition placeholders
     * (e.g.: "{0}", or "{somePlaceholder}"), the placeholders will be replaced
     * with the corresponding values that were passed as parameters.
     *
     * @param {string} transUnitId The trans-unit id
     * @param {undefined|string} fallback The string that shall be displayed, when no translation string could be found.
     * @param {Parameters} parameters The values to replace substitution placeholders with in the translation string
     * @param {string} packageKey The key of the package in which to look for the translation file
     */
    translate(
        transUnitId: string,
        fallback: undefined | string,
        parameters: undefined | Parameters,
        packageKey: string
    ): string;

    /**
     * Retrieves a the translation string that is identified by the given
     * trans-unit id. The translation file will be looked up inside the package
     * identified by the given package key. The file itself will be the *.xlf file
     * in that package's resource translations that is identified by the given
     * sourceName.
     *
     * If no translation string can be found for the given id, the given fallback
     * value will be returned. If no fallback value has been given, the fully
     * qualified trans-unit id will be returned.
     *
     * If a translation string was found and it contains substition placeholders
     * (e.g.: "{0}", or "{somePlaceholder}"), the placeholders will be replaced
     * with the corresponding values that were passed as parameters.
     *
     * @param {string} transUnitId The trans-unit id
     * @param {undefined|string} fallback The string that shall be displayed, when no translation string could be found.
     * @param {Parameters} parameters The values to replace substitution placeholders with in the translation string
     * @param {string} packageKey The key of the package in which to look for the translation file
     * @param {string} sourceName The name of the translation file in that package's resource translations
     */
    translate(
        transUnitId: string,
        fallback: undefined | string,
        parameters: undefined | Parameters,
        packageKey: string,
        sourceName: string
    ): string;

    /**
     * Retrieves a the translation string that is identified by the given
     * trans-unit id. The translation file will be looked up inside the package
     * identified by the given package key. The file itself will be the *.xlf file
     * in that package's resource translations that is identified by the given
     * sourceName.
     *
     * If no translation string can be found for the given id, the given fallback
     * value will be returned. If no fallback value has been given, the fully
     * qualified trans-unit id will be returned.
     *
     * If the provided quantity is greater than 1, and the found translation has a
     * plural form, then the plural form will be used. If the quantity equals 1
     * or is smaller than 1, the singular form will be used.
     *
     * If a translation string was found and it contains substition placeholders
     * (e.g.: "{0}", or "{somePlaceholder}"), the placeholders will be replaced
     * with the corresponding values that were passed as parameters.
     *
     * @param {string} transUnitId The trans-unit id
     * @param {undefined|string} fallback The string that shall be displayed, when no translation string could be found.
     * @param {Parameters} parameters The values to replace substitution placeholders with in the translation string
     * @param {string} packageKey The key of the package in which to look for the translation file
     * @param {string} sourceName The name of the translation file in that package's resource translations
     */
    translate(
        transUnitId: string,
        fallback: undefined | string,
        parameters: undefined | Parameters,
        packageKey: string,
        sourceName: string,
        quantity: number
    ): string;

    translate(
        transUnitIdOrFullyQualifiedTransUnitId: string,
        explicitlyProvidedFallback?: string,
        parameters?: Parameters,
        explicitlyProvidedPackageKey: string = 'Neos.Neos',
        explicitlyProvidedSourceName: string = 'Main',
        quantity: number = 0
    ) {
        const fallback = explicitlyProvidedFallback || transUnitIdOrFullyQualifiedTransUnitId;
        const translationAddess = getTranslationAddress(transUnitIdOrFullyQualifiedTransUnitId, explicitlyProvidedPackageKey, explicitlyProvidedSourceName);
        const translationUnit = this.getTranslationUnit(translationAddess);
        if (translationUnit === null) {
            this.logTranslationUnitNotFound(translationAddess, fallback);
            return fallback;
        }

        return parameters
            ? substitutePlaceholders(getPluralForm(translationUnit, quantity), parameters)
            : getPluralForm(translationUnit, quantity);
    }

    private logTranslationUnitNotFound(address: TranslationAddress, fallback: string) {
        if (!errorCache[address.fullyQualified]) {
            logger.error(`No translation found for id "${address.fullyQualified}" in:`, this._translations, `Using ${fallback} instead.`);
            errorCache[address.fullyQualified] = true;
        }
    }

    private getTranslationUnit(address: TranslationAddress): null | TranslationUnit {
        const [packageKey, sourceName, id] = [address.packageKey, address.sourceName, address.id]
            // Replace all dots with underscores
            .map(s => s ? s.replace(/\./g, '_') : '')

        return this._translations[packageKey]?.[sourceName]?.[id] ?? null;
    }
}
