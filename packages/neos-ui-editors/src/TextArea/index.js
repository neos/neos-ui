import React from 'react';
import PropTypes from 'prop-types';
import TextAreaWithValidationResultRendering from '@neos-project/react-ui-components/src/TextArea/';

const defaultOptions = {
    disabled: false,
    maxlength: null,
    readonly: false
};

const TextAreaEditor = props => {
    const {value, commit, highlight, options, validationErrors} = props;

    const finalOptions = Object.assign({}, defaultOptions, options);

    return (<TextAreaWithValidationResultRendering
        value={value}
        onChange={commit}
        highlight={highlight}
        invalid={validationErrors && validationErrors.length > 0}
        validationErrors={validationErrors}
        disabled={finalOptions.disabled}
        maxLength={finalOptions.maxlength}
        readOnly={finalOptions.readonly}
        />
    );
};
TextAreaEditor.propTypes = {
    value: PropTypes.string,
    highlight: PropTypes.bool,
    validationErrors: PropTypes.array,
    commit: PropTypes.func.isRequired,
    options: PropTypes.object
};

export default TextAreaEditor;
