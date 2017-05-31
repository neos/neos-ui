import React from 'react';
import PropTypes from 'prop-types';
import DateInput from '@neos-project/react-ui-components/src/DateInput/';

const DateTime = props => {
    const {value, commit} = props;
    const mappedVal = value && value.length ? value : undefined;

    return <DateInput value={mappedVal} onChange={commit}/>;
};
DateTime.propTypes = {
    value: PropTypes.string,
    commit: PropTypes.func.isRequired
};

export default DateTime;
