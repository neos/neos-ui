import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import TextInput from '@neos-project/react-ui-components/src/TextInput/';
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
        className: PropTypes.string,
        value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        commit: PropTypes.func.isRequired,
        options: PropTypes.object,
        onKeyPress: PropTypes.func,
        onEnterKey: PropTypes.func,
        id: PropTypes.string,

        i18nRegistry: PropTypes.object.isRequired
    };

    static defaultProps = {
        options: {}
    };

    render() {
        const {id, value, className, commit, options, i18nRegistry, onKeyPress, onEnterKey} = this.props;

        // Placeholder text must be unescaped in case html entities were used
        const placeholder = options && options.placeholder && i18nRegistry.translate(unescape(options.placeholder));
        const finalOptions = Object.assign({}, defaultOptions, options);

        return (<TextInput
            className={className}
            id={id}
            autoFocus={finalOptions.autoFocus}
            value={value}
            onChange={commit}
            placeholder={placeholder}
            onKeyPress={onKeyPress}
            onEnterKey={onEnterKey}
            disabled={finalOptions.disabled}
            maxLength={finalOptions.maxlength}
            readOnly={finalOptions.readonly}
            />);
    }
}
