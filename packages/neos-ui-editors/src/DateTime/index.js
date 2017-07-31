import React from 'react';
import PropTypes from 'prop-types';
import DateInput from '@neos-project/react-ui-components/src/DateInput/';
import moment from 'moment';

const DateTime = props => {
    const {value, commit} = props;
    const mappedValue = (typeof value === 'string' && value.length) ? moment(value).toDate() : (value || undefined);

    return <DateInput value={mappedVal} onChange={commit}/>;
};
DateTime.propTypes = {
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
    commit: PropTypes.func.isRequired
};

export default DateTime;
