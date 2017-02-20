import test from 'ava';
import React from 'react';
import {mount} from 'enzyme';

import I18nRegistry from './I18nRegistry';

test(`
    Host > Containers > I18n: should display configured fallback, if no translation
    was found.`, t => {
    const registry = new I18nRegistry();
    const actual = registry.translate('', 'The Fallback');

    t.is(actual, 'The Fallback');
});

test(`
    Host > Containers > I18n: should display the trans unit id, if no translation
    was found and no fallback was configured.`, t => {
    const registry = new I18nRegistry();
    const actual = registry.translate('The Trans Unit ID');

    t.is(actual, 'The Trans Unit ID');
});

test(`
    Host > Containers > I18n: should display the translated string, if a translation
    was found via short-string.`, t => {
    const translations = {
        'Neos_Neos': { // eslint-disable-line quote-props
            'Main': { // eslint-disable-line quote-props
                'someLabel': 'The Translation' // eslint-disable-line quote-props
            }
        }
    };

    const registry = new I18nRegistry();
    registry.setTranslations(translations);
    const actual = registry.translate('Neos.Neos:Main:someLabel');

    t.is(actual, 'The Translation');
});

test(`
    Host > Containers > I18n: should display the translated string, if a translation
    was found via full-length prop description.`, t => {
    const translations = {
        'Neos_Neos': { // eslint-disable-line quote-props
            'Main': { // eslint-disable-line quote-props
                'someLabel': 'The Translation' // eslint-disable-line quote-props
            }
        }
    };

    const registry = new I18nRegistry();
    registry.setTranslations(translations);
    const actual = registry.translate('Neos.Neos:Main:someLabel', undefined, undefined, 'Neos.Neos', 'Main');

    t.is(actual, 'The Translation');
});
