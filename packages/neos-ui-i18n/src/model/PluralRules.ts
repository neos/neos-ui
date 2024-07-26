/*
 * This file is part of the Neos.Neos.Ui package.
 *
 * (c) Contributors of the Neos Project - www.neos.io
 *
 * This package is Open Source Software. For the full copyright and license
 * information, please view the LICENSE file which was distributed with this
 * source code.
 */

import {InvalidPluralRule, PluralRule} from './PluralRule';

/**
 * A list of plural cases
 * @internal
 */
export class PluralRules {
    private constructor(public readonly value: PluralRule[]) {}

    public static of = (...cases: PluralRule[]) =>
        new PluralRules(cases);

    public static fromString = (string: string): PluralRules => {
        if (string === '') {
            throw InvalidPluralRules.becauseTheyAreEmpty();
        }

        return new PluralRules(string.split(',').map((string, index) => {
            try {
                return PluralRule.fromString(string)
            } catch (error) {
                throw InvalidPluralRules.becauseOfInvalidPluralRule(index, error as InvalidPluralRule);
            }
        }));
    }

    public getIndexOf(pluralRule: PluralRule): number {
        return this.value.indexOf(pluralRule);
    }
}

export class InvalidPluralRules extends Error {
    private constructor(message: string, public readonly cause?: InvalidPluralRule) {
        super(message);
    }

    public static becauseTheyAreEmpty = (): InvalidPluralRules =>
        new InvalidPluralRules(`PluralRules must not be empty, but were.`);

    public static becauseOfInvalidPluralRule = (index: number, cause: InvalidPluralRule): InvalidPluralRules =>
        new InvalidPluralRules(`PluralRules contain invalid value at index ${index}: ${cause.message}`, cause);
}
