import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import mergeClassNames from 'classnames';

class IconButton extends PureComponent {
    static propTypes = {
        /**
         * The icon key which gets passed to the Icon Component.
         */
        icon: PropTypes.string.isRequired,

        /**
         * An optional `className` to attach to the wrapper.
         */
        className: PropTypes.string,

        /**
         * Defines the size of the icon button.
         */
        size: PropTypes.oneOf(['small', 'regular']),

        /**
        * An optional css theme to be injected.
        */
        theme: PropTypes.shape({/* eslint-disable quote-props */
            'iconButton': PropTypes.string
        }).isRequired, /* eslint-enable quote-props */

        /**
         * Static component dependencies which are injected from the outside (index.js)
         */
        IconComponent: PropTypes.any.isRequired,
        ButtonComponent: PropTypes.any.isRequired,

        /**
         * Optional disabled flag
         */
        disabled: PropTypes.bool
    };

    static defaultProps = {
        size: 'regular',
        style: 'transparent',
        hoverStyle: 'brand'
    };

    render() {
        const {
            IconComponent,
            ButtonComponent,
            className,
            theme,
            icon,
            size,
            disabled,
            ...rest
        } = this.props;
        const finalClassName = mergeClassNames({
            [className]: className && className.length,
            [theme.iconButton]: true,
            [theme[`size-${size}`]]: true,
            [theme['iconButton--disabled']]: disabled
        });

        return (
            <ButtonComponent {...rest} size={size} className={finalClassName}>
                <IconComponent icon={icon}/>
            </ButtonComponent>
        );
    }
}

export default IconButton;
