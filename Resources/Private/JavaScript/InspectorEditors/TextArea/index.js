import React, {PropTypes} from '@host/react';
import TextArea from '@neos-project/react-ui-components/lib/TextArea/';

const TextAreaEditor = props => {
    const {value, commit} = props;

    return (<TextArea value={value} onChange={value => commit(value)}/>);
};

TextAreaEditor.propTypes = {
    value: PropTypes.string.isRequired,
    commit: PropTypes.func.isRequired
};

export default TextAreaEditor;
