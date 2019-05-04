import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import TextArea from '@neos-project/react-ui-components/src/TextArea/';
import {neos} from '@neos-project/neos-ui-decorators';

@neos(globalRegistry => ({
    i18nRegistry: globalRegistry.get('i18n')
}))
export default class TextAreaEditor extends PureComponent {
    static propTypes = {
        id: PropTypes.string,
        value: PropTypes.string,
        highlight: PropTypes.bool,
        commit: PropTypes.func.isRequired,
        options: PropTypes.object,
        validationErrors: PropTypes.array,
        i18nRegistry: PropTypes.object.isRequired
    };

    static defaultOptions = {
        disabled: false,
        maxlength: null,
        readonly: false,
        placeholder: '',
        minRows: 2,
        expandedRows: 6
    };

    render() {
        const {id, value, commit, options, className, i18nRegistry} = this.props;

        const finalOptions = Object.assign({}, this.constructor.defaultOptions, options);
        const placeholder = finalOptions.placeholder && i18nRegistry.translate(unescape(finalOptions.placeholder));

        return (<TextArea
            id={id}
            value={value}
            className={className}
            onChange={commit}
            disabled={finalOptions.disabled}
            maxLength={finalOptions.maxlength}
            readOnly={finalOptions.readonly}
            placeholder={placeholder}
            minRows={finalOptions.minRows}
            expandedRows={finalOptions.expandedRows}
            />);
    }
}
