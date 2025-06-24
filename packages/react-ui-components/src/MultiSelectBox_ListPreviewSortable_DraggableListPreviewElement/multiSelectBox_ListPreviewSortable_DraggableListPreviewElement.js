/* eslint-disable camelcase, react/jsx-pascal-case */
import React, {useRef} from 'react';
import PropTypes from 'prop-types';
import mergeClassNames from 'classnames';
import {useDrag, useDrop} from 'react-dnd';

/**
 * **MultiSelectBox_ListPreviewSortable_DraggableListPreviewElement is an internal implementation detail of MultiSelectBox**, meant to improve code quality.
 *
 * It is used inside MultiSelectBox_ListPreviewSortable for rendering an individual element and implementing drag&drop behavior.
 */
const spec = {
    hover(props, monitor, component) {
        const dragIndex = monitor.getItem().index;
        const hoverIndex = props.index;

        if (dragIndex === hoverIndex) {
            return;
        }
        const hoverBoundingRect = component.node.getBoundingClientRect();
        const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
        const clientOffset = monitor.getClientOffset();
        const hoverClientY = clientOffset.y - hoverBoundingRect.top;
        if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
            return;
        }

        if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
            return;
        }

        props.onMoveSelectedValue(dragIndex, hoverIndex);

        // Note: we're mutating the monitor item here!
        // Generally it's better to avoid mutations,
        // but it's good here for the sake of performance
        // to avoid expensive index searches.
        monitor.getItem().index = hoverIndex;
    },
    drop(props) {
        props.onSelectedValueWasMoved();
    }
};

const MultiSelectBox_ListPreviewSortable_DraggableListPreviewElement = props => {
    const {
        option,
        disabled,
        allowDragging,
        dndType,
        isDragging,
        InnerListPreviewElement,
        theme,
        values,
        onRemoveItem,
        index,
        IconButton,
        onItemClick,
        onMoveSelectedValue,
        onSelectedValueWasMoved
    } = props;

    const nodeRef = useRef(null);

    const [{isDragging: dragging}, dragRef] = useDrag({
        type: dndType,
        item: () => {
            return {
                index
            };
        },
        canDrag: () => allowDragging && !disabled && (values && values.length > 1),
        collect: monitor => ({
            isDragging: monitor.isDragging()
        })
    });

    const [, dropRef] = useDrop({
        accept: dndType,
        hover: (item, monitor) => {
            const dragIndex = item.index;
            const hoverIndex = index;

            if (dragIndex === hoverIndex) {
                return;
            }

            if (!nodeRef.current) {
                return;
            }

            const hoverBoundingRect = nodeRef.current.getBoundingClientRect();
            const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
            const clientOffset = monitor.getClientOffset();
            const hoverClientY = clientOffset.y - hoverBoundingRect.top;

            if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
                return;
            }

            if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
                return;
            }

            onMoveSelectedValue(dragIndex, hoverIndex);

            // Note: we're mutating the monitor item here!
            // Generally it's better to avoid mutations,
            // but it's good here for the sake of performance
            // to avoid expensive index searches.
            item.index = hoverIndex;
        },
        drop: () => {
            onSelectedValueWasMoved();
        }
    });

    const handleClick = () => {
        if (onItemClick) {
            onItemClick(option);
        }
    };

    // TODO Loading State: const {icon, label} = option || {label: `[Loading ${value}]`};

    const isDraggable = allowDragging && !disabled && (values && values.length > 1);

    const finalClassNames = mergeClassNames({
        [theme.selectedOptions__item]: true,
        [theme['selectedOptions__item--draggable']]: isDraggable
    });
    const opacity = dragging ? 0 : 1;

    const handleRemoveItem = () => disabled ? null : onRemoveItem(index);

    // Connect the drag and drop refs
    const dragDropRef = ref => {
        dragRef(ref);
        dropRef(ref);
    };

    return (
        <li style={{opacity}} ref={node => {
            nodeRef.current = node;
            dragDropRef(node);
        }}>
            <div className={finalClassNames}>
                {isDraggable && (
                    <IconButton
                        icon={'grip-lines-vertical'}
                        className={theme.selectedOption__moveButton}
                        hoverStyle={'clean'}
                        />
                )}
                {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
                <div
                    className={theme.selectedOptions__innerPreview}
                    onClick={onItemClick ? handleClick : null}
                    role={onItemClick ? 'button' : null}
                >
                    <InnerListPreviewElement
                        {...props}
                        isHighlighted={false}
                        option={option}
                        />
                </div>
                <IconButton
                    disabled={disabled}
                    icon={'close'}
                    onClick={handleRemoveItem}
                    className={theme.selectedOption__removeButton}
                    />
            </div>
        </li>
    );
};

MultiSelectBox_ListPreviewSortable_DraggableListPreviewElement.propTypes = {
    // For explanations of the PropTypes, see MultiSelectBox.js
    option: PropTypes.shape({
    }),
    values: PropTypes.arrayOf(PropTypes.string),
    disabled: PropTypes.bool,
    allowDragging: PropTypes.bool,

    // Drag&Drop specific propTypes
    dndType: PropTypes.string.isRequired,

    // API with MultiSelectBox_ListPreviewSortable
    InnerListPreviewElement: PropTypes.any.isRequired,
    onMoveSelectedValue: PropTypes.func.isRequired,
    onSelectedValueWasMoved: PropTypes.func.isRequired,
    onRemoveItem: PropTypes.func.isRequired,
    onItemClick: PropTypes.func,
    index: PropTypes.number.isRequired,

    // Dependency Injection & Theme
    theme: PropTypes.shape({
        'selectedOptions__item': PropTypes.string,
        'selectedOptions__item--draggable': PropTypes.string,
        'selectedOption__removeButton': PropTypes.string,
        'selectedOption__moveButton': PropTypes.string
    }).isRequired,
    Icon: PropTypes.any.isRequired,
    IconButton: PropTypes.any.isRequired
};

export default MultiSelectBox_ListPreviewSortable_DraggableListPreviewElement;
