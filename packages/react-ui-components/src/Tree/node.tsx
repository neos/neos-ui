// tslint:disable:max-classes-per-file
import React, {PureComponent, ReactNode} from 'react';
import PropTypes from 'prop-types';
import {DragSource, DropTarget, DndComponent} from 'react-dnd';
import {omit} from 'lodash';
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

interface NodeProps extends Readonly<{
    children: ReactNode;
}> {}

export const Node = (props: NodeProps) => {
    const {children, ...restProps} = props;
    const rest = omit(restProps, ['theme']);

    return (
        <div {...rest} role="treeitem">
            {children}
        </div>
    );
};

interface NodeDropTargetProps extends Readonly<{
    connectDropTarget: (node: ReactNode) => ReactNode;
    nodeDndType: string;
    canDrop: boolean;
    isOver?: boolean;
    theme?: NodeDropTargetTheme;
    mode: string;
    dragAndDropContext: any; // TODO
}> {}

interface NodeDropTargetTheme extends Readonly<{
    'dropTarget': string;
    'dropTarget--before': string;
    'dropTarget--after': string;
    'dropTarget__inner': string;
    'dropTarget__inner--acceptsDrop': string;
}> {}

@DropTarget<NodeDropTargetProps>(
    ({nodeDndType}) => nodeDndType,
    {
        canDrop: ({dragAndDropContext, mode}) => dragAndDropContext.accepts(mode || 'into'),
        drop: ({dragAndDropContext, mode}) => {
            dragAndDropContext.onDrop(mode || 'into');
        },
    },
    (connect, monitor) => ({
        connectDropTarget: connect.dropTarget(),
        canDrop: monitor.canDrop(),
        isOver: monitor.isOver(),
    }),
)
class NodeDropTarget extends PureComponent<NodeDropTargetProps> {
    public render(): ReactNode {
        const {connectDropTarget, isOver, canDrop, mode, theme} = this.props;
        const classNames = mergeClassNames(
            theme!.dropTarget,
            {
                [theme!['dropTarget--before']]: mode === 'before',
                [theme!['dropTarget--after']]: mode === 'after'
            }
        );
        const classNamesInner = mergeClassNames(
            theme!.dropTarget__inner,
            {
                [theme!['dropTarget__inner--acceptsDrop']]: isOver && canDrop
            }
        );

        return connectDropTarget(
            <div className={classNames}>
                <div className={classNamesInner}/>
            </div>
        );
    }
}

interface HeaderProps extends Readonly<{
    id?: string;
    labelIdentifier?: string;
    nodeDndType: string;
    hasChildren: boolean;
    isLastChild?: boolean;
    isCollapsed: boolean;
    isActive: boolean;
    isFocused: boolean;
    isLoading: boolean;
    isHidden?: boolean;
    isDirty?: boolean;
    isHiddenInIndex?: boolean;
    hasError: boolean;
    label: string;
    icon?: string;
    customIconComponent?: ReactNode; // TODO or ReactElement<SomeIconComponentSpecificProps>
    iconLabel?: string;
    level: number;
    dragAndDropContext?: any; // TODO
    connectDragSource: (node: ReactNode) => ReactNode;
    connectDropTarget: (node: ReactNode) => ReactNode;
    canDrop: boolean;
    isDragging?: boolean;
    isOver?: boolean;
    dragForbidden?: boolean;

    onToggle?: () => void; // TODO
    onClick?: () => void; // TODO
    onLabelClick?: () => void;
    theme?: HeaderTheme;
}> {}

interface HeaderTheme extends Readonly<{
    'header': string,
    'header__data': string,
    'header__data--isActive': string,
    'header__data--isFocused': string,
    'header__data--isLastChild': string;
    'header__data--isHiddenInIndex': string;
    'header__data--isHidden': string;
    'header__data--isDirty': string;
    'header__data--isDragging': string;
    'header__data--acceptsDrop': string;
    'header__data--deniesDrop': string;
    'header__labelWrapper': string,
    'header__label': string,
    'header__chevron': string,
    'header__chevron--isCollapsed': string,
    'header__chevron--isLoading': string,
    'header__iconWrapper': string,
    'dropZone': string,
    'dropZone--accepts': string,
    'dropZone--denies': string
}> {}

@DragSource<HeaderProps>(
    ({nodeDndType}) => nodeDndType,
    {
        beginDrag: (props) => {
            props.dragAndDropContext.onDrag();
            return {
                contextPath: props.id
            }
        },
        canDrag: ({dragForbidden}) => {
            return !dragForbidden;
        }
    },
    (connect, monitor) => ({
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging()
    }),
)
@DropTarget<any>(
    ({nodeDndType}) => nodeDndType,
    {
        canDrop: ({dragAndDropContext, mode}) => dragAndDropContext.accepts(mode || 'into'),
        drop: ({dragAndDropContext, mode}) => {
            dragAndDropContext.onDrop(mode || 'into');
        },
    },
    (connect, monitor) => ({
        connectDropTarget: connect.dropTarget(),
        canDrop: monitor.canDrop(),
        isOver: monitor.isOver(),
    }),
)
export class Header extends PureComponent<HeaderProps> {
    public render(): ReactNode {
        const {
            id,
            labelIdentifier,
            nodeDndType,
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
            ...restProps
        } = this.props;
        const rest = omit(restProps, ['onToggle', 'isCollapsed', 'hasError', 'isDragging', 'dragForbidden']);
        const dataClassNames = mergeClassNames(
            theme!.header__data,
            {
                [theme!['header__data--isActive']]: isActive,
                [theme!['header__data--isFocused']]: isFocused,
                [theme!['header__data--isLastChild']]: isLastChild,
                [theme!['header__data--isHiddenInIndex']]: isHiddenInIndex,
                [theme!['header__data--isHidden']]: isHidden,
                [theme!['header__data--isDirty']]: isDirty,
                [theme!['header__data--isDragging']]: isDragging,
                [theme!['header__data--acceptsDrop']]: isOver && canDrop,
                [theme!['header__data--deniesDrop']]: isOver && !canDrop,
            },
        );

        return connectDragSource(
            <div>
                <div className={theme.header}>
                    <NodeDropTarget
                        id={id}
                        theme={theme}
                        dragAndDropContext={dragAndDropContext}
                        nodeDndType={nodeDndType}
                        mode="before"
                        />
                    {connectDropTarget(
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
                    )}
                    {isLastChild && (
                        <NodeDropTarget
                            id={id}
                            theme={theme}
                            dragAndDropContext={dragAndDropContext}
                            nodeDndType={nodeDndType}
                            mode="after"
                            />
                    )}
                    {hasChildren || isLoading ? this.renderCollapseControl() : null}
                </div>
            </div>
        );
    }

    private renderCollapseControl() {
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
