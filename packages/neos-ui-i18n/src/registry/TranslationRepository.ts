/*
 * This file is part of the Neos.Neos.Ui package.
 *
 * (c) Contributors of the Neos Project - www.neos.io
 *
 * This package is Open Source Software. For the full copyright and license
 * information, please view the LICENSE file which was distributed with this
 * source code.
 */
import {
    Locale,
    Translation,
    TranslationDTO,
    type TranslationAddress
} from '../model';

export type TranslationsDTO = Record<string, Record<string, Record<string, TranslationDTO>>>;

export class TranslationRepository {
    private _translationsByAddress: Record<string, null | Translation> = {};

    private constructor(
        private readonly locale: Locale,
        private readonly translations: TranslationsDTO
    ) {}

    public static fromDTO = (locale: Locale, translations: TranslationsDTO): TranslationRepository =>
        new TranslationRepository(locale, translations);

    public findOneByAddress(address: TranslationAddress): null | Translation {
        if (address.fullyQualified in this._translationsByAddress) {
            return this._translationsByAddress[address.fullyQualified];
        }

        const [packageKey, sourceName, id] = [address.packageKey, address.sourceName, address.id]
            // Replace all dots with underscores
            .map(s => s ? s.replace(/\./g, '_') : '')

        const translationDTO = this.translations[packageKey]?.[sourceName]?.[id] ?? null;
        const translation = translationDTO
            ? Translation.fromDTO(this.locale, translationDTO)
            : null;
        this._translationsByAddress[address.fullyQualified] = translation;

        return translation;
    }
}
