/*
 * This file is part of the Neos.Neos.Ui package.
 *
 * (c) Contributors of the Neos Project - www.neos.io
 *
 * This package is Open Source Software. For the full copyright and license
 * information, please view the LICENSE file which was distributed with this
 * source code.
 */
import {Locale, TranslationRepository} from '../model';

export const globals = {
    current: null as null | {
        locale: Locale;
        translationRepository: TranslationRepository;
    }
};

export function requireGlobals(): NonNullable<(typeof globals)['current']> {
    if (globals.current === null) {
        throw GlobalsRuntimeContraintViolation
            .becauseGlobalsWereRequiredButHaveNotBeenSetYet();
    }

    return globals.current;
}

export function setGlobals(value: NonNullable<(typeof globals)['current']>) {
    if (globals.current === null) {
        globals.current = value;
        return;
    }

    throw GlobalsRuntimeContraintViolation
        .becauseGlobalsWereAttemptedToBeSetMoreThanOnce();
}

export function unsetGlobals() {
    globals.current = null;
}

export class GlobalsRuntimeContraintViolation extends Error {
    private constructor(message: string) {
        super(message);
    }

    public static becauseGlobalsWereRequiredButHaveNotBeenSetYet = () =>
        new GlobalsRuntimeContraintViolation(
            'Globals for "@neos-project/neos-ui-i18n" are not available,'
            + ' because they have not been initialized yet. Make sure to run'
            + ' `loadI18n` or `setupI18n` (for testing).'
        );

    public static becauseGlobalsWereAttemptedToBeSetMoreThanOnce = () =>
        new GlobalsRuntimeContraintViolation(
            'Globals for "@neos-project/neos-ui-i18n" have already been set. '
             + ' Make sure to only run one of `loadI18n` or `setupI18n` (for'
             + ' testing).  Neither function must ever be called more than'
             + ' once, unless you are in a testing scenario. Then you are'
             + ' allowed to run `teardownI18n` to reset the globals, after'
             + ' which you can run `setupI18n` to test for a different set of'
             + ' translations.'
        );
}
