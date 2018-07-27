import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import mergeClassNames from 'classnames';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import mapper from './mapper';

class Icon extends PureComponent {
    static propTypes = {

        /**
         * We use the react component FortAwesome provides to render icons.
         * we will pass down all props to the component via {...rest} to expose it's api
         * https://github.com/FortAwesome/react-fontawesome/blob/master/README.md
         */

        /**
         * The ID of the icon to render.
         */
        icon: PropTypes.string.isRequired,

        /**
         * The (accessibility) label for this icon
         */
        label: PropTypes.string,

        /**
         * Controls the padding around the icon in a standardized way.
         */
        padded: PropTypes.oneOf(['none', 'left', 'right']),

        /**
         * An optional `className` to attach to the wrapper.
         */
        className: PropTypes.string,

        /**
         *  Adjust the color of the icon
         */
        color: PropTypes.oneOf(['default', 'warn', 'error', 'primaryBlue']),

        /**
        * An optional css theme to be injected.
        */
        theme: PropTypes.shape({
            icon: PropTypes.string,
            'icon--big': PropTypes.string,
            'icon--small': PropTypes.string,
            'icon--tiny': PropTypes.string,
            'icon--paddedLeft': PropTypes.string,
            'icon--paddedRight': PropTypes.string,
            'icon--spin': PropTypes.string
        }).isRequired
    };

    render() {
        const {padded, theme, label, icon, className, color, ...rest} = this.props;
        if (!icon || typeof icon !== 'string') {
            return null;
        }
        const iconClassName = icon;
        const classNames = mergeClassNames({
            [theme.icon]: true,
            [iconClassName]: true,
            [className]: className && className.length,
            [theme['icon--paddedLeft']]: padded === 'left',
            [theme['icon--paddedRight']]: padded === 'right',
            [theme['icon--color-warn']]: color === 'warn',
            [theme['icon--color-error']]: color === 'error',
            [theme['icon--color-primaryBlue']]: color === 'primaryBlue'
        });

        const mappedIcon = mapper(icon);
        const iconArray = mappedIcon.split(' ');
        let processedIcon = mappedIcon;
        let prefix = 'fas';
        if (iconArray.length > 1) {
            prefix = iconArray[0];
            const iconClass = iconArray[1];
            if (iconClass.startsWith('fa-')) {
                processedIcon = iconClass.substr(3);
            } else {
                processedIcon = iconClass;
            }
        }

        return <FontAwesomeIcon icon={[prefix, processedIcon] || 'question'} aria-label={label} className={classNames} {...rest} />;
    }
}

export default Icon;
