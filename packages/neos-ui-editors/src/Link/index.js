import React, {PropTypes} from 'react';
import TextInput from '@neos-project/react-ui-components/lib/TextInput/';

const LinkEditor = props => {
    const {value, commit} = props;

    return <TextInput value={value} onChange={commit}/>;
};
Link.propTypes = {
    value: PropTypes.string,
    commit: PropTypes.func.isRequired
};

export default Link;
