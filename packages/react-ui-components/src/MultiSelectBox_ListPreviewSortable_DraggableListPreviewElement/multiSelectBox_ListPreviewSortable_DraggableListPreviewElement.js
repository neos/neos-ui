/* eslint-disable camelcase, react/jsx-pascal-case */
import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import mergeClassNames from 'classnames';
import {DragSource, DropTarget} from 'react-dnd';

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

@DragSource(({dndType}) => dndType, {
    beginDrag(props) {
        return {
            index: props.index
        };
    },
    canDrag({values}) {
        return values && values.length > 1;
    }
}, (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
}))
@DropTarget(({dndType}) => dndType, spec, connect => ({
    connectDropTarget: connect.dropTarget()
}))
export default class MultiSelectBox_ListPreviewSortable_DraggableListPreviewElement extends PureComponent {
    static propTypes = {
        // For explanations of the PropTypes, see MultiSelectBox.js
        option: PropTypes.shape({
        }),
        values: PropTypes.arrayOf(PropTypes.string),

        // Drag&Drop specific propTypes
        dndType: PropTypes.string.isRequired,
        connectDragSource: PropTypes.func.isRequired,
        connectDropTarget: PropTypes.func.isRequired,
        isDragging: PropTypes.bool.isRequired,

        // API with MultiSelectBox_ListPreviewSortable
        InnerListPreviewElement: PropTypes.any.isRequired,
        onMoveSelectedValue: PropTypes.func.isRequired,
        onSelectedValueWasMoved: PropTypes.func.isRequired,
        onRemoveItem: PropTypes.func.isRequired,
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
    }

    render() {
        const {
            option,
            connectDragSource,
            connectDropTarget,
            isDragging,
            InnerListPreviewElement,
            theme,
            values,
            onRemoveItem,
            index,
            IconButton
        } = this.props;

        // TODO Loading State: const {icon, label} = option || {label: `[Loading ${value}]`};

        const isDraggable = values && values.length > 1;

        const finalClassNames = mergeClassNames({
            [theme.selectedOptions__item]: true,
            [theme['selectedOptions__item--draggable']]: isDraggable
        });
        const opacity = isDragging ? 0 : 1;

        const refName = node => {
            this.node = node;
        };

        const handleRemoveItem = () => onRemoveItem(index);

        return connectDragSource(connectDropTarget(
            <li style={{opacity}} ref={refName}>
                <div className={finalClassNames}>
                    {isDraggable && (
                        <IconButton
                            icon={'grip-lines-vertical'}
                            className={theme.selectedOption__moveButton}
                            hoverStyle={'clean'}
                            />
                    )}
                    <div className={theme.selectedOptions__innerPreview}>
                        <InnerListPreviewElement
                            {...this.props}
                            isHighlighted={false}
                            option={option}
                            />
                    </div>
                    <IconButton
                        icon={'close'}
                        onClick={handleRemoveItem}
                        className={theme.selectedOption__removeButton}
                        />
                </div>
            </li>
        ));
    }
}
