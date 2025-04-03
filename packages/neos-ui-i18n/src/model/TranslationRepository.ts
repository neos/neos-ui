/*
 * This file is part of the Neos.Neos.Ui package.
 *
 * (c) Contributors of the Neos Project - www.neos.io
 *
 * This package is Open Source Software. For the full copyright and license
 * information, please view the LICENSE file which was distributed with this
 * source code.
 */
import {Locale} from './Locale';
import {Translation, type TranslationDTO} from './Translation';
import type {TranslationAddress} from './TranslationAddress';

export type TranslationsDTO = Record<string, Record<string, Record<string, TranslationDTO>>>;

export class TranslationRepository {
    private translationsByAddress: Record<string, null | Translation> = {};

    private constructor(
        private readonly locale: Locale,
        private readonly translations: TranslationsDTO
    ) {}

    public static fromDTO = (locale: Locale, translations: TranslationsDTO): TranslationRepository =>
        new TranslationRepository(locale, translations);

    public findOneByAddress(address: TranslationAddress): null | Translation {
        if (address.fullyQualified in this.translationsByAddress) {
            return this.translationsByAddress[address.fullyQualified];
        }

        const [packageKey, sourceName, id] = [address.packageKey, address.sourceName, address.id]
            // Replace all dots with underscores
            .map(s => s ? s.replace(/\./g, '_') : '')

        const translationDTO = this.translations[packageKey]?.[sourceName]?.[id] ?? null;
        const translation = translationDTO
            ? Translation.fromDTO(this.locale, translationDTO)
            : null;
        this.translationsByAddress[address.fullyQualified] = translation;

        return translation;
    }
}
