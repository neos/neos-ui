import React, {Component} from 'react';
import mergeClassNames from 'classnames';
import Icon from '../../Icon/';
import style from './style.css';

class NodeHeader extends Component {
    static propTypes = {
        icon: React.PropTypes.string.isRequired,
        title: React.PropTypes.string.isRequired,
        isCollapsable: React.PropTypes.bool.isRequired,
        isCollapsed: React.PropTypes.bool.isRequired,
        isActive: React.PropTypes.bool.isRequired,
        onClick: React.PropTypes.func,
        onToggle: React.PropTypes.func
    };

    render() {
        const {
            icon,
            title,
            onClick,
            isCollapsable,
            isActive
        } = this.props;
        const dataClassNames = mergeClassNames({
            [style.nodeHeader__data]: true,
            [style['nodeHeader__data--isActive']]: isActive
        });

        return (
            <div className={style.nodeHeader}>
                {isCollapsable ? this.renderCollapseChevron() : null}
                <div onClick={onClick} className={dataClassNames}>
                    <Icon icon={icon} padded="right" />
                    <span className={style.nodeHeader__data__title}>{title}</span>
                </div>
            </div>
        );
    }

    renderCollapseChevron() {
        const {isCollapsed, onToggle} = this.props;
        const classnames = mergeClassNames({
            [style.nodeHeader__chevron]: true,
            [style['nodeHeader__chevron--isCollapsed']]: isCollapsed
        });

        return (
            <a onClick={onToggle} className={classnames}>
                <Icon icon="sort-desc" />
            </a>
        );
    }
}
NodeHeader.defaultProps = {
    isCollapsable: false,
    isCollapsed: true,
    isActive: false
};

export default NodeHeader;
