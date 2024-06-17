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

export type TranslationUnitDTO = string | TranslationUnitDTOTuple;
type TranslationUnitDTOTuple = [string, string] | Record<number, string>;

export class TranslationUnit {
    private constructor(
        private readonly implementation:
            | TranslationUnitWithSingularFormOnly
            | TranslationUnitWithSingularAndPluralForm
    ) {
    }

    public static fromDTO = (dto: TranslationUnitDTO): TranslationUnit =>
        dto instanceof Object
            ? TranslationUnit.fromTuple(dto)
            : TranslationUnit.fromString(dto);

    private static fromTuple = (tuple: TranslationUnitDTOTuple): TranslationUnit =>
        new TranslationUnit(
            tuple[1] === undefined
                ? new TranslationUnitWithSingularFormOnly(tuple[0])
                : new TranslationUnitWithSingularAndPluralForm(tuple[0], tuple[1])
        );

    private static fromString = (string: string): TranslationUnit =>
        new TranslationUnit(
            new TranslationUnitWithSingularFormOnly(string)
        );

    public render(parameters: undefined | Parameters, quantity: number): string {
        return this.implementation.render(parameters, quantity);
    }
}

class TranslationUnitWithSingularFormOnly {
    public constructor(private readonly value: string) {}

    public render(parameters: undefined | Parameters): string {
        return parameters
            ? substitutePlaceholders(this.value, parameters)
            : this.value;
    }
}

class TranslationUnitWithSingularAndPluralForm {
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
