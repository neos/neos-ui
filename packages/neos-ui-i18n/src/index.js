import React, {PureComponent, PropTypes} from 'react';

import {neos} from '@neos-project/neos-ui-decorators';
import i18n from './i18nService.js';

export const i18nService = i18n;

@neos()
export default class I18n extends PureComponent {
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
        const {translations, packageKey, sourceName, params, id, fallback} = this.props;
        const translate = i18n(translations, packageKey, sourceName);
        return (
            <span className={this.props.className}>{translate(id, fallback, params)}</span>
        );
    }
}
