/*
 * This file is part of the Neos.Neos.Ui package.
 *
 * (c) Contributors of the Neos Project - www.neos.io
 *
 * This package is Open Source Software. For the full copyright and license
 * information, please view the LICENSE file which was distributed with this
 * source code.
 */
import {registerLocale} from '../model';

import {I18nRegistry} from './I18nRegistry';
import {registerTranslations} from './TranslationRepository';

beforeAll(() => {
    registerLocale('en-US', 'one,other');
    registerTranslations({
        'Neos_Neos': { // eslint-disable-line quote-props
            'Main': { // eslint-disable-line quote-props
                'someLabel': 'The Translation', // eslint-disable-line quote-props
                'singularLabelOnly': {
                    0: 'Singular Translation' // eslint-disable-line quote-props
                },
                'pluralLabel': {
                    0: 'Singular Translation', // eslint-disable-line quote-props
                    1: 'Plural Translation' // eslint-disable-line quote-props
                }
            }
        }
    });
})

test(`
    Host > Containers > I18n: should display configured fallback, if no translation
    was found.`, () => {
    const registry = new I18nRegistry('');
    const actual = registry.translate('', 'The Fallback');

    expect(actual).toBe('The Fallback');
});

test(`
    Host > Containers > I18n: should display the trans unit id, if no translation
    was found and no fallback was configured.`, () => {
    const registry = new I18nRegistry('');
    const actual = registry.translate('The Trans Unit ID');

    expect(actual).toBe('The Trans Unit ID');
});

test(`
    Host > Containers > I18n: should display the translated string, if a translation
    was found via short-string.`, () => {
    const registry = new I18nRegistry('');
    const actual = registry.translate('Neos.Neos:Main:someLabel');

    expect(actual).toBe('The Translation');
});

test(`
    Host > Containers > I18n: should display the translated string, if a translation
    was found via full-length prop description.`, () => {
    const registry = new I18nRegistry('');
    const actual = registry.translate('Neos.Neos:Main:someLabel', undefined, undefined, 'Neos.Neos', 'Main');

    expect(actual).toBe('The Translation');
});

test(`
    Host > Containers > I18n: Should display plural when no quantity is defined.`, () => {
    const registry = new I18nRegistry('');
    const actual = registry.translate('Neos.Neos:Main:pluralLabel', undefined, undefined, 'Neos.Neos', 'Main');

    expect(actual).toBe('Plural Translation');
});

test(`
    Host > Containers > I18n: Should display plural when quantity is zero.`, () => {
    const registry = new I18nRegistry('');
    const actual = registry.translate('Neos.Neos:Main:pluralLabel', undefined, undefined, 'Neos.Neos', 'Main', 0);

    expect(actual).toBe('Plural Translation');
});

test(`
    Host > Containers > I18n: Should display singular when quantity is one.`, () => {
    const registry = new I18nRegistry('');
    const actual = registry.translate('Neos.Neos:Main:pluralLabel', undefined, undefined, 'Neos.Neos', 'Main', 1);

    expect(actual).toBe('Singular Translation');
});

test(`
    Host > Containers > I18n: Should display plural when quantity is two.`, () => {
    const registry = new I18nRegistry('');
    const actual = registry.translate('Neos.Neos:Main:pluralLabel', undefined, undefined, 'Neos.Neos', 'Main', 2);

    expect(actual).toBe('Plural Translation');
});

test(`
    Host > Containers > I18n: Should display regular language label even when no plural exists and a quantity is defined.`, () => {
    const registry = new I18nRegistry('');
    const actual = registry.translate('Neos.Neos:Main:someLabel', undefined, undefined, 'Neos.Neos', 'Main', 2);

    expect(actual).toBe('The Translation');
});

test(`
    Host > Containers > I18n: Should display singular when quantity is higher but plural label is not defined`, () => {
    const registry = new I18nRegistry('');
    const actual = registry.translate('Neos.Neos:Main:singularLabelOnly', undefined, undefined, 'Neos.Neos', 'Main', 2);

    expect(actual).toBe('Singular Translation');
});
