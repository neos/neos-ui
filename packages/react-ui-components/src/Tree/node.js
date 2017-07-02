import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
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
        hasChildren: PropTypes.bool.isRequired,
        isCollapsed: PropTypes.bool.isRequired,
        isActive: PropTypes.bool.isRequired,
        isFocused: PropTypes.bool.isRequired,
        isLoading: PropTypes.bool.isRequired,
        isHidden: PropTypes.bool,
        isHiddenInIndex: PropTypes.bool,
        hasError: PropTypes.bool.isRequired,
        label: PropTypes.string.isRequired,
        icon: PropTypes.string,
        dragAndDropContext: PropTypes.shape({
            accepts: PropTypes.func.isRequired,
            onDrag: PropTypes.func.isRequired,
            onDrop: PropTypes.func.isRequired
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
            'header__chevron--isLoading': PropTypes.string,
            'header__icon': PropTypes.string,
            'dropZone': PropTypes.string,
            'dropZone--accepts': PropTypes.string,
            'dropZone--denies': PropTypes.string
        }).isRequired, /* eslint-enable quote-props */

        //
        // Static component dependencies which are injected from the outside (index.js)
        //
        IconComponent: PropTypes.any.isRequired
    };

    state = {
        acceptsDrop: null
    };

    handleDrag = () => {
        const {dragAndDropContext} = this.props;

        if (dragAndDropContext) {
            dragAndDropContext.onDrag();
        }
    };

    handleDragOver = e => {
        const {dragAndDropContext} = this.props;

        if (dragAndDropContext) {
            this.setState({
                acceptsDrop: dragAndDropContext.accepts()
            });
            e.preventDefault();
        }
    };

    handleDragLeave = () => {
        this.setState({
            acceptsDrop: null
        });
    };

    handleDrop = () => {
        const {dragAndDropContext} = this.props;

        if (dragAndDropContext) {
            dragAndDropContext.onDrop();
            this.setState({
                acceptsDrop: null
            });
        }
    };

    render() {
        const {
            IconComponent,
            hasChildren,
            isActive,
            isFocused,
            isHidden,
            isHiddenInIndex,
            label,
            icon,
            onClick,
            onLabelClick,
            theme,
            dragAndDropContext,
            ...restProps
        } = this.props;
        const {
            acceptsDrop
        } = this.state;
        const rest = omit(restProps, ['onToggle', 'isCollapsed', 'isLoading', 'hasError']);
        const dataClassNames = mergeClassNames({
            [theme.header__data]: true,
            [theme['header__data--isActive']]: isActive,
            [theme['header__data--isFocused']]: isFocused,
            [theme['header__data--isHiddenInIndex']]: isHiddenInIndex,
            [theme['header__data--isHidden']]: isHidden,
            [theme['header__data--acceptsDrop']]: acceptsDrop === true,
            [theme['header__data--deniesDrop']]: acceptsDrop === false
        });

        return (
            <ul className={theme.header}>
                {hasChildren ? this.renderCollapseControl() : null}
                <li
                    className={dataClassNames}
                    onDragStart={this.handleDrag}
                    onClick={onClick}
                    onDragOver={this.handleDragOver}
                    onDragLeave={this.handleDragLeave}
                    onDrop={this.handleDrop}
                    draggable={Boolean(dragAndDropContext)}
                    >
                    <IconComponent icon={icon || 'question'} padded="right" role="button" className={theme.header__icon}/>
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
            isLoading,
            isCollapsed,
            hasError,
            isHiddenInIndex,
            isHidden,
            onToggle,
            theme
        } = this.props;
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
