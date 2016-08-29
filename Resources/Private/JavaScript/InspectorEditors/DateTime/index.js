import React, {PropTypes} from 'react';
import {TextInput} from 'Components';

const DateTime = props => {
    const {value, commit} = props;

    return (<TextInput value={value} onChange={value => commit(value)}/>);
};

DateTime.propTypes = {
    value: PropTypes.string.isRequired,
    commit: PropTypes.func.isRequired
};

export default DateTime;
