/*
 * This file is part of the Neos.Neos.Ui package.
 *
 * (c) Contributors of the Neos Project - www.neos.io
 *
 * This package is Open Source Software. For the full copyright and license
 * information, please view the LICENSE file which was distributed with this
 * source code.
 */
import {GlobalsRuntimeContraintViolation, requireGlobals, setGlobals, unsetGlobals} from './globals';

describe('globals', () => {
    afterEach(() => {
        unsetGlobals();
    });

    test('requireGlobals throws when globals are not initialized yet', () => {
        expect(() => requireGlobals())
            .toThrow(
                GlobalsRuntimeContraintViolation
                    .becauseGlobalsWereRequiredButHaveNotBeenSetYet()
            );
    });

    test('setGlobals sets the current globals ', () => {
        setGlobals('foo' as any);
        expect(requireGlobals()).toBe('foo');
    });

    test('setGlobals throws if run multiple times', () => {
        setGlobals('foo' as any);
        expect(() => setGlobals('bar' as any))
            .toThrow(
                GlobalsRuntimeContraintViolation
                    .becauseGlobalsWereAttemptedToBeSetMoreThanOnce()
            );
    });

    test('unsetGlobals allows to run setGlobals again', () => {
        setGlobals('foo' as any);
        unsetGlobals();
        setGlobals('bar' as any);
        expect(requireGlobals()).toBe('bar');
    });
});
