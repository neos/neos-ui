import React from 'react';
import PropTypes from 'prop-types';
import TextArea from '@neos-project/react-ui-components/src/TextArea/';

const defaultOptions = {
    disabled: false,
    maxlength: null,
    readonly: false
};

const TextAreaEditor = props => {
    const {id, value, commit, highlight, options} = props;

    const finalOptions = Object.assign({}, defaultOptions, options);

    return (<TextArea
        id={id}
        value={value}
        onChange={commit}
        highlight={highlight}
        disabled={finalOptions.disabled}
        maxLength={finalOptions.maxlength}
        readOnly={finalOptions.readonly}
        />
    );
};
TextAreaEditor.propTypes = {
    id: PropTypes.string,
    value: PropTypes.string,
    highlight: PropTypes.bool,
    commit: PropTypes.func.isRequired,
    options: PropTypes.object
};

export default TextAreaEditor;
