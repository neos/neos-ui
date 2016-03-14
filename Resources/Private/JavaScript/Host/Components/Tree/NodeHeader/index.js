import React, {Component, PropTypes} from 'react';
import mergeClassNames from 'classnames';

import Icon from 'Host/Components/Icon/index';

import style from './style.css';

export default class NodeHeader extends Component {
    static propTypes = {
        node: PropTypes.object,
        onToggle: PropTypes.func,
        onClick: PropTypes.func,
        onLabelClick: PropTypes.func
    };

    render() {
        const {
            node,
            onClick,
            onLabelClick
        } = this.props;

        const {label, icon, hasChildren, isActive, isFocused} = node;

        const dataClassNames = mergeClassNames({
            [style.nodeHeader__data]: true,
            [style['nodeHeader__data--isActive']]: isActive,
            [style['nodeHeader__data--isFocused']]: isFocused
        });

        const collapsibleControl = (hasChildren ? this.renderCollapseChevron() : null);

        return (
            <div className={style.nodeHeader}>
                {collapsibleControl}
                <div onClick={() => onClick(node)} className={dataClassNames}>
                    <Icon icon={icon || 'question'} padded="right" />
                    <span className={style.nodeHeader__dataTitle} onClick={() => onLabelClick(node)} data-neos-integrational-test="tree__item__nodeHeader__itemLabel">
                        {label}
                    </span>
                </div>
            </div>
        );
    }

    renderCollapseChevron() {
        const {node, onToggle} = this.props;
        const {isLoading, isCollapsed, hasError} = node;
        const classnames = mergeClassNames({
            [style.nodeHeader__chevron]: true,
            [style['nodeHeader__chevron--isCollapsed']]: isCollapsed,
            [style['nodeHeader__chevron--isLoading']]: isLoading
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
            <a onClick={() => onToggle(node)} className={classnames} data-neos-integrational-test="tree__item__nodeHeader__subTreetoggle">
                {icon}
            </a>
        );
    }
}
