import React, {PureComponent, useEffect, useRef} from 'react';
import PropTypes from 'prop-types';
import {useDrag, useDrop} from 'react-dnd';
import {getEmptyImage} from 'react-dnd-html5-backend';
import omit from 'lodash.omit';
import mergeClassNames from 'classnames';

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

const NodeDropTarget = props => {
    const {nodeDndType, dragAndDropContext, mode, theme, level} = props;

    const [{isOver, canDrop}, dropRef] = useDrop({
        accept: nodeDndType,
        canDrop: () => dragAndDropContext.accepts(mode || 'into'),
        drop: () => dragAndDropContext.onDrop(mode || 'into'),
        collect: monitor => ({
            isOver: monitor.isOver(),
            canDrop: monitor.canDrop()
        })
    });

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

    return (
        <div ref={dropRef} className={classNames}>
            <div className={classNamesInner} style={{marginLeft: (level * 18) - 4}}>
                <svg xmlns="http://www.w3.org/2000/svg" height="12" viewBox="0 0 868 334.517"><path d="M840.344 129.526l-704.456.166 73.5-68.086a26.751 26.751 0 000-37.857l-16.1-15.962a27.117 27.117 0 00-38.024-.02L7.844 148.845a26.694 26.694 0 000 37.8l146.412 140.1a27.142 27.142 0 0038.024 0l16.1-15.962a26.278 26.278 0 007.848-18.832 25.493 25.493 0 00-7.848-18.479l-73.664-67.67h705.996c14.828 0 27.288-12.661 27.288-27.344v-22.575c0-14.682-12.828-26.357-27.656-26.357z" /></svg>
            </div>
        </div>
    );
};

NodeDropTarget.propTypes = {
    nodeDndType: PropTypes.string.isRequired,
    dragAndDropContext: PropTypes.shape({
        accepts: PropTypes.func.isRequired,
        onDrop: PropTypes.func.isRequired
    }).isRequired,
    theme: PropTypes.object,
    mode: PropTypes.string.isRequired,
    level: PropTypes.number
};

export const Header = props => {
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
        isCollapsed,
        hasError,
        label,
        icon,
        customIconComponent,
        iconLabel,
        directLink,
        level,
        onClick,
        onLabelClick,
        theme,
        dragAndDropContext,
        dragForbidden,
        onToggle,
        ...restProps
    } = props;

    const dragPreviewRef = useRef(null);

    // Set up drag source
    const [{isDragging}, dragRef, dragPreview] = useDrag({
        type: nodeDndType,
        item: () => {
            if (dragAndDropContext?.onDrag) {
                dragAndDropContext.onDrag();
            }
            return {
                contextPath: id
            };
        },
        end: () => {
            if (dragAndDropContext?.onEndDrag) {
                dragAndDropContext.onEndDrag();
            }
        },
        canDrag: () => !dragForbidden,
        collect: monitor => ({
            isDragging: monitor.isDragging()
        })
    });

    // Set up drop target
    const [{isOver, canDrop}, dropRef] = useDrop({
        accept: nodeDndType,
        canDrop: () => dragAndDropContext?.accepts('into') || false,
        drop: () => dragAndDropContext?.onDrop('into'),
        collect: monitor => ({
            isOver: monitor.isOver(),
            canDrop: monitor.canDrop()
        })
    });

    // Use empty image as drag preview
    useEffect(() => {
        dragPreview(getEmptyImage(), {
            captureDraggingState: true
        });
    }, [dragPreview]);

    const rest = omit(restProps, ['onToggle', 'isCollapsed', 'hasError', 'isDragging', 'dragForbidden', 'connectDragPreview']);
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

    let linkHandlingProps = {onClick: onLabelClick};
    if (directLink) {
        linkHandlingProps = {
            href: directLink,
            target: '_blank',
            rel: 'noopener noreferrer',
            onClick: (event) => event.preventDefault()
        };
    }

    // Connect the drag and drop refs
    const dragDropRef = ref => {
        dragRef(ref);
        dropRef(ref);
    };

    const renderCollapseControl = () => {
        const classnames = mergeClassNames({
            [theme.header__chevron]: true,
            [theme['header__chevron--isCollapsed']]: isCollapsed,
            [theme['header__chevron--isLoading']]: isLoading,
            [theme['header__chevron--isHiddenInIndex']]: isHiddenInIndex,
            [theme['header__chevron--isHidden']]: isHidden
        });
        let iconElement;

        switch (true) {
            case hasError:
                iconElement = <IconComponent icon="ban"/>;
                break;
            case isLoading:
                iconElement = <IconComponent icon="spinner" spin={true}/>;
                break;
            default:
                iconElement = <IconComponent icon="sort-down"/>;
                break;
        }

        const marginLeft = ((level - 1) * 18) + 5;
        return (
            <a style={{marginLeft: marginLeft + 'px'}} role="button" onClick={onToggle} className={classnames} data-neos-integrational-test="tree__item__nodeHeader__subTreetoggle">
                {iconElement}
            </a>
        );
    };

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
                <div
                    ref={dragDropRef}
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
                        <a
                            {...rest}
                            id={labelIdentifier}
                            className={theme.header__label}
                            data-neos-integrational-test="tree__item__nodeHeader__itemLabel"
                            role="treeitem"
                            {...linkHandlingProps}
                        >
                            {label}
                        </a>
                    </div>
                </div>
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
                {hasChildren || isLoading ? renderCollapseControl() : null}
            </div>
        </div>
    );
};

Header.propTypes = {
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
    directLink: PropTypes.string,
    level: PropTypes.number.isRequired,
    dragAndDropContext: PropTypes.shape({
        accepts: PropTypes.func.isRequired,
        onDrag: PropTypes.func.isRequired,
        onEndDrag: PropTypes.func.isRequired,
        onDrop: PropTypes.func.isRequired
    }),
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
