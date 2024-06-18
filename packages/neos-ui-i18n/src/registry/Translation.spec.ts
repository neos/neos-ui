/*
 * This file is part of the Neos.Neos.Ui package.
 *
 * (c) Contributors of the Neos Project - www.neos.io
 *
 * This package is Open Source Software. For the full copyright and license
 * information, please view the LICENSE file which was distributed with this
 * source code.
 */
import {Translation} from './Translation';

describe('Translation', () => {
    it('can be created from a defective DTO', () => {
        const translation = Translation.fromDTO([
            'This translation has only a singular form, despite its DTO being an array.'
        ]);

        expect(translation.render(undefined, 24))
            .toBe('This translation has only a singular form, despite its DTO being an array.');
    });

    describe('having a singular form only', () => {
        it('renders a translation string without placeholders and quantity = 0', () => {
            const translation = Translation.fromDTO(
                'This translation has only a singular form and no placeholders.'
            );

            expect(translation.render(undefined, 0))
                .toBe('This translation has only a singular form and no placeholders.');
        });

        it('renders a translation string without placeholders and with quantity = 1', () => {
            const translation = Translation.fromDTO(
                'This translation has only a singular form and no placeholders.'
            );

            expect(translation.render(undefined, 1))
                .toBe('This translation has only a singular form and no placeholders.');
        });

        it('renders a translation string without placeholders and with quantity > 1', () => {
            const translation = Translation.fromDTO(
                'This translation has only a singular form and no placeholders.'
            );

            expect(translation.render(undefined, 42))
                .toBe('This translation has only a singular form and no placeholders.');
        });

        it('renders a translation string with placeholders and quantity = 0', () => {
            const translation = Translation.fromDTO(
                'This translation has only a singular form and {some} placeholder.'
            );

            expect(translation.render({some: 'one'}, 0))
                .toBe('This translation has only a singular form and one placeholder.');
        });

        it('renders a translation string with placeholders and with quantity = 1', () => {
            const translation = Translation.fromDTO(
                'This translation has only a singular form and {some} placeholder.'
            );

            expect(translation.render({some: 'one'}, 1))
                .toBe('This translation has only a singular form and one placeholder.');
        });

        it('renders a translation string with placeholders and with quantity > 1', () => {
            const translation = Translation.fromDTO(
                'This translation has only a singular form and {some} placeholder.'
            );

            expect(translation.render({some: 'one'}, 42))
                .toBe('This translation has only a singular form and one placeholder.');
        });
    });

    describe('having a singular and a plural form', () => {
        it('renders a translation string without placeholders and quantity = 0', () => {
            const translation = Translation.fromDTO([
                'This translation has a singular form with no placeholders.',
                'This translation has a plural form with no placeholders.'
            ]);

            expect(translation.render(undefined, 0))
                .toBe('This translation has a singular form with no placeholders.');
        });

        it('renders a translation string without placeholders and with quantity = 1', () => {
            const translation = Translation.fromDTO([
                'This translation has a singular form with no placeholders.',
                'This translation has a plural form with no placeholders.'
            ]);

            expect(translation.render(undefined, 1))
                .toBe('This translation has a singular form with no placeholders.');
        });

        it('renders a translation string without placeholders and with quantity > 1', () => {
            const translation = Translation.fromDTO([
                'This translation has a singular form with no placeholders.',
                'This translation has a plural form with no placeholders.'
            ]);

            expect(translation.render(undefined, 42))
                .toBe('This translation has a plural form with no placeholders.');
        });

        it('renders a translation string with placeholders and quantity = 0', () => {
            const translation = Translation.fromDTO([
                'This translation has a singular form with {some} placeholder.',
                'This translation has a plural form with {some} placeholder.'
            ]);

            expect(translation.render({some: 'one'}, 0))
                .toBe('This translation has a singular form with one placeholder.');
        });

        it('renders a translation string with placeholders and with quantity = 1', () => {
            const translation = Translation.fromDTO([
                'This translation has a singular form with {some} placeholder.',
                'This translation has a plural form with {some} placeholder.'
            ]);

            expect(translation.render({some: 'one'}, 1))
                .toBe('This translation has a singular form with one placeholder.');
        });

        it('renders a translation string with placeholders and with quantity > 1', () => {
            const translation = Translation.fromDTO([
                'This translation has a singular form with {some} placeholder.',
                'This translation has a plural form with {some} placeholder.'
            ]);

            expect(translation.render({some: 'one'}, 42))
                .toBe('This translation has a plural form with one placeholder.');
        });
    });
});
