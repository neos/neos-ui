/*
 * This file is part of the Neos.Neos.Ui package.
 *
 * (c) Contributors of the Neos Project - www.neos.io
 *
 * This package is Open Source Software. For the full copyright and license
 * information, please view the LICENSE file which was distributed with this
 * source code.
 */
import type {TranslationAddress} from './TranslationAddress';
import type {TranslationUnit} from './TranslationUnit';

export type TranslationsDTO = Record<string, Record<string, Record<string, TranslationUnit>>>;

export class TranslationUnitRepository {
    private _translationUnitsByAddress: Record<string, TranslationUnit> = {};

    private constructor(private readonly translations: TranslationsDTO) {}

    public static fromDTO = (translations: TranslationsDTO): TranslationUnitRepository =>
        new TranslationUnitRepository(translations);

    public findOneByAddress = (address: TranslationAddress): null | TranslationUnit => {
        if (address.fullyQualified in this._translationUnitsByAddress) {
            return this._translationUnitsByAddress[address.fullyQualified];
        }

        const [packageKey, sourceName, id] = [address.packageKey, address.sourceName, address.id]
            // Replace all dots with underscores
            .map(s => s ? s.replace(/\./g, '_') : '')

        const translationUnit = this.translations[packageKey]?.[sourceName]?.[id] ?? null;
        this._translationUnitsByAddress[address.fullyQualified] = translationUnit;

        return translationUnit;
    }
}
