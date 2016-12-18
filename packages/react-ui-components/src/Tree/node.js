import React, {PureComponent, PropTypes} from 'react';
import omit from 'lodash.omit';
import mergeClassNames from 'classnames';

export class Node extends PureComponent {
    static propTypes = {
        children: PropTypes.node
    };

    render() {
        const {children, ...restProps} = this.props;
        const rest = omit(restProps, ['theme']);

        return (
            <div {...rest}>
                {children}
            </div>
        );
    }
}

export class Header extends PureComponent {
    static propTypes = {
        item: PropTypes.shape({
            hasChildren: PropTypes.bool.isRequired,
            isCollapsed: PropTypes.bool.isRequired,
            isActive: PropTypes.bool.isRequired,
            isFocused: PropTypes.bool.isRequired,
            isLoading: PropTypes.bool.isRequired,
            isHidden: PropTypes.bool,
            isHiddenInIndex: PropTypes.bool.isRequired,
            hasError: PropTypes.bool.isRequired,
            label: PropTypes.string.isRequired,
            icon: PropTypes.string
        }),
        onToggle: PropTypes.func,
        onClick: PropTypes.func,
        onLabelClick: PropTypes.func,
        theme: PropTypes.shape({/* eslint-disable quote-props */
            'header__data': PropTypes.string,
            'header__data--isActive': PropTypes.string,
            'header__data--isFocused': PropTypes.string,
            'header': PropTypes.string,
            'header__label': PropTypes.string,
            'header__chevron': PropTypes.string,
            'header__chevron--isCollapsed': PropTypes.string,
            'header__chevron--isLoading': PropTypes.string
        }).isRequired, /* eslint-enable quote-props */

        //
        // Static component dependencies which are injected from the outside (index.js)
        //
        IconComponent: PropTypes.any.isRequired
    };

    render() {
        const {
            IconComponent,
            item,
            onClick,
            onLabelClick,
            theme,
            ...restProps
        } = this.props;
        const rest = omit(restProps, ['onToggle']);
        const {
            label,
            icon,
            hasChildren,
            isActive,
            isFocused,
            isHiddenInIndex,
            isHidden
        } = item;
        const dataClassNames = mergeClassNames({
            [theme.header__data]: true,
            [theme['header__data--isActive']]: isActive,
            [theme['header__data--isFocused']]: isFocused,
            [theme['header__data--isHiddenInIndex']]: isHiddenInIndex,
            [theme['header__data--isHidden']]: isHidden
        });

        return (
            <ul className={theme.header}>
                {hasChildren ? this.renderCollapseControl() : null}
                <li className={dataClassNames} onClick={onClick}>
                    <IconComponent icon={icon || 'question'} padded="right" role="button"/>
                    <span {...rest} className={theme.header__label} role="button" onClick={onLabelClick} data-neos-integrational-test="tree__item__nodeHeader__itemLabel">
                        {label}
                    </span>
                </li>
            </ul>
        );
    }

    renderCollapseControl() {
        const {
            IconComponent,
            item,
            onToggle,
            theme
        } = this.props;
        const {isLoading, isCollapsed, hasError, isHiddenInIndex, isHidden} = item;
        const classnames = mergeClassNames({
            [theme.header__chevron]: true,
            [theme['header__chevron--isCollapsed']]: isCollapsed,
            [theme['header__chevron--isLoading']]: isLoading,
            [theme['header__chevron--isHiddenInIndex']]: isHiddenInIndex,
            [theme['header__chevron--isHidden']]: isHidden
        });
        let icon;

        switch (true) {
            case hasError:
                icon = <IconComponent icon="ban"/>;
                break;
            case isLoading:
                icon = <IconComponent icon="spinner" spin={true}/>;
                break;
            default:
                icon = <IconComponent icon="sort-desc"/>;
                break;
        }

        return (
            <a role="button" onClick={onToggle} className={classnames} data-neos-integrational-test="tree__item__nodeHeader__subTreetoggle">
                {icon}
            </a>
        );
    }
}

export class Contents extends PureComponent {
    static propTypes = {
        children: PropTypes.node,
        theme: PropTypes.shape({/* eslint-disable quote-props */
            'contents': PropTypes.string
        }).isRequired/* eslint-enable quote-props */
    };

    render() {
        const {theme, children} = this.props;

        return (
            <div className={theme.contents}>
                {children}
            </div>
        );
    }
}

export default Node;
