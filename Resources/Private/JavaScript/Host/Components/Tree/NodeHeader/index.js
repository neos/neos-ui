import React, {Component, PropTypes} from 'react';
import Immutable from 'immutable';
import mergeClassNames from 'classnames';
import Icon from 'Host/Components/Icon/';
import {nodeTypeManager} from 'Host/Service/';
import {immutableOperations} from 'Shared/Util';
import style from './style.css';

const {$get} = immutableOperations;

class NodeHeader extends Component {
    static propTypes = {
        node: PropTypes.instanceOf(Immutable.Map),
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

        const label = $get(node, 'label');
        const icon = $get(node, 'icon') || nodeTypeManager.getIconForNodeType($get(node, 'nodeType')) || 'question';
        const children = $get(node, 'children');
        const isActive = $get(node, 'isActive');
        const isFocused = $get(node, 'isFocused');
        const isCollapsable = $get(node, 'isCollapsable');

        const dataClassNames = mergeClassNames({
            [style.nodeHeader__data]: true,
            [style['nodeHeader__data--isActive']]: isActive,
            [style['nodeHeader__data--isFocused']]: isFocused
        });

        const collapsableControl = (isCollapsable ? this.renderCollapseChevron() : null);

        return (
            <div className={style.nodeHeader}>
                {collapsableControl}
                <div onClick={() => onClick(node)} className={dataClassNames}>
                    <Icon icon={icon} padded="right" />
                    <span className={style.nodeHeader__data__title} onClick={() => onLabelClick(node)}>
                        {label}
                    </span>
                </div>
            </div>
        );
    }

    renderCollapseChevron() {
        const {node, onToggle} = this.props;
        const classnames = mergeClassNames({
            [style.nodeHeader__chevron]: true,
            [style['nodeHeader__chevron--isCollapsed']]: $get(node, 'isCollapsed'),
            [style['nodeHeader__chevron--isLoading']]: $get(node, 'isLoading')
        });

        const isLoading = $get(node, 'isLoading');

        const icon = (isLoading ? <Icon icon="spinner" spin={true} />  : <Icon icon="sort-desc" />);

        return (
            <a onClick={() => onToggle(node)} className={classnames}>
                {icon}
            </a>
        );
    }
}

export default NodeHeader;
