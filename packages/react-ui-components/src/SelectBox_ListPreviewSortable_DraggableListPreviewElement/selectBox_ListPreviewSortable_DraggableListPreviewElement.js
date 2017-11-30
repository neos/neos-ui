import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import mergeClassNames from 'classnames';
import {DragSource, DropTarget} from 'react-dnd';

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

        props.moveSelectedValue(dragIndex, hoverIndex);

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

/*@DragSource(({dndType}) => dndType, {
    beginDrag(props) {
        return {
            index: props.index
        };
    },
    canDrag({draggableValues}) {
        return draggableValues && draggableValues.length > 1;
    }
}, (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
}))
@DropTarget(({dndType}) => dndType, spec, connect => ({
    connectDropTarget: connect.dropTarget()
}))*/
export default class SelectBox_ListPreviewSortable_DraggableListPreviewElement extends PureComponent {

    static propTypes = {
        option: PropTypes.shape({
        }),

        /**
         * This prop represents the current selected value.
         */
        draggableValues: PropTypes.arrayOf(PropTypes.string),

        isDragging: PropTypes.bool.isRequired,

        /**
         * Field name specifying which field in a single "option" contains the "value"
         */
        optionValueField: PropTypes.string,

        /**
         * if false, prevents removing the last element.
         */
        allowEmpty: PropTypes.bool,

        /**
         * An optional css theme to be injected.
         */
        theme: PropTypes.shape({/* eslint-disable quote-props */
            'selectedOptions__item': PropTypes.string,
            'selectedOptions__item--draggable': PropTypes.string
        }).isRequired, /* eslint-enable quote-props */

        /**
         * This prop represents a set of options.
         * Each option must have a value and can have a label and an icon.
         */
        options: PropTypes.arrayOf(
            PropTypes.shape({
                icon: PropTypes.string,
                // "value" is not part of PropTypes validation, as the "value field" is specified via the "optionValueField" property
                label: PropTypes.oneOfType([
                    PropTypes.string,
                    PropTypes.object
                ]).isRequired
            })
        ),
        dndType: PropTypes.string.isRequired,

        onSelectedValueWasMoved: PropTypes.func,
        onRemoveOption: PropTypes.func,

        IconComponent: PropTypes.any.isRequired,
        IconButtonComponent: PropTypes.any.isRequired,

        moveSelectedValue: PropTypes.func.isRequired,

        connectDragSource: PropTypes.func.isRequired,
        connectDropTarget: PropTypes.func.isRequired

    }

    render() {
        const {
            value,
            draggableValues,
            optionValueField,
            option,
            allowEmpty,
            theme,
            IconComponent,
            IconButtonComponent,
            onRemoveOption,
            connectDragSource,
            connectDropTarget,
            isDragging,
            InnerListPreviewElement
         } = this.props;

        //const option = (options || []).find(option => option[optionValueField] === value);
        //const {icon, label} = option || {label: `[Loading ${value}]`};

        const finalClassNames = mergeClassNames({
            [theme.selectedOptions__item]: true,
            [theme['selectedOptions__item--draggable']]: draggableValues && draggableValues.length > 1
        });
        const opacity = isDragging ? 0 : 1;

        /*const refName = node => {
            this.node = node;
        };*/

        //return connectDragSource(connectDropTarget(
            // //onClick={this.handlePreviewElementClick(option)}
            // onMouseEnter={this.handlePreviewElementMouseEnter(option)}
            
        return    <InnerListPreviewElement
                isHighlighted={false}
                option={option}
                />
            
        //));
        /*
        <li className={finalClassNames} ref={refName} style={{opacity}}>
                <span>
                    <div className={theme.selectedOptions__itemIconWrapper}>
                        {icon ? <IconComponent className={theme.selectedOptions__itemIcon} icon={icon}/> : null}
                        <IconComponent className={theme['selectedOptions__itemIcon--onHover']} icon={'arrows-v'}/>
                    </div>
                    { label }
                </span>
                { draggableValues && draggableValues.length === 1 && !allowEmpty ?
                    null :
                    <IconButtonComponent
                        icon={'close'}
                        onClick={onRemoveOption(value)}
                        />
                }
            </li>*/
    }
}