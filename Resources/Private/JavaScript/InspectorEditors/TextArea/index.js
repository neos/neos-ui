import React, {PropTypes} from '@host/react';
import {Components} from '@host';

const {TextArea} = Components;

const TextAreaEditor = props => {
    const {value, commit} = props;

    return (<TextArea value={value} onChange={value => commit(value)}/>);
};

TextAreaEditor.propTypes = {
    value: PropTypes.string.isRequired,
    commit: PropTypes.func.isRequired
};

export default TextAreaEditor;
