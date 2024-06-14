/*
 * This file is part of the Neos.Neos.Ui package.
 *
 * (c) Contributors of the Neos Project - www.neos.io
 *
 * This package is Open Source Software. For the full copyright and license
 * information, please view the LICENSE file which was distributed with this
 * source code.
 */
import logger from '@neos-project/utils-logger';
import {substitutePlaceholders} from './substitutePlaceholders';

describe('substitutePlaceholders', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('with numerically indexed placeholders', () => {
        it('substitutes placeholders with no formatter set', () => {
            expect(substitutePlaceholders('Hello {0}!', ['World']))
                .toBe('Hello World!');
            expect(substitutePlaceholders('Foo {0}{1} Bar', ['{', '}']))
                .toBe('Foo {} Bar');
        });

        it('substitutes placeholders for string-cast value if no formatter is set', () => {
            expect(substitutePlaceholders('The answer is: {0}', [42]))
                .toBe('The answer is: 42');
        });

        it('complains if a placeholder has a formatter set', () => {
            const logError = jest.spyOn(logger, 'error');
            substitutePlaceholders('formatted {0,number} output?', [12]);
            expect(logError).toHaveBeenCalledTimes(1);
            expect(logError).toHaveBeenNthCalledWith(
                1,
                expect.stringContaining('formatter not supported')
            );
        });

        it('complains when an invalid placeholder is encountered', () => {
            const logError = jest.spyOn(logger, 'error');
            substitutePlaceholders('damaged {0{} placeholder', [12]);
            expect(logError).toHaveBeenCalledTimes(1);
            expect(logError).toHaveBeenNthCalledWith(
                1,
                expect.stringContaining('incorrectly formatted placeholder')
            );
        });

        it('complains when an insufficient number of arguments has been provided', () => {
            const logError = jest.spyOn(logger, 'error');
            substitutePlaceholders('at least 1 argument: {0}', []);
            expect(logError).toHaveBeenCalledTimes(1);
            expect(logError).toHaveBeenNthCalledWith(
                1,
                expect.stringContaining('provide values for every placeholder')
            );

            substitutePlaceholders('at least 3 arguments: {0} {1} {2}', ['foo', 'bar']);
            expect(logError).toHaveBeenCalledTimes(2);
            expect(logError).toHaveBeenNthCalledWith(
                2,
                expect.stringContaining('provide values for every placeholder')
            );
        });

        it('substitutes multiple occurrences of the same placeholder', () => {
            expect(substitutePlaceholders('{0} {0} {0} {1} {1} {1}', ['foo', 'bar']))
                .toBe('foo foo foo bar bar bar');
        });

        it('substitutes placeholders regardless of order in text', () => {
            expect(substitutePlaceholders('{2} {1} {3} {0}', ['foo', 'bar', 'baz', 'qux']))
                .toBe('baz bar qux foo');
        });
    });

    describe('with named placeholders', () => {
        it('substitutes placeholders with no formatter set', () => {
            expect(substitutePlaceholders('Hello {name}!', {name: 'World'}))
                .toBe('Hello World!');
            expect(substitutePlaceholders('Foo {a}{b} Bar', {a: '{', b: '}'}))
                .toBe('Foo {} Bar');
        });

        it('substitutes placeholders for string-cast value if no formatter is set', () => {
            expect(substitutePlaceholders('The answer is: {answer}', {answer: 42}))
                .toBe('The answer is: 42');
        });

        it('complains if a placeholder has a formatter set', () => {
            const logError = jest.spyOn(logger, 'error');
            substitutePlaceholders('formatted {a,number} output?', {a: 12});
            expect(logError).toHaveBeenCalledTimes(1);
            expect(logError).toHaveBeenNthCalledWith(
                1,
                expect.stringContaining('formatter not supported')
            );
        });

        it('complains when an invalid placeholder is encountered', () => {
            const logError = jest.spyOn(logger, 'error');
            substitutePlaceholders('damaged {broken{} placeholder', {broken: 12});
            expect(logError).toHaveBeenCalledTimes(1);
            expect(logError).toHaveBeenNthCalledWith(
                1,
                expect.stringContaining('incorrectly formatted placeholder')
            );
        });

        it('complains when an insufficient number of arguments has been provided', () => {
            const logError = jest.spyOn(logger, 'error');
            substitutePlaceholders('at least 1 argument: {a}', {});
            expect(logError).toHaveBeenCalledTimes(1);
            expect(logError).toHaveBeenNthCalledWith(
                1,
                expect.stringContaining('provide values for every placeholder')
            );

            substitutePlaceholders('at least 3 arguments: {a} {b} {c}', {a: 'foo', c: 'bar'});
            expect(logError).toHaveBeenCalledTimes(2);
            expect(logError).toHaveBeenNthCalledWith(
                2,
                expect.stringContaining('provide values for every placeholder')
            );
        });

        it('substitutes multiple occurrences of the same placeholder', () => {
            expect(
                substitutePlaceholders(
                    '{name} {name} {name} {value} {value} {value}',
                    {name: 'foo', value: 'bar'}
                )
            ).toBe('foo foo foo bar bar bar');
        });
    });
});
