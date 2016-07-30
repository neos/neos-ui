import React, {PropTypes} from 'react';
import mergeClassNames from 'classnames';

const IconButton = props => {
    // Since `this.props` isn't writable, we need to clone it
    // and add the component specific className to the passed props.
    const {
        IconComponent,
        ButtonComponent,
        theme,
        ...rest
    } = props;
    const finalClassName = mergeClassNames(props.className, theme.iconButton);

    return (
        <ButtonComponent {...rest} className={finalClassName}>
          <IconComponent icon={props.icon} />
        </ButtonComponent>
    );
};
IconButton.propTypes = {
    // The icon key which gets passed to the Icon Component.
    icon: PropTypes.string.isRequired,

    // Additional className for the Button.
    className: PropTypes.string,
    theme: PropTypes.shape({// eslint-disable-line quote-props
        'iconButton': PropTypes.string
    }).isRequired,

    //
    // Static component dependencies which are injected from the outside (index.js)
    //
    IconComponent: PropTypes.element.isRequired,
    ButtonComponent: PropTypes.element.isRequired
};
IconButton.defaultProps = {
    style: 'transparent',
    hoverStyle: 'brand'
};

export default IconButton;
