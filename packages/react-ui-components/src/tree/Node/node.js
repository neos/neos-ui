import React, {Component, PropTypes} from 'react';
import mergeClassNames from 'classnames';
import Icon from 'Components/Icon/index';
// import style from './style.css';

export class Node extends Component {
    static propTypes = {
        className: PropTypes.string,
        children: PropTypes.node
    };

    render() {
        const {className, children, ...rest} = this.props;

        return (
            <div {...rest} className={className}>
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
        style: PropTypes.object
    };

    static defaultProps = {
        style: {}
    };

    render() {
        const {item, onClick, onLabelClick, style} = this.props;
        const {label, icon, hasChildren, isActive, isFocused} = item;
        const dataClassNames = mergeClassNames({
            [style.header__data]: true,
            [style['header__data--isActive']]: isActive,
            [style['header__data--isFocused']]: isFocused
        });

        return (
            <div className={style.header}>
                {hasChildren ? this.renderCollapseControl() : null}
                <div role="button" onClick={() => onClick()} className={dataClassNames}>
                    <Icon icon={icon || 'question'} padded="right" />
                    <span className={style.header__label} role="button" onClick={() => onLabelClick()} data-neos-integrational-test="tree__item__nodeHeader__itemLabel">
                        {label}
                    </span>
                </div>
            </div>
        );
    }

    renderCollapseControl() {
        const {item, onToggle, style} = this.props;
        const {isLoading, isCollapsed, hasError} = item;
        const classnames = mergeClassNames({
            [style.header__chevron]: true,
            [style['header__chevron--isCollapsed']]: isCollapsed,
            [style['header__chevron--isLoading']]: isLoading
        });
        let icon;

        switch (true) {
            case hasError:
                icon = <Icon icon="ban" />;
                break;
            case isLoading:
                icon = <Icon icon="spinner" spin={true} />;
                break;
            default:
                icon = <Icon icon="sort-desc" />;
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
        style: PropTypes.object
    };

    static defaultProps = {
        style: {}
    };

    render() {
        const {style, children} = this.props;

        return (<div className={style.contents}>
            {children}
        </div>);
    }
}

Node.Header = Header;
Node.Contents = Contents;

export default Node;
