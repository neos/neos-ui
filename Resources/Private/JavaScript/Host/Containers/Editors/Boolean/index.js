import React, {PropTypes} from 'react';
import {CheckBox} from 'Components/index';

const Boolean = props => {
    const {value, ...remainingProps} = props;
    return (<CheckBox isChecked={value} {...remainingProps} />);
};

Boolean.propTypes = {
    value: PropTypes.bool.isRequired
};

export default Boolean;
