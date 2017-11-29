import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import mergeClassNames from 'classnames';

export default class ListPreviewElement extends PureComponent {
    static propTypes = {
        onClick: PropTypes.func.isRequired,

        children: PropTypes.node.isRequired,

        icon: PropTypes.string,

        className: PropTypes.string,

        isHighlighted: PropTypes.bool,

        onMouseEnter: PropTypes.func,
        role: PropTypes.string,

        /**
         * An optional css theme to be injected.
         */
        theme: PropTypes.shape({/* eslint-disable quote-props */
            'selectBox__item': PropTypes.string,
            'selectBox__item--isSelectable': PropTypes.string,
            'selectBox__item--isSelectable--active': PropTypes.string,
            'selectBox__itemIcon': PropTypes.string
        }).isRequired, /* eslint-enable quote-props */

        //
        // Static component dependencies which are injected from the outside (index.js)
        //
        IconComponent: PropTypes.any.isRequired
    }

    static defaultProps = {
        role: 'option'
    }

    render() {
        const {
            onClick,
            children,
            icon,
            className,
            theme,
            IconComponent,
            isHighlighted,
            onMouseEnter,
            role
        } = this.props;
        const optionClassName = mergeClassNames({
            [theme.selectBox__item]: true,
            [theme['selectBox__item--isSelectable']]: true,
            [theme['selectBox__item--isSelectable--active']]: isHighlighted,
            [className]: className
        });

        return (
            <div onMouseEnter={onMouseEnter} role={role}>
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
            </div>
        );
    }
}
