import React, {PropTypes} from 'react';
import TextArea from '@neos-project/react-ui-components/src/TextArea/';

const TextAreaEditor = props => {
    const {value, commit, highlight} = props;

    return (<TextArea
        value={value}
        onChange={commit}
        highlight={highlight}
        />
    );
};
TextAreaEditor.propTypes = {
    value: PropTypes.string,
    highlight: PropTypes.bool,
    commit: PropTypes.func.isRequired
};

export default TextAreaEditor;
