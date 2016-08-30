import React, {PropTypes} from 'react';
import TextInput from '@neos-project/react-ui-components/lib/TextInput/';

const TextField = props => {
    const {value, commit} = props;

    return (<TextInput value={value} onChange={value => commit(value)}/>);
};

TextField.propTypes = {
    value: PropTypes.string.isRequired,
    commit: PropTypes.func.isRequired
};

export default TextField;
