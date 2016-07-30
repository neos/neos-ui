import React, {PropTypes} from 'react';
import mergeClassNames from 'classnames';
import Icon from './../icon/index';
import Button from './../button/index';

const IconButton = props => {
    // Since `this.props` isn't writable, we need to clone it
    // and add the component specific className to the passed props.
    const {theme, ...rest} = props;
    const finalClassName = mergeClassNames(props.className, theme.iconButton);

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
    theme: PropTypes.shape({// eslint-disable-line quote-props
        'iconButton': PropTypes.string
    }).isRequired
};
IconButton.defaultProps = {
    style: 'transparent',
    hoverStyle: 'brand'
};

export default IconButton;
