import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';

import {neos} from '@neos-project/neos-ui-decorators';

@neos(globalRegistry => ({
    i18nRegistry: globalRegistry.get('i18n')
}))
export default class I18n extends PureComponent {
    static propTypes = {
        // Fallback key which gets rendered once the i18n service doesn't return a translation.
        fallback: PropTypes.string,

        // The target id which the i18n service accepts.
        id: PropTypes.string,

        // The destination paths for the package and source of the translation.
        packageKey: PropTypes.string,
        sourceName: PropTypes.string,

        // Additional parameters which are passed to the i18n service.
        params: PropTypes.object.isRequired,

        // Optional className which gets added to the translation span.
        className: PropTypes.string,

        i18nRegistry: PropTypes.object.isRequired
    };

    static defaultProps = {
        packageKey: null,
        sourceName: null,
        params: {}
    };

    render() {
        const {i18nRegistry, packageKey, sourceName, params, id, fallback} = this.props;

        return (
            <span className={this.props.className}>{i18nRegistry.translate(id, fallback, params, packageKey, sourceName)}</span>
        );
    }
}
