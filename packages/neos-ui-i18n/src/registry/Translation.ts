/*
 * This file is part of the Neos.Neos.Ui package.
 *
 * (c) Contributors of the Neos Project - www.neos.io
 *
 * This package is Open Source Software. For the full copyright and license
 * information, please view the LICENSE file which was distributed with this
 * source code.
 */
import type {Parameters} from './Parameters';
import {substitutePlaceholders} from './substitutePlaceholders';

export type TranslationDTO = string | TranslationDTOTuple;
type TranslationDTOTuple = [string, string] | Record<number, string>;

export class Translation {
    private constructor(
        private readonly implementation:
            | TranslationWithSingularFormOnly
            | TranslationWithSingularAndPluralForm
    ) {
    }

    public static fromDTO = (dto: TranslationDTO): Translation =>
        dto instanceof Object
            ? Translation.fromTuple(dto)
            : Translation.fromString(dto);

    private static fromTuple = (tuple: TranslationDTOTuple): Translation =>
        new Translation(
            tuple[1] === undefined
                ? new TranslationWithSingularFormOnly(tuple[0])
                : new TranslationWithSingularAndPluralForm(tuple[0], tuple[1])
        );

    private static fromString = (string: string): Translation =>
        new Translation(
            new TranslationWithSingularFormOnly(string)
        );

    public render(parameters: undefined | Parameters, quantity: number): string {
        return this.implementation.render(parameters, quantity);
    }
}

class TranslationWithSingularFormOnly {
    public constructor(private readonly value: string) {}

    public render(parameters: undefined | Parameters): string {
        return parameters
            ? substitutePlaceholders(this.value, parameters)
            : this.value;
    }
}

class TranslationWithSingularAndPluralForm {
    public constructor(
        private readonly singular: string,
        private readonly plural: string
    ) {}

    public render(parameters: undefined | Parameters, quantity: number): string {
        return parameters
            ? substitutePlaceholders(this.byQuantity(quantity), parameters)
            : this.byQuantity(quantity);
    }

    private byQuantity(quantity: number): string {
        return quantity <= 1 ? this.singular : this.plural;
    }
}
