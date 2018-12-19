// tslint:disable:class-name
import React, {PureComponent} from 'react';
import mergeClassNames from 'classnames';
import {DragSource, DropTarget} from 'react-dnd';
import IconButton from '../IconButton/iconButton';

type MultiSelectBox_ListPreviewSortable_DraggableListPreviewElement_Props = Readonly<{
    // For explanations of the PropTypes, see MultiSelectBox.js
    option: any,
    values: ReadonlyArray<string>,

    // Drag&Drop specific
    dndType: string,
    connectDragSource: <P>(el: React.ReactElement<P>) => React.ReactElement<P>,
    connectDropTarget: <P>(el: React.ReactElement<P>) => React.ReactElement<P>,
    isDragging: boolean,

    // API with MultiSelectBox_ListPreviewSortable
    InnerListPreviewElement: any,
    onMoveSelectedValue: (dragIndex: number, hoverIndex: number) => void,
    onSelectedValueWasMoved: () => void,
    onRemoveItem: (index: number) => void,
    index: number,

    // Dependency Injection & Theme
    theme: MultiSelectBox_ListPreviewSortable_DraggableListPreviewElement_Theme,
}>;

type MultiSelectBox_ListPreviewSortable_DraggableListPreviewElement_Theme = Readonly<{
    'selectedOptions__item': string,
    'selectedOptions__item--draggable': string,
    'selectedOption__removeButton': string,
    'selectedOptions__innerPreview': string,
}>;

/**
 * **MultiSelectBox_ListPreviewSortable_DraggableListPreviewElement is an internal implementation detail of MultiSelectBox**, meant to improve code quality.
 *
 * It is used inside MultiSelectBox_ListPreviewSortable for rendering an individual element and implementing drag&drop behavior.
 */
@DragSource<MultiSelectBox_ListPreviewSortable_DraggableListPreviewElement_Props>(
    (props) => props.dndType,
    {
        beginDrag: (props) => ({
            index: props.index
        }),
        canDrag: ({values}) => values && values.length > 1
    },
    (connect, monitor) => ({
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging()
    })
)
@DropTarget<MultiSelectBox_ListPreviewSortable_DraggableListPreviewElement_Props>(
    (props) => props.dndType,
    {
        hover: (props, monitor, component: {node: HTMLLIElement}) => {
            const dragIndex = monitor.getItem().index as number;
            const hoverIndex = props.index;

            // dragging over itself
            if (dragIndex === hoverIndex) {
                return;
            }

            const hoverBoundingRect = component.node.getBoundingClientRect();
            const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
            const clientOffset = monitor.getClientOffset();

            if (clientOffset === null) {
                return;
            }

            const hoverClientY = clientOffset.y - hoverBoundingRect.top;

            if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
                return;
            }

            if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
                return;
            }

            props.onMoveSelectedValue(dragIndex, hoverIndex);

            // TODO
            // Note: we're mutating the monitor item here!
            // Generally it's better to avoid mutations,
            // but it's good here for the sake of performance
            // to avoid expensive index searches.
            monitor.getItem().index = hoverIndex;
        },
        drop: (props) => {
            props.onSelectedValueWasMoved();
        }
    },
    connect => ({
        connectDropTarget: connect.dropTarget()
    })
)
export default class MultiSelectBox_ListPreviewSortable_DraggableListPreviewElement extends PureComponent<MultiSelectBox_ListPreviewSortable_DraggableListPreviewElement_Props> {
    public render(): React.ReactNode {
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
        } = this.props;

        // TODO Loading State: const {icon, label} = option || {label: `[Loading ${value}]`};

        const finalClassNames = mergeClassNames({
            [theme.selectedOptions__item]: true,
            [theme['selectedOptions__item--draggable']]: values && values.length > 1
        });
        const opacity = isDragging ? 0 : 1;

        const handleRemoveItem = () => onRemoveItem(index);

        return connectDragSource(connectDropTarget(
            <li style={{opacity}}>
                <div className={finalClassNames}>
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
