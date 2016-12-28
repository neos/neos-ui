import logger from '@neos-project/utils-logger';

const errorCache = {};

const getTranslationAddress = function (id, packageKey, sourceName) {
    if (id && id.indexOf(':') !== -1) {
        return id.split(':');
    }

    return [packageKey, sourceName, id];
};

/**
 * This code is taken from the Ember version with minor adjustments. Possibly refactor it later
 * as its style is not superb.
 */
const substitutePlaceholders = function (textWithPlaceholders, parameters) {
    const result = [];
    let startOfPlaceholder;
    let offset = 0;
    while ((startOfPlaceholder = textWithPlaceholders.indexOf('{', offset)) !== -1) {
        const endOfPlaceholder = textWithPlaceholders.indexOf('}', offset);
        const startOfNextPlaceholder = textWithPlaceholders.indexOf('{', startOfPlaceholder + 1);

        if (endOfPlaceholder === -1 || (startOfPlaceholder + 1) >= endOfPlaceholder || (startOfNextPlaceholder !== -1 && startOfNextPlaceholder < endOfPlaceholder)) {
            // There is no closing bracket, or it is placed before the opening bracket, or there is nothing between brackets
            logger.error('Text provided contains incorrectly formatted placeholders. Please make sure you conform the placeholder\'s syntax.');
            break;
        }

        const contentBetweenBrackets = textWithPlaceholders.substr(startOfPlaceholder + 1, endOfPlaceholder - startOfPlaceholder - 1);
        const placeholderElements = contentBetweenBrackets.replace(' ', '').split(',');

        const valueIndex = placeholderElements[0];
        if (typeof parameters[valueIndex] === undefined) {
            logger.error('Placeholder "' + valueIndex + '" was not provided, make sure you provide values for every placeholder.');
            break;
        }

        let formattedPlaceholder;
        if (typeof placeholderElements[1] === 'undefined') {
            // No formatter defined, just string-cast the value
            formattedPlaceholder = parameters[valueIndex];
        } else {
            logger.error('Placeholder formatter not supported.');
            break;
        }

        result.push(textWithPlaceholders.substr(offset, startOfPlaceholder - offset));
        result.push(formattedPlaceholder);

        offset = endOfPlaceholder + 1;
    }

    result.push(textWithPlaceholders.substr(offset));

    return result;
};

const makeTranslate = (translations, packageKeyOrig = null, sourceNameOrig = null) => (
    (idOrig, fallbackOrig, params = {}) => {
        const fallback = fallbackOrig || idOrig;
        const [packageKey, sourceName, id] = getTranslationAddress(idOrig, packageKeyOrig, sourceNameOrig);
        const translation = [packageKey, sourceName, id]
            // Replace all dots with underscores
            .map(s => s ? s.replace(/\./g, '_') : '')
            // traverse through translations and find us a fitting one
            .reduce((prev, cur) => (prev ? prev[cur] || '' : ''), translations);

        if (translation && translation.length) {
            if (Object.keys(params).length) {
                return substitutePlaceholders(translation, params);
            }
            return translation;
        }

        if (!errorCache[`${packageKey}:${sourceName}:${id}`]) {
            logger.error(`No translation found for id "${packageKey}:${sourceName}:${id}" in:`, translations, `Using ${fallback} instead.`);

            errorCache[`${packageKey}:${sourceName}:${id}`] = true;
        }

        return fallback;
    }
);

export default makeTranslate;
