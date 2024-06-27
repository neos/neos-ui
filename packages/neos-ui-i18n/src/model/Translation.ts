/*
 * This file is part of the Neos.Neos.Ui package.
 *
 * (c) Contributors of the Neos Project - www.neos.io
 *
 * This package is Open Source Software. For the full copyright and license
 * information, please view the LICENSE file which was distributed with this
 * source code.
 */

import type {Parameters} from '../registry/Parameters';
import {substitutePlaceholders} from '../registry/substitutePlaceholders';

import {Locale} from './Locale';

export type TranslationDTO = string | TranslationDTOTuple;
type TranslationDTOTuple = string[] | Record<number, string>;

export class Translation {
    private constructor(
        private readonly locale: Locale,
        private readonly value: string[]
    ) {
    }

    public static fromDTO = (locale: Locale, dto: TranslationDTO): Translation =>
        dto instanceof Object
            ? Translation.fromTuple(locale, dto)
            : Translation.fromString(locale, dto);

    private static fromTuple = (locale: Locale, tuple: TranslationDTOTuple): Translation =>
        new Translation(locale, Object.values(tuple));

    private static fromString = (locale: Locale, string: string): Translation =>
        new Translation(locale, [string]);

    public render(parameters: undefined | Parameters, quantity: number): string {
        return parameters
            ? substitutePlaceholders(this.byQuantity(quantity), parameters)
            : this.byQuantity(quantity);
    }

    private byQuantity(quantity: number): string {
        const index = this.locale.getPluralFormIndexForQuantity(quantity);

        return this.value[index] ?? this.value[0] ?? '';
    }
}
