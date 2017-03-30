import I18nRegistry from './I18nRegistry';

test(`
    Host > Containers > I18n: should display configured fallback, if no translation
    was found.`, () => {
    const registry = new I18nRegistry();
    const actual = registry.translate('', 'The Fallback');

    expect(actual).toBe('The Fallback');
});

test(`
    Host > Containers > I18n: should display the trans unit id, if no translation
    was found and no fallback was configured.`, () => {
    const registry = new I18nRegistry();
    const actual = registry.translate('The Trans Unit ID');

    expect(actual).toBe('The Trans Unit ID');
});

test(`
    Host > Containers > I18n: should display the translated string, if a translation
    was found via short-string.`, () => {
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

    expect(actual).toBe('The Translation');
});

test(`
    Host > Containers > I18n: should display the translated string, if a translation
    was found via full-length prop description.`, () => {
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

    expect(actual).toBe('The Translation');
});
