import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {DragSource, DropTarget} from 'react-dnd';
import {getEmptyImage} from 'react-dnd-html5-backend';
import omit from 'lodash.omit';
import mergeClassNames from 'classnames';

const spec = {
    canDrop({dragAndDropContext, mode}) {
        return dragAndDropContext.accepts(mode || 'into');
    },
    drop({dragAndDropContext, mode}) {
        dragAndDropContext.onDrop(mode || 'into');
    }
};

const collect = (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
    canDrop: monitor.canDrop(),
    isOver: monitor.isOver()
});

export const Node = props => {
    const {children, ...restProps} = props;
    const rest = omit(restProps, ['theme']);

    return (
        <div {...rest} role="treeitem">
            {children}
        </div>
    );
};
Node.propTypes = {
    children: PropTypes.node
};

@DropTarget(({nodeDndType}) => nodeDndType, spec, collect)
class NodeDropTarget extends PureComponent {
    static propTypes = {
        connectDropTarget: PropTypes.func.isRequired,
        nodeDndType: PropTypes.string.isRequired,
        canDrop: PropTypes.bool.isRequired,
        isOver: PropTypes.bool,
        theme: PropTypes.object,
        mode: PropTypes.string.isRequired
    };

    render() {
        const {connectDropTarget, isOver, canDrop, mode, theme, level} = this.props;
        const classNames = mergeClassNames({
            [theme.dropTarget]: true,
            [theme['dropTarget--before']]: mode === 'before',
            [theme['dropTarget--after']]: mode === 'after'
        });
        const classNamesInner = mergeClassNames({
            [theme.dropTarget__inner]: true,
            [theme['dropTarget__inner--acceptsDrop']]: isOver && canDrop,
            [theme['dropTarget__inner--deniesDrop']]: isOver && !canDrop
        });
        return connectDropTarget(
            <div className={classNames}>
                <div className={classNamesInner} style={{marginLeft: (level * 18) - 4}}>
                    <svg xmlns="http://www.w3.org/2000/svg" height="12" viewBox="0 0 868 334.517"><path d="M840.344 129.526l-704.456.166 73.5-68.086a26.751 26.751 0 000-37.857l-16.1-15.962a27.117 27.117 0 00-38.024-.02L7.844 148.845a26.694 26.694 0 000 37.8l146.412 140.1a27.142 27.142 0 0038.024 0l16.1-15.962a26.278 26.278 0 007.848-18.832 25.493 25.493 0 00-7.848-18.479l-73.664-67.67h705.996c14.828 0 27.288-12.661 27.288-27.344v-22.575c0-14.682-12.828-26.357-27.656-26.357z" /></svg>
                </div>
            </div>
        );
    }
}

@DragSource(({nodeDndType}) => nodeDndType, {
    beginDrag(props) {
        if (props.dragAndDropContext.onDrag) {
            props.dragAndDropContext.onDrag();
        }
        return {
            contextPath: props.id
        };
    },
    endDrag(props) {
        if (props.dragAndDropContext.onEndDrag) {
            props.dragAndDropContext.onEndDrag();
        }
    },
    canDrag({dragForbidden}) {
        return !dragForbidden;
    }
}, connect => ({
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview()
}))
@DropTarget(({nodeDndType}) => nodeDndType, spec, collect)
export class Header extends PureComponent {
    static propTypes = {
        id: PropTypes.string,
        labelIdentifier: PropTypes.string,
        nodeDndType: PropTypes.string.isRequired,
        hasChildren: PropTypes.bool.isRequired,
        isLastChild: PropTypes.bool,
        isCollapsed: PropTypes.bool.isRequired,
        isActive: PropTypes.bool.isRequired,
        isFocused: PropTypes.bool.isRequired,
        isLoading: PropTypes.bool.isRequired,
        isHidden: PropTypes.bool,
        isDirty: PropTypes.bool,
        isHiddenInIndex: PropTypes.bool,
        hasError: PropTypes.bool.isRequired,
        label: PropTypes.string.isRequired,
        icon: PropTypes.string,
        customIconComponent: PropTypes.node,
        iconLabel: PropTypes.string,
        level: PropTypes.number.isRequired,
        dragAndDropContext: PropTypes.shape({
            accepts: PropTypes.func.isRequired,
            onDrag: PropTypes.func.isRequired,
            onEndDrag: PropTypes.func.isRequired,
            onDrop: PropTypes.func.isRequired
        }),
        connectDragSource: PropTypes.func.isRequired,
        connectDropTarget: PropTypes.func.isRequired,
        canDrop: PropTypes.bool.isRequired,
        isDragging: PropTypes.bool,
        isOver: PropTypes.bool,
        dragForbidden: PropTypes.bool,

        onToggle: PropTypes.func,
        onClick: PropTypes.func,
        onLabelClick: PropTypes.func,
        theme: PropTypes.shape({/* eslint-disable quote-props */
            'header__data': PropTypes.string,
            'header__data--isActive': PropTypes.string,
            'header__data--isFocused': PropTypes.string,
            'header': PropTypes.string,
            'header__labelWrapper': PropTypes.string,
            'header__label': PropTypes.string,
            'header__chevron': PropTypes.string,
            'header__chevron--isCollapsed': PropTypes.string,
            'header__chevron--isLoading': PropTypes.string,
            'header__iconWrapper': PropTypes.string,
            'dropZone': PropTypes.string,
            'dropZone--accepts': PropTypes.string,
            'dropZone--denies': PropTypes.string
        }).isRequired, /* eslint-enable quote-props */

        //
        // Static component dependencies which are injected from the outside (index.js)
        //
        IconComponent: PropTypes.any.isRequired
    };

