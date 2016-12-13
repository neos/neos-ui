import React, {Component, PropTypes} from 'react';

import logger from '@neos-project/utils-logger';
import {neos} from '@neos-project/neos-ui-decorators';

const errorCache = {};

@neos()
export default class I18n extends Component {
    static propTypes = {
        // Fallback key which gets rendered once the i18n service doesn't return a translation.
        fallback: PropTypes.string,

        // The target id which the i18n service accepts.
        id: PropTypes.string,

        // The destination paths for the package and source of the translation.
        packageKey: PropTypes.string.isRequired,
        sourceName: PropTypes.string.isRequired,

        // Additional parameters which are passed to the i18n service.
        params: PropTypes.object.isRequired,

        // Optional className which gets added to the translation span.
        className: PropTypes.string,

        translations: PropTypes.object.isRequired
    };

    static defaultProps = {
        packageKey: 'Neos.Neos',
        sourceName: 'Main',
        params: {}
    };

    render() {
        return (
            <span className={this.props.className}>{this.renderTranslation()}</span>
        );
    }

    getTranslationAddress() {
        const {id} = this.props;

        if (id && id.indexOf(':') !== -1) {
            return id.split(':');
        }

        const {packageKey, sourceName} = this.props;

        return [packageKey, sourceName, id];
    }

    /**
     * This code is taken from the Ember version with minor adjustments. Possibly refactor it later
     * as its style is not superb.
     */
    substitutePlaceholders(textWithPlaceholders, parameters) {
        let startOfPlaceholder;
        while ((startOfPlaceholder = textWithPlaceholders.indexOf('{')) !== -1) {
            const endOfPlaceholder = textWithPlaceholders.indexOf('}');
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

            textWithPlaceholders = textWithPlaceholders.replace('{' + contentBetweenBrackets + '}', formattedPlaceholder);
        }

        return textWithPlaceholders;
    }

    renderTranslation() {
        const {translations, params} = this.props;
        const fallback = this.props.fallback || this.props.id;
        const [packageKey, sourceName, id] = this.getTranslationAddress();
        const translation = [packageKey, sourceName, id]

            // Replace all dots with underscores
            .map(s => s ? s.replace(/\./g, '_') : '')

            // traverse through translations and find us a fitting one
            .reduce((prev, cur) => (prev ? prev[cur] || '' : ''), translations);

        if (translation && translation.length) {
            if (params) {
                return this.substitutePlaceholders(translation, params);
            }
            return translation;
        }

        if (!errorCache[`${packageKey}:${sourceName}:${id}`]) {
            logger.error(`No translation found for id "${packageKey}:${sourceName}:${id}" in:`, translations, `Using ${fallback} instead.`);

            errorCache[`${packageKey}:${sourceName}:${id}`] = true;
        }

        return fallback;
    }
}
