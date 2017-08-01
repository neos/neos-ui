import React from 'react';
import PropTypes from 'prop-types';
import TextArea from '@neos-project/react-ui-components/src/TextArea/';

const TextAreaEditor = props => {
    const {value, commit, highlight, options} = props;

    const disabled = options && options.disabled ? options.disabled : false;
    const maxlength = options && options.maxlength ? options.maxlength : null;
    const readonly = options && options.readonly ? options.readonly : false;

    return (<TextArea
        value={value}
        onChange={commit}
        highlight={highlight}
        disabled={disabled}
        maxLength={maxlength}
        readOnly={readonly}
        />
    );
};
TextAreaEditor.propTypes = {
    value: PropTypes.string,
    highlight: PropTypes.bool,
    commit: PropTypes.func.isRequired,
    options: PropTypes.object
};

export default TextAreaEditor;
