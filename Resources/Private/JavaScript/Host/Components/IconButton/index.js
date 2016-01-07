import React, {PropTypes} from 'react';
import Icon from 'Host/Components/Icon/';
import Button from 'Host/Components/Button/';
import style from './style.css';

const IconButton = props => {
    // Since `this.props` isn't writable, we need to clone it
    // and add the component specific className to the passed props.
    const buttonProps = Object.assign({}, props, {
        className: `${props.className} ${style.iconButton}`
    });

    return (
        <Button {...buttonProps}>
          <Icon icon={props.icon} />
        </Button>
    );
};
IconButton.propTypes = {
    // The icon key which gets passed to the Icon Component.
    icon: PropTypes.string.isRequired,

    // Additional className for the Button.
    className: PropTypes.string
};
IconButton.defaultProps = {
    style: 'transparent',
    hoverStyle: 'brand'
};

export default IconButton;
