import React from 'react';
import PropTypes from 'prop-types';

const DropDownItem = props => {
    const handleClick = () => {
        const {onClick, id} = props;
        onClick(id);
    };

    const {children, ...rest} = props;

    return (
        <a
            {...rest}
            role="button"
            onClick={handleClick}
            >
            {children}
        </a>
    );
};
DropDownItem.propTypes = {
    /**
     * The handler to call when clicking on the item of the DropDown.
     */
    onClick: PropTypes.func.isRequired,

    /**
     * The ID to reference the clicked item in the `onClick` handker.
     */
    id: PropTypes.string.isRequired,

    /**
     * The children to render within the anchor.
     */
    children: PropTypes.element.isRequired
};

export default DropDownItem;
