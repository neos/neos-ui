import {SynchronousRegistry} from '@neos-project/neos-ui-extensibility/src/registry';

import logger from '@neos-project/utils-logger';

import {getTranslationAddress} from './getTranslationAddress';
import {substitutePlaceholders} from './substitutePlaceholders';

const errorCache = {};

const getPluralForm = (translation, quantity = 0) => {
    const translationHasPlurals = translation instanceof Object;

    // no defined quantity or less than one returns singular
    if (translationHasPlurals && (!quantity || quantity <= 1)) {
        return translation[0];
    }

    if (translationHasPlurals && quantity > 1) {
        return translation[1] ? translation[1] : translation[0];
    }

    return translation;
};

export default class I18nRegistry extends SynchronousRegistry {
    _translations = {};

    setTranslations(translations) {
        this._translations = translations;
    }

    // eslint-disable-next-line max-params
    translate(idOrig, fallbackOrig, params = {}, packageKeyOrig = 'Neos.Neos', sourceNameOrig = 'Main', quantity = 0) {
        const fallback = fallbackOrig || idOrig;
        const [packageKey, sourceName, id] = getTranslationAddress(idOrig, packageKeyOrig, sourceNameOrig);
        let translation = [packageKey, sourceName, id]
        // Replace all dots with underscores
            .map(s => s ? s.replace(/\./g, '_') : '')
            // Traverse through translations and find us a fitting one
            .reduce((prev, cur) => (prev ? prev[cur] || '' : ''), this._translations);

        translation = getPluralForm(translation, quantity);
        if (translation && translation.length) {
            if (Object.keys(params).length) {
                return substitutePlaceholders(translation, params);
            }
            return translation;
        }

        if (!errorCache[`${packageKey}:${sourceName}:${id}`]) {
            logger.error(`No translation found for id "${packageKey}:${sourceName}:${id}" in:`, this._translations, `Using ${fallback} instead.`);

            errorCache[`${packageKey}:${sourceName}:${id}`] = true;
        }

        return fallback;
    }
}
