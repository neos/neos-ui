import React from 'react';
import PropTypes from 'prop-types';
import omit from 'lodash.omit';

const ButtonGroupItem = props => {
    const {element, ...restProps} = props;
    const rest = omit(restProps, ['onClick']);
    return (
        React.cloneElement(element, {
            ...rest,
            onClick: this.handleButtonClick
        })
    );
};
ButtonGroupItem.propTypes = {
    id: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
    element: PropTypes.any.isRequired
};

export default ButtonGroupItem;
