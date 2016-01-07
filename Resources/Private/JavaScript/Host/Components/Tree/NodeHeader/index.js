import React, {Component, PropTypes} from 'react';
import mergeClassNames from 'classnames';
import Icon from 'Host/Components/Icon/';
import style from './style.css';

class NodeHeader extends Component {
    static propTypes = {
        node: PropTypes.object.isRequired,
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
        const {
            icon,
            name,
            children,
            isActive,
            isFocused
        } = node;
        const isCollapsable = children && children.length !== 0;

        const dataClassNames = mergeClassNames({
            [style.nodeHeader__data]: true,
            [style['nodeHeader__data--isActive']]: isActive,
            [style['nodeHeader__data--isFocused']]: isFocused
        });

        return (
            <div className={style.nodeHeader}>
                {isCollapsable ? this.renderCollapseChevron() : null}
                <div onClick={onClick} className={dataClassNames}>
                    <Icon icon={icon} padded="right" />
                    <span className={style.nodeHeader__data__title} onClick={onLabelClick}>
                        {name}
                    </span>
                </div>
            </div>
        );
    }

    renderCollapseChevron() {
        const {node, onToggle} = this.props;
        const classnames = mergeClassNames({
            [style.nodeHeader__chevron]: true,
            [style['nodeHeader__chevron--isCollapsed']]: node.isCollapsed
        });

        return (
            <a onClick={onToggle} className={classnames}>
                <Icon icon="sort-desc" />
            </a>
        );
    }
}

export default NodeHeader;
