// tslint:disable:class-name
import React, {PureComponent} from 'react';
import {DragSource, DropTarget} from 'react-dnd';
import mergeClassNames from 'classnames';

import IconButton from '../IconButton';
import {SelectBoxOption} from '../SelectBox/selectBox';

interface MultiSelectBox_ListPreviewSortable_DraggableListPreviewElement_Props extends Readonly<{
    // For explanations of the PropTypes, see MultiSelectBox.js
    option: SelectBoxOption,
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
}> {}

interface MultiSelectBox_ListPreviewSortable_DraggableListPreviewElement_Theme extends Readonly<{
    'selectedOptions__item': string,
    'selectedOptions__item--draggable': string,
    'selectedOption__removeButton': string,
    'selectedOptions__innerPreview': string,
}> {}

/**
 * **MultiSelectBox_ListPreviewSortable_DraggableListPreviewElement is an internal implementation detail of MultiSelectBox**, meant to improve code quality.
 *
 * It is used inside MultiSelectBox_ListPreviewSortable for rendering an individual element and implementing drag&drop behavior.
 */
@DragSource<MultiSelectBox_ListPreviewSortable_DraggableListPreviewElement_Props>(
    // type
    (props) => props.dndType,
    // spec
    {
        beginDrag: (props) => ({
            index: props.index
        }),
        canDrag: ({values}) => values && values.length > 1
    },
    // collect
    (connect, monitor) => ({
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging()
    })
)
@DropTarget<MultiSelectBox_ListPreviewSortable_DraggableListPreviewElement_Props>(
    // type
    (props) => props.dndType,
    // spec
    {
        hover: (props, monitor, component: any) => {
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
    // collect
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

        const finalClassNames = mergeClassNames({
            [theme.selectedOptions__item]: true,
            [theme['selectedOptions__item--draggable']]: values && values.length > 1
        });
        const opacity = isDragging ? 0 : 1;

        const handleRemoveItem = () => onRemoveItem(index);

        const refName = (node: any) => {
            // @ts-ignore
            this.node = node;
        };

        return connectDragSource(connectDropTarget(
            // @ts-ignore
            <li ref={refName} style={{opacity}}>
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
