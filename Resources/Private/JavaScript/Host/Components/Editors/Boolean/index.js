import React, {PropTypes} from 'react';
import {CheckBox} from 'Host/Components';

const Boolean = props => {
    const {value, ...remainingProps} = props;
    return (<CheckBox isChecked={value} {...remainingProps} />);
};

Boolean.propTypes = {
    value: PropTypes.boolean.isRequired
};

export default Boolean;
