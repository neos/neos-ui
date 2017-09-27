import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import TextInputWithValidationResultRendering from '@neos-project/react-ui-components/src/TextInput/';
import unescape from 'lodash.unescape';
import {neos} from '@neos-project/neos-ui-decorators';

const defaultOptions = {
    autoFocus: false,
    disabled: false,
    maxlength: null,
    readonly: false
};

@neos(globalRegistry => ({
    i18nRegistry: globalRegistry.get('i18n')
}))
export default class TextField extends PureComponent {

    static propTypes = {
        value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        commit: PropTypes.func.isRequired,
        validationErrors: PropTypes.array,
        highlight: PropTypes.bool,
        options: PropTypes.object,
        onKeyPress: PropTypes.func,

        i18nRegistry: PropTypes.object.isRequired
    };

    static defaultProps = {
        options: {}
    };

    render() {
        const {value, commit, options, i18nRegistry, highlight, onKeyPress, validationErrors} = this.props;

        // Placeholder text must be unescaped in case html entities were used
        const placeholder = options && options.placeholder && i18nRegistry.translate(unescape(options.placeholder));
        const finalOptions = Object.assign({}, defaultOptions, options);

        return (
            <TextInputWithValidationResultRendering
                autoFocus={finalOptions.autoFocus}
                value={value}
                onChange={commit}
                placeholder={placeholder}
                highlight={highlight}
                validationErrors={validationErrors}
                invalid={validationErrors && validationErrors.length > 0}
                onKeyPress={onKeyPress}
                disabled={finalOptions.disabled}
                maxLength={finalOptions.maxlength}
                readOnly={finalOptions.readonly}
                />
        );
    }
}