    componentDidMount() {
        this.props.connectDragPreview(getEmptyImage(), {
            captureDraggingState: true
        });
    }

    render() {
        const {
            id,
            labelIdentifier,
            nodeDndType,
            IconComponent,
            hasChildren,
            isLastChild,
            isActive,
            isFocused,
            isHidden,
            isHiddenInIndex,
            isDirty,
            isLoading,
            label,
            icon,
            customIconComponent,
            iconLabel,
            level,
            onClick,
            onLabelClick,
            theme,
            connectDragSource,
            connectDropTarget,
            dragAndDropContext,
            isOver,
            isDragging,
            canDrop,
            connectDragPreview,
            ...restProps
        } = this.props;
        const rest = omit(restProps, ['onToggle', 'isCollapsed', 'hasError', 'isDragging', 'dragForbidden']);
        const dataClassNames = mergeClassNames({
            [theme.header__data]: true,
            [theme['header__data--isActive']]: isActive,
            [theme['header__data--isFocused']]: isFocused,
            [theme['header__data--isLastChild']]: isLastChild,
            [theme['header__data--isHiddenInIndex']]: isHiddenInIndex,
            [theme['header__data--isHidden']]: isHidden,
            [theme['header__data--isDirty']]: isDirty,
            [theme['header__data--isDragging']]: isDragging,
            [theme['header__data--acceptsDrop']]: isOver && canDrop,
            [theme['header__data--deniesDrop']]: isOver && !canDrop
        });

        return (
            <div>
                <div className={theme.header}>
                    <NodeDropTarget
                        id={id}
                        theme={theme}
                        dragAndDropContext={dragAndDropContext}
                        nodeDndType={nodeDndType}
                        mode="before"
                        level={level}
                        />
                    {connectDropTarget(connectDragSource(
                        <div
                            role="button"
                            className={dataClassNames}
                            onClick={onClick}
                            style={{paddingLeft: (level * 18) + 'px'}}
                            >
                            <div className={theme.header__labelWrapper}>
                                <div className={theme.header__iconWrapper}>
                                    {customIconComponent ?
                                        customIconComponent :
                                        <IconComponent icon={icon || 'question'} label={iconLabel} />
                                    }
                                </div>
                                <span
                                    {...rest}
                                    id={labelIdentifier}
                                    className={theme.header__label}
                                    onClick={onLabelClick}
                                    data-neos-integrational-test="tree__item__nodeHeader__itemLabel"
                                    role="treeitem"
                                >
                                    {label}
                                </span>
                            </div>
                        </div>
                    ))}
                    {isLastChild && (
                        <NodeDropTarget
                            id={id}
                            theme={theme}
                            dragAndDropContext={dragAndDropContext}
                            nodeDndType={nodeDndType}
                            mode="after"
                            level={level}
                            />
                    )}
                    {hasChildren || isLoading ? this.renderCollapseControl() : null}
                </div>
            </div>
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
            theme,
            level
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
                icon = <IconComponent icon="sort-down"/>;
                break;
        }

        const marginLeft = ((level - 1) * 18) + 5;
        return (
            <a style={{marginLeft: marginLeft + 'px'}} role="button" onClick={onToggle} className={classnames} data-neos-integrational-test="tree__item__nodeHeader__subTreetoggle">
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
