import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import mergeClassNames from 'classnames';

export default class SelectBoxOption extends PureComponent {
    static propTypes = {
        onClick: PropTypes.func.isRequired,

        children: PropTypes.node.isRequired,

        icon: PropTypes.string,

        className: PropTypes.string,

        isActive: PropTypes.bool,

        /**
         * An optional css theme to be injected.
         */
        theme: PropTypes.shape({/* eslint-disable quote-props */
            'selectBox__item': PropTypes.string,
            'selectBox__item--isSelectable': PropTypes.string,
            'selectBox__itemIcon': PropTypes.string
        }).isRequired, /* eslint-enable quote-props */

        //
        // Static component dependencies which are injected from the outside (index.js)
        // Used in sub-components
        //
        IconComponent: PropTypes.any.isRequired
    }

    render() {
        const {
            onClick,
            children,
            icon,
            className,
            theme,
            IconComponent,
            isActive
        } = this.props;
        const optionClassName = mergeClassNames({
            [theme.selectBox__item]: true,
            [theme['selectBox__item--isSelectable']]: true,
            [theme['selectBox__item--isSelectable--active']]: isActive,
            [className]: className
        });

        return (
            <li
                onClick={onClick}
                role="button"
                className={optionClassName}
                >
                {
                    icon ?
                        <IconComponent className={theme.selectBox__itemIcon} icon={icon}/> :
                        null
                }
                {children}
            </li>
        );
    }
}
