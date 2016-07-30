import React, {Component, PropTypes} from 'react';
import mergeClassNames from 'classnames';

export class Node extends Component {
    static propTypes = {
        children: PropTypes.node
    };

    render() {
        const {children, ...rest} = this.props;

        return (
            <div {...rest}>
                {children}
            </div>
        );
    }
}

export class Header extends Component {
    static propTypes = {
        item: PropTypes.shape({
            hasChildren: PropTypes.bool.isRequired,
            isCollapsed: PropTypes.bool.isRequired,
            isActive: PropTypes.bool.isRequired,
            isFocused: PropTypes.bool.isRequired,
            isLoading: PropTypes.bool.isRequired,
            hasError: PropTypes.bool.isRequired,
            label: PropTypes.string.isRequired,
            icon: PropTypes.string
        }),
        onToggle: PropTypes.func,
        onClick: PropTypes.func,
        onLabelClick: PropTypes.func,
        theme: PropTypes.shape({// eslint-disable-line quote-props
            'header__data': PropTypes.string,
            'header__data--isActive': PropTypes.string,
            'header__data--isFocused': PropTypes.string,
            'header': PropTypes.string,
            'header__label': PropTypes.string,
            'header__chevron': PropTypes.string,
            'header__chevron--isCollapsed': PropTypes.string,
            'header__chevron--isLoading': PropTypes.string
        }).isRequired,

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
            theme
        } = this.props;
        const {
            label,
            icon,
            hasChildren,
            isActive,
            isFocused
        } = item;
        const dataClassNames = mergeClassNames({
            [theme.header__data]: true,
            [theme['header__data--isActive']]: isActive,
            [theme['header__data--isFocused']]: isFocused
        });

        return (
            <div className={theme.header}>
                {hasChildren ? this.renderCollapseControl() : null}
                <div role="button" onClick={() => onClick()} className={dataClassNames}>
                    <IconComponent icon={icon || 'question'} padded="right" />
                    <span className={theme.header__label} role="button" onClick={() => onLabelClick()} data-neos-integrational-test="tree__item__nodeHeader__itemLabel">
                        {label}
                    </span>
                </div>
            </div>
        );
    }

    renderCollapseControl() {
        const {
            IconComponent,
            item,
            onToggle,
            theme
        } = this.props;
        const {isLoading, isCollapsed, hasError} = item;
        const classnames = mergeClassNames({
            [theme.header__chevron]: true,
            [theme['header__chevron--isCollapsed']]: isCollapsed,
            [theme['header__chevron--isLoading']]: isLoading
        });
        let icon;

        switch (true) {
            case hasError:
                icon = <IconComponent icon="ban" />;
                break;
            case isLoading:
                icon = <IconComponent icon="spinner" spin={true} />;
                break;
            default:
                icon = <IconComponent icon="sort-desc" />;
                break;
        }

        return (
            <a role="button" onClick={() => onToggle()} className={classnames} data-neos-integrational-test="tree__item__nodeHeader__subTreetoggle">
                {icon}
            </a>
        );
    }
}

export class Contents extends Component {
    static propTypes = {
        children: PropTypes.node,
        theme: PropTypes.shape({// eslint-disable-line quote-props
            'contents': PropTypes.string
        }).isRequired
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
