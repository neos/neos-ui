/*
 * This file is part of the Neos.Neos.Ui package.
 *
 * (c) Contributors of the Neos Project - www.neos.io
 *
 * This package is Open Source Software. For the full copyright and license
 * information, please view the LICENSE file which was distributed with this
 * source code.
 */

/**
 * Plural case as per Unicode CLDR:
 * https://cldr.unicode.org/index/cldr-spec/plural-rules
 */
export class PluralRule {
    private constructor(public readonly value: string) {}

    public static readonly ZERO = new PluralRule('zero');

    public static readonly ONE = new PluralRule('one');

    public static readonly TWO = new PluralRule('two');

    public static readonly FEW = new PluralRule('few');

    public static readonly MANY = new PluralRule('many');

    public static readonly OTHER = new PluralRule('other');

    public static fromString = (string: string): PluralRule => {
        if (string === '') {
            throw InvalidPluralRule.becauseItIsEmpty();
        }

        switch (string) {
            case 'zero':
                return PluralRule.ZERO;
            case 'one':
                return PluralRule.ONE;
            case 'two':
                return PluralRule.TWO;
            case 'few':
                return PluralRule.FEW;
            case 'many':
                return PluralRule.MANY;
            case 'other':
                return PluralRule.OTHER;
            default:
                throw InvalidPluralRule.becauseItIsUnknown(string);
        }
    }
}

export class InvalidPluralRule extends Error {
    private constructor(message: string) {
        super(message);
    }

    public static becauseItIsEmpty = (): InvalidPluralRule =>
        new InvalidPluralRule(`PluralRule must be one of "zero", "one", "two", "few", "many"
or "other", but was empty.`);

    public static becauseItIsUnknown = (attemptedString: string): InvalidPluralRule =>
        new InvalidPluralRule(`PluralRule must be one of "zero", "one", "two", "few", "many"
or "other". Got "${attemptedString}" instead.`);
}
