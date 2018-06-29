import React from 'react';
import PropTypes from 'prop-types';
import TextArea from '@neos-project/react-ui-components/src/TextArea/';

const defaultOptions = {
    disabled: false,
    maxlength: null,
    readonly: false,
    placeholder: '',
    minRows: 2,
    expandedRows: 6
};

const TextAreaEditor = props => {
    const {id, value, commit, options, className} = props;

    const finalOptions = Object.assign({}, defaultOptions, options);

    return (<TextArea
        id={id}
        value={value}
        className={className}
        onChange={commit}
        disabled={finalOptions.disabled}
        maxLength={finalOptions.maxlength}
        readOnly={finalOptions.readonly}
        placeholder={finalOptions.placeholder}
        minRows={finalOptions.minRows}
        expandedRows={finalOptions.expandedRows}
        />
    );
};
TextAreaEditor.propTypes = {
    id: PropTypes.string,
    value: PropTypes.string,
    highlight: PropTypes.bool,
    commit: PropTypes.func.isRequired,
    options: PropTypes.object,
    validationErrors: PropTypes.array
};

export default TextAreaEditor;
