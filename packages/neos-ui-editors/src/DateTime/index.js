import React from 'react';
import PropTypes from 'prop-types';
import DateInput from '@neos-project/react-ui-components/src/DateInput/';
import moment from 'moment';

const DateTime = props => {
    const {value, commit} = props;
    const mappedValue = (typeof value === 'string' && value.length) ? moment(value).toDate() : (value || undefined);

    const onChange = date => {
        commit(moment(date).format('YYYY-MM-DDTHH:MM:SSZ'));
    };

    return <DateInput value={mappedValue} onChange={onChange}/>;
};

DateTime.propTypes = {
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
    commit: PropTypes.func.isRequired
};

export default DateTime;
