import React, {PropTypes} from 'react';
import TextInput from '@neos-project/react-ui-components/lib/TextInput/';

const TextField = props => {
    const {value, commit, validationErrors} = props;

    return <TextInput value={value} onChange={commit} validationErrors={validationErrors}/>;
};
TextField.propTypes = {
    value: PropTypes.string,
    commit: PropTypes.func.isRequired,
    validationErrors: PropTypes.array
};

export default TextField;
