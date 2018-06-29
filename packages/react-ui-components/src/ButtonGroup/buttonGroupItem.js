import React from 'react';
import PropTypes from 'prop-types';
import omit from 'lodash.omit';

const ButtonGroupItem = props => {
    const handleButtonClick = () => {
        props.onClick(props.id);
    };

    const {element, ...restProps} = props;
    const rest = omit(restProps, ['onClick']);
    return (
        React.cloneElement(element, {
            ...rest,
            onClick: handleButtonClick
        })
    );
};
ButtonGroupItem.propTypes = {
    id: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
    element: PropTypes.any.isRequired
};

export default ButtonGroupItem;
