/*
 * This file is part of the Neos.Neos.Ui package.
 *
 * (c) Contributors of the Neos Project - www.neos.io
 *
 * This package is Open Source Software. For the full copyright and license
 * information, please view the LICENSE file which was distributed with this
 * source code.
 */
import {PluralRule} from './PluralRule';
import {InvalidPluralRules, PluralRules} from './PluralRules';

export class Locale {
    private readonly intlPluralRules: Intl.PluralRules;

    private constructor(
        private readonly intlLocale: Intl.Locale,
        private readonly pluralRules: PluralRules
    ) {
        this.intlPluralRules = new Intl.PluralRules(this.intlLocale.toString());
    }

    public static create = (identifier: string, pluralRulesAsString: string): Locale => {
        let intlLocale: Intl.Locale;
        try {
            intlLocale = new Intl.Locale(identifier)
        } catch {
            throw InvalidLocale.becauseOfInvalidIdentifier(identifier);
        }

        let pluralRules: PluralRules;
        try {
            pluralRules = PluralRules.fromString(pluralRulesAsString);
        } catch (error) {
            throw InvalidLocale.becauseOfInvalidPluralRules(
                identifier,
                error as InvalidPluralRules
            );
        }

        return new Locale(intlLocale, pluralRules);
    }

    public getPluralFormIndexForQuantity(quantity: number): number {
        return this.pluralRules.getIndexOf(
            PluralRule.fromString(
                this.intlPluralRules.select(quantity)
            )
        );
    }
}

export class InvalidLocale extends Error {
    private constructor(
        message: string,
        public readonly cause?: InvalidPluralRules
    ) {
        super(message);
    }

    public static becauseOfInvalidIdentifier = (attemptedIdentifier: string): InvalidLocale =>
        new InvalidLocale(`"${attemptedIdentifier}" is not a valid locale identifier. It must pass as a sole argument to new Intl.Locale(...). Please consult https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Locale for further information.`);

    public static becauseOfInvalidPluralRules = (identifier: string, cause: InvalidPluralRules): InvalidLocale =>
        new InvalidLocale(`Locale "${identifier}" could not be initialized because of invalid plural forms: ${cause.message}`, cause);
}

let locale: null | Locale = null;

/**
 * Registers the given locale globally for use throughout the application
 *
 * @internal For use in the Neos UI application bootstrapping process only!
 * @param {string} identifier
 * @param {string} pluralRulesAsString
 */
export function registerLocale(identifier: string, pluralRulesAsString: string): void {
    if (locale !== null) {
        throw LocaleCannotBeRegistered
            .becauseLocaleHasAlreadyBeenRegistered();
    }

    locale = Locale.create(identifier, pluralRulesAsString);
}

/**
 * Unregisters the currently globally registered locale (if there is any)
 *
 * @internal For testing purposes only!
 */
export function unregisterLocale(): void {
    locale = null;
}

export class LocaleCannotBeRegistered extends Error {
    private constructor(message: string) {
        super(`[Locale cannot be registered]: ${message}`);
    }

    public static becauseLocaleHasAlreadyBeenRegistered = () =>
        new LocaleCannotBeRegistered(
            'Locale can only be registered once, and has already been registered.'
        );
}

export function getLocale(): Locale {
    if (locale === null) {
        throw LocaleIsNotAvailable
            .becauseLocaleHasNotBeenRegisteredYet();
    }

    return locale;
}

export class LocaleIsNotAvailable extends Error {
    private constructor(message: string) {
        super(`[Locale is not available]: ${message}`);
    }

    public static becauseLocaleHasNotBeenRegisteredYet = () =>
        new LocaleIsNotAvailable(
            'Locale has not been registered yet. Make sure to call'
             + ' `registerLocale` during the application bootstrapping process.'
        );
}
