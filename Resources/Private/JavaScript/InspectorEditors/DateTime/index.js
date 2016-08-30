import React, {PropTypes} from 'react';
import TextInput from '@neos-project/react-ui-components/lib/TextInput/';

const DateTime = props => {
    const {value, commit} = props;

    return (<TextInput value={value} onChange={commit}/>);
};
DateTime.propTypes = {
    value: PropTypes.string.isRequired,
    commit: PropTypes.func.isRequired
};

export default DateTime;
