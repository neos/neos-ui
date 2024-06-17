/*
 * This file is part of the Neos.Neos.Ui package.
 *
 * (c) Contributors of the Neos Project - www.neos.io
 *
 * This package is Open Source Software. For the full copyright and license
 * information, please view the LICENSE file which was distributed with this
 * source code.
 */
const TRANSLATION_ADDRESS_SEPARATOR = ':';

export class TranslationAddress {
    private constructor(
        public readonly id: string,
        public readonly sourceName: string,
        public readonly packageKey: string,
        public readonly fullyQualified: string
    ) {}

    public static create = (props: {
        id: string;
        sourceName: string;
        packageKey: string;
    }): TranslationAddress =>
        new TranslationAddress(props.id, props.sourceName, props.packageKey, `${props.packageKey}:${props.sourceName}:${props.id}`);

    public static fromString = (string: string): TranslationAddress => {
        const parts = string.split(TRANSLATION_ADDRESS_SEPARATOR);
        if (parts.length !== 3) {
            throw TranslationAddressIsInvalid
                .becauseStringDoesNotAdhereToExpectedFormat(string);
        }

        const [packageKey, sourceName, id] = parts;

        return new TranslationAddress(id, sourceName, packageKey, string);
    }
}

export class TranslationAddressIsInvalid extends Error {
    private constructor(message: string) {
        super(message);
    }

    public static becauseStringDoesNotAdhereToExpectedFormat(
        attemptedString: string
    ): TranslationAddressIsInvalid {
        return new TranslationAddressIsInvalid(
            `TranslationAddress must adhere to format "{packageKey}:{sourceName}:{transUnitId}". Got "${attemptedString}" instead.`
        );
    }
}
