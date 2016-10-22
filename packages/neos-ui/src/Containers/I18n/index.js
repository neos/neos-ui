import React, {Component, PropTypes} from 'react';

import {logger} from 'Shared/Utilities/index';
import neos from 'Host/Decorators/Neos/index';

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
        params: PropTypes.array.isRequired,

        // Optional className which gets added to the translation span.
        className: PropTypes.string,

        translations: PropTypes.object.isRequired
    };

    static defaultProps = {
        packageKey: 'TYPO3.Neos',
        sourceName: 'Main',
        params: []
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

    renderTranslation() {
        const {translations} = this.props;
        const fallback = this.props.fallback || this.props.id;
        const [packageKey, sourceName, id] = this.getTranslationAddress();
        const translation = [packageKey, sourceName, id]

            // Replace all dots with underscores
            .map(s => s ? s.replace(/\./g, '_') : '')

            // traverse through translations and find us a fitting one
            .reduce((prev, cur) => (prev ? prev[cur] || '' : ''), translations);

        if (translation && translation.length) {
            return translation;
        }

        if (!errorCache[`${packageKey}:${sourceName}:${id}`]) {
            logger.error(`No translation found for id "${packageKey}:${sourceName}:${id}" in:`, translations, `Using ${fallback} instead.`);

            errorCache[`${packageKey}:${sourceName}:${id}`] = true;
        }

        return fallback;
    }
}
