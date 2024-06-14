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

/**
 * This code is taken from the Ember version with minor adjustments. Possibly refactor it later
 * as its style is not superb.
 */
export const substitutePlaceholders = function (textWithPlaceholders: string, parameters: (string|number)[] | Record<string, string|number>) {
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
        const value = Array.isArray(parameters)
            ? parameters[parseInt(valueIndex, 10)]
            : parameters[valueIndex];
        if (typeof value === 'undefined') {
            logger.error('Placeholder "' + valueIndex + '" was not provided, make sure you provide values for every placeholder.');
            break;
        }

        let formattedPlaceholder;
        if (typeof placeholderElements[1] === 'undefined') {
            // No formatter defined, just string-cast the value
            formattedPlaceholder = value;
        } else {
            logger.error('Placeholder formatter not supported.');
            break;
        }

        result.push(textWithPlaceholders.substr(offset, startOfPlaceholder - offset));
        result.push(formattedPlaceholder);

        offset = endOfPlaceholder + 1;
    }

    result.push(textWithPlaceholders.substr(offset));

    return result.join('');
};
