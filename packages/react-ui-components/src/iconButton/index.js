import React, {PropTypes} from 'react';
import mergeClassNames from 'classnames';
import Icon from 'Components/Icon/index';
import Button from 'Components/Button/index';
// import style from './style.css';

const IconButton = props => {
    // Since `this.props` isn't writable, we need to clone it
    // and add the component specific className to the passed props.
    const {styles, ...rest} = props;
    const finalClassName = mergeClassNames(props.className, styles.iconButton);

    return (
        <Button {...rest} className={finalClassName}>
          <Icon icon={props.icon} />
        </Button>
    );
};
IconButton.propTypes = {
    // The icon key which gets passed to the Icon Component.
    icon: PropTypes.string.isRequired,

    // Additional className for the Button.
    className: PropTypes.string,
    styles: PropTypes.object
};
IconButton.defaultProps = {
    style: 'transparent',
    hoverStyle: 'brand',
    styles: {}
};

export default IconButton;
