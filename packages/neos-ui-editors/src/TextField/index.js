import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import TextInput from '@neos-project/react-ui-components/src/TextInput/';
import unescape from 'lodash.unescape';
import {neos} from '@neos-project/neos-ui-decorators';

@neos(globalRegistry => ({
    i18nRegistry: globalRegistry.get('i18n')
}))
export default class TextField extends PureComponent {

    static propTypes = {
        value: PropTypes.string,
        commit: PropTypes.func.isRequired,
        validationErrors: PropTypes.array,
        highlight: PropTypes.bool,
        options: PropTypes.object,
        onKeyPress: PropTypes.func,

        i18nRegistry: PropTypes.object.isRequired
    };

    render() {
        // options = options || {};
        const {value, commit, validationErrors, options, i18nRegistry, highlight, onKeyPress} = this.props;

        // Placeholder text must be unescaped in case html entities were used
        const placeholder = options && options.placeholder && i18nRegistry.translate(unescape(options.placeholder));
        const disabled = options && options.disabled ? options.disabled : false;
        const maxlength = options && options.maxlength ? options.maxlength : null;
        const readonly = options && options.readonly ? options.readonly : false;

        return (<TextInput
            autoFocus={options && options.autoFocus}
            value={value}
            onChange={commit}
            validationErrors={validationErrors}
            placeholder={placeholder}
            highlight={highlight}
            onKeyPress={onKeyPress}
            disabled={disabled}
            maxLength={maxlength}
            readOnly={readonly}
            />);
    }
}
