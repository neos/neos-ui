/*
 * This file is part of the Neos.Neos.Ui package.
 *
 * (c) Contributors of the Neos Project - www.neos.io
 *
 * This package is Open Source Software. For the full copyright and license
 * information, please view the LICENSE file which was distributed with this
 * source code.
 */
import {setupI18n, teardownI18n} from './global';
import {translate} from './translate';

/* eslint-disable max-nested-callbacks */
describe('translate', () => {
    describe('when no translation was found', () => {
        beforeAll(() => {
            setupI18n('en-US', 'one,other', {});
        });
        afterAll(() => {
            teardownI18n();
        });

        it('returns given fallback', () => {
            expect(translate('Unknown.Package:UnknownSource:unknown.trans-unit.id', 'This is the fallback'))
                .toBe('This is the fallback');
            expect(translate('Unknown.Package:UnknownSource:unknown.trans-unit.id', 'This is another fallback'))
                .toBe('This is another fallback');
        });

        it('returns given "other" form of fallback when quantity = 0', () => {
            expect(translate('Unknown.Package:UnknownSource:unknown.trans-unit.id', ['Singular Fallback', 'Plural Fallback'], [], 0))
                .toBe('Plural Fallback');
        });

        it('returns given "one" form of fallback when quantity = 1', () => {
            expect(translate('Unknown.Package:UnknownSource:unknown.trans-unit.id', ['Singular Fallback', 'Plural Fallback'], [], 1))
                .toBe('Singular Fallback');
        });

        it('returns given "other" form of fallback when quantity > 1', () => {
            expect(translate('Unknown.Package:UnknownSource:unknown.trans-unit.id', ['Singular Fallback', 'Plural Fallback'], [], 2))
                .toBe('Plural Fallback');
            expect(translate('Unknown.Package:UnknownSource:unknown.trans-unit.id', ['Singular Fallback', 'Plural Fallback'], [], 42))
                .toBe('Plural Fallback');
            expect(translate('Unknown.Package:UnknownSource:unknown.trans-unit.id', ['Singular Fallback', 'Plural Fallback'], [], 24227))
                .toBe('Plural Fallback');
        });

        it('substitutes numerical parameters in fallback string', () => {
            expect(translate('Unknown.Package:UnknownSource:unknown.trans-unit.id', 'This is {0} fallback with {1} parameters.', ['a', 'a few']))
                .toBe('This is a fallback with a few parameters.');
            expect(translate('Unknown.Package:UnknownSource:unknown.trans-unit.id', ['This is a fallback with {0} parameter.', 'This is a fallback with {0} parameters.'], ['just one'], 1))
                .toBe('This is a fallback with just one parameter.');
            expect(translate('Unknown.Package:UnknownSource:unknown.trans-unit.id', ['This is a fallback with {0} parameter.', 'This is a fallback with {0} parameters.'], ['one or more'], 2))
                .toBe('This is a fallback with one or more parameters.');
        });

        it('substitutes named parameters in fallback string', () => {
            expect(translate('Unknown.Package:UnknownSource:unknown.trans-unit.id', 'This is {foo} fallback with {bar} parameters.', {foo: 'one', bar: 'a couple of'}))
                .toBe('This is one fallback with a couple of parameters.');
            expect(translate('Unknown.Package:UnknownSource:unknown.trans-unit.id', ['This is a fallback with {foo} parameter.', 'This is a fallback with {foo} parameters.'], {foo: 'just one'}, 1))
                .toBe('This is a fallback with just one parameter.');
            expect(translate('Unknown.Package:UnknownSource:unknown.trans-unit.id', ['This is a fallback with {foo} parameter.', 'This is a fallback with {foo} parameters.'], {foo: 'one or more'}, 2))
                .toBe('This is a fallback with one or more parameters.');
        });
    });

    describe('when a translation was found', () => {
        describe('in locale "en-US"', () => {
            beforeAll(() => {
                setupI18n('en-US', 'one,other', {
                    'Neos_Neos_Ui': {
                        'Main': {
                            'translation_without_plural_forms':
                                'This is a translation without plural forms.',
                            'translation_with_numerical_parameters':
                                'This translation contains {0} {1} {2}.',
                            'translation_with_named_parameters':
                                'This translation contains {foo} {bar} {baz}.',
                            'translation_with_plural_forms': [
                                'This is the "one" form of the translated string.',
                                'This is the "other" form of the translated string.'
                            ],
                            'translation_with_plural_forms_and_numerical_parameters': [
                                'This is the "one" form of a translation that contains {0} {1} {2}.',
                                'This is the "other" form of a translation that contains {0} {1} {2}.'
                            ],
                            'translation_with_plural_forms_and_named_parameters': [
                                'This is the "one" form of a translation that contains {foo} {bar} {baz}.',
                                'This is the "other" form of a translation that contains {foo} {bar} {baz}.'
                            ]
                        }
                    }
                });
            });
            afterAll(() => {
                teardownI18n();
            });

            it('returns translated string', () => {
                expect(translate('Neos.Neos.Ui:Main:translation.without.plural.forms', 'This is the fallback'))
                    .toBe('This is a translation without plural forms.');
            });

            it('substitutes numerical parameters in translated string', () => {
                expect(translate('Neos.Neos.Ui:Main:translation.with.numerical.parameters', 'This is the fallback', [3, 'numerical', 'parameters']))
                    .toBe('This translation contains 3 numerical parameters.');
            });

            it('substitutes named parameters in translated string', () => {
                expect(translate('Neos.Neos.Ui:Main:translation.with.named.parameters', 'This is the fallback', {foo: 3, bar: 'named', baz: 'parameters'}))
                    .toBe('This translation contains 3 named parameters.');
            });

            describe('when quantity = 0', () => {
                it('returns "other" form of translated string', () => {
                    expect(translate('Neos.Neos.Ui:Main:translation.with.plural.forms', 'This is the fallback', [], 0))
                        .toBe('This is the "other" form of the translated string.');
                });

                it('substitutes numerical parameters in "other" form of translated string', () => {
                    expect(translate('Neos.Neos.Ui:Main:translation.with.plural.forms.and.numerical.parameters', 'This is the fallback', [3, 'numerical', 'parameters'], 0))
                        .toBe('This is the "other" form of a translation that contains 3 numerical parameters.');
                });

                it('substitutes named parameters in "other" form of translated string', () => {
                    expect(translate('Neos.Neos.Ui:Main:translation.with.plural.forms.and.named.parameters', 'This is the fallback', {foo: 3, bar: 'named', baz: 'parameters'}, 0))
                        .toBe('This is the "other" form of a translation that contains 3 named parameters.');
                });
            });

            describe('when quantity = 1', () => {
                it('returns "one" form of translated string', () => {
                    expect(translate('Neos.Neos.Ui:Main:translation.with.plural.forms', 'This is the fallback', [], 1))
                        .toBe('This is the "one" form of the translated string.');
                });

                it('substitutes numerical parameters in "one" form of translated string', () => {
                    expect(translate('Neos.Neos.Ui:Main:translation.with.plural.forms.and.numerical.parameters', 'This is the fallback', [3, 'numerical', 'parameters'], 1))
                        .toBe('This is the "one" form of a translation that contains 3 numerical parameters.');
                });

                it('substitutes named parameters in "one" form of translated string', () => {
                    expect(translate('Neos.Neos.Ui:Main:translation.with.plural.forms.and.named.parameters', 'This is the fallback', {foo: 3, bar: 'named', baz: 'parameters'}, 1))
                        .toBe('This is the "one" form of a translation that contains 3 named parameters.');
                });
            });

            describe('when quantity > 1', () => {
                it('returns "other" form of translated string', () => {
                    expect(translate('Neos.Neos.Ui:Main:translation.with.plural.forms', 'This is the fallback', [], 23))
                        .toBe('This is the "other" form of the translated string.');
                });

                it('substitutes numerical parameters in "other" form of translated string', () => {
                    expect(translate('Neos.Neos.Ui:Main:translation.with.plural.forms.and.numerical.parameters', 'This is the fallback', [3, 'numerical', 'parameters'], 42))
                        .toBe('This is the "other" form of a translation that contains 3 numerical parameters.');
                });

                it('substitutes named parameters in "other" form of translated string', () => {
                    expect(translate('Neos.Neos.Ui:Main:translation.with.plural.forms.and.named.parameters', 'This is the fallback', {foo: 3, bar: 'named', baz: 'parameters'}, 274711))
                        .toBe('This is the "other" form of a translation that contains 3 named parameters.');
                });
            });
        });

        describe('in locale "ar-EG"', () => {
            beforeAll(() => {
                setupI18n('ar-EG', 'zero,one,two,few,many', {
                    'Neos_Neos_Ui': {
                        'Main': {
                            'translation_without_plural_forms':
                                'This is a translation without plural forms.',
                            'translation_with_numerical_parameters':
                                'This translation contains {0} {1} {2}.',
                            'translation_with_named_parameters':
                                'This translation contains {foo} {bar} {baz}.',
                            'translation_with_plural_forms': [
                                'This is the "zero" form of the translated string.',
                                'This is the "one" form of the translated string.',
                                'This is the "two" form of the translated string.',
                                'This is the "few" form of the translated string.',
                                'This is the "many" form of the translated string.'
                            ],
                            'translation_with_plural_forms_and_numerical_parameters': [
                                'This is the "zero" form of a translation that contains {0} {1} {2}.',
                                'This is the "one" form of a translation that contains {0} {1} {2}.',
                                'This is the "two" form of a translation that contains {0} {1} {2}.',
                                'This is the "few" form of a translation that contains {0} {1} {2}.',
                                'This is the "many" form of a translation that contains {0} {1} {2}.'
                            ],
                            'translation_with_plural_forms_and_named_parameters': [
                                'This is the "zero" form of a translation that contains {foo} {bar} {baz}.',
                                'This is the "one" form of a translation that contains {foo} {bar} {baz}.',
                                'This is the "two" form of a translation that contains {foo} {bar} {baz}.',
                                'This is the "few" form of a translation that contains {foo} {bar} {baz}.',
                                'This is the "many" form of a translation that contains {foo} {bar} {baz}.'
                            ]
                        }
                    }
                });
            });
            afterAll(() => {
                teardownI18n();
            });

            it('returns translated string', () => {
                expect(translate('Neos.Neos.Ui:Main:translation.without.plural.forms', 'This is the fallback'))
                    .toBe('This is a translation without plural forms.');
            });

            it('substitutes numerical parameters in translated string', () => {
                expect(translate('Neos.Neos.Ui:Main:translation.with.numerical.parameters', 'This is the fallback', [3, 'numerical', 'parameters']))
                    .toBe('This translation contains 3 numerical parameters.');
            });

            it('substitutes named parameters in translated string', () => {
                expect(translate('Neos.Neos.Ui:Main:translation.with.named.parameters', 'This is the fallback', {foo: 3, bar: 'named', baz: 'parameters'}))
                    .toBe('This translation contains 3 named parameters.');
            });

            describe('when quantity = 0', () => {
                it('returns "zero" form of translated string', () => {
                    expect(translate('Neos.Neos.Ui:Main:translation.with.plural.forms', 'This is the fallback', [], 0))
                        .toBe('This is the "zero" form of the translated string.');
                });

                it('substitutes numerical parameters in "zero" form of translated string', () => {
                    expect(translate('Neos.Neos.Ui:Main:translation.with.plural.forms.and.numerical.parameters', 'This is the fallback', [3, 'numerical', 'parameters'], 0))
                        .toBe('This is the "zero" form of a translation that contains 3 numerical parameters.');
                });

                it('substitutes named parameters in "zero" form of translated string', () => {
                    expect(translate('Neos.Neos.Ui:Main:translation.with.plural.forms.and.named.parameters', 'This is the fallback', {foo: 3, bar: 'named', baz: 'parameters'}, 0))
                        .toBe('This is the "zero" form of a translation that contains 3 named parameters.');
                });
            });

            describe('when quantity = 1', () => {
                it('returns "one" form of translated string', () => {
                    expect(translate('Neos.Neos.Ui:Main:translation.with.plural.forms', 'This is the fallback', [], 1))
                        .toBe('This is the "one" form of the translated string.');
                });

                it('substitutes numerical parameters in "one" form of translated string', () => {
                    expect(translate('Neos.Neos.Ui:Main:translation.with.plural.forms.and.numerical.parameters', 'This is the fallback', [3, 'numerical', 'parameters'], 1))
                        .toBe('This is the "one" form of a translation that contains 3 numerical parameters.');
                });

                it('substitutes named parameters in "one" form of translated string', () => {
                    expect(translate('Neos.Neos.Ui:Main:translation.with.plural.forms.and.named.parameters', 'This is the fallback', {foo: 3, bar: 'named', baz: 'parameters'}, 1))
                        .toBe('This is the "one" form of a translation that contains 3 named parameters.');
                });
            });

            describe('when quantity = 2', () => {
                it('returns "two" form of translated string', () => {
                    expect(translate('Neos.Neos.Ui:Main:translation.with.plural.forms', 'This is the fallback', [], 2))
                        .toBe('This is the "two" form of the translated string.');
                });

                it('substitutes numerical parameters in "two" form of translated string', () => {
                    expect(translate('Neos.Neos.Ui:Main:translation.with.plural.forms.and.numerical.parameters', 'This is the fallback', [3, 'numerical', 'parameters'], 2))
                        .toBe('This is the "two" form of a translation that contains 3 numerical parameters.');
                });

                it('substitutes named parameters in "two" form of translated string', () => {
                    expect(translate('Neos.Neos.Ui:Main:translation.with.plural.forms.and.named.parameters', 'This is the fallback', {foo: 3, bar: 'named', baz: 'parameters'}, 2))
                        .toBe('This is the "two" form of a translation that contains 3 named parameters.');
                });
            });

            describe('when quantity % 100 is between 3 and 10', () => {
                it('returns "few" form of translated string', () => {
                    expect(translate('Neos.Neos.Ui:Main:translation.with.plural.forms', 'This is the fallback', [], 7))
                        .toBe('This is the "few" form of the translated string.');
                });

                it('substitutes numerical parameters in "few" form of translated string', () => {
                    expect(translate('Neos.Neos.Ui:Main:translation.with.plural.forms.and.numerical.parameters', 'This is the fallback', [3, 'numerical', 'parameters'], 108))
                        .toBe('This is the "few" form of a translation that contains 3 numerical parameters.');
                });

                it('substitutes named parameters in "few" form of translated string', () => {
                    expect(translate('Neos.Neos.Ui:Main:translation.with.plural.forms.and.named.parameters', 'This is the fallback', {foo: 3, bar: 'named', baz: 'parameters'}, 2005))
                        .toBe('This is the "few" form of a translation that contains 3 named parameters.');
                });
            });

            describe('when quantity % 100 is between 11 and 99', () => {
                it('returns "many" form of translated string', () => {
                    expect(translate('Neos.Neos.Ui:Main:translation.with.plural.forms', 'This is the fallback', [], 11))
                        .toBe('This is the "many" form of the translated string.');
                });

                it('substitutes numerical parameters in "many" form of translated string', () => {
                    expect(translate('Neos.Neos.Ui:Main:translation.with.plural.forms.and.numerical.parameters', 'This is the fallback', [3, 'numerical', 'parameters'], 112))
                        .toBe('This is the "many" form of a translation that contains 3 numerical parameters.');
                });

                it('substitutes named parameters in "many" form of translated string', () => {
                    expect(translate('Neos.Neos.Ui:Main:translation.with.plural.forms.and.named.parameters', 'This is the fallback', {foo: 3, bar: 'named', baz: 'parameters'}, 10099))
                        .toBe('This is the "many" form of a translation that contains 3 named parameters.');
                });
            });
        });
    });
});
