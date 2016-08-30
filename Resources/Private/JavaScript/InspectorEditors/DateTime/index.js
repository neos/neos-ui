import React, {PropTypes} from 'react';
import DateInput from '@neos-project/react-ui-components/lib/DateInput/';

const DateTime = props => {
    const {value, commit} = props;

    return <DateInput value={value} onChange={commit}/>;
};
DateTime.propTypes = {
    value: PropTypes.string.isRequired,
    commit: PropTypes.func.isRequired
};

export default DateTime;
