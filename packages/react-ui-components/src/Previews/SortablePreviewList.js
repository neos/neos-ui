import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {DragSource, DropTarget} from 'react-dnd';
import mergeClassNames from 'classnames';

const ensureIsArray = v => {
    if (Array.isArray(v)) {
        return v;
    }
    console.warn('Expected "values" to be an Array but found the following value (Falling back to an empty list): ', v);
    return [];
};

const optionsToValues = options => options.map(option => option.__value);

export default class SortablePreviewList extends PureComponent {
    static propTypes = {
        /**
         * This prop represents a set of options.
         * Each option must have a value and can have a label and an icon.
         */
        options: PropTypes.arrayOf(
            PropTypes.shape({
                icon: PropTypes.string,
                __value: PropTypes.any.isRequired,
                // "value" is not part of PropTypes validation, as the "value field" is specified via the "optionValueField" property
                label: PropTypes.oneOfType([
                    PropTypes.string,
                    PropTypes.object
                ]).isRequired
            })
        ),

        /**
         * Specifying the dnd type. Defaults to 'multiselect-box-value'
         */
        dndType: PropTypes.string.isRequired,

        /**
         * if false, prevents removing the last element.
         */
        allowEmpty: PropTypes.bool,

        /**
         * Highlight input
         */
        highlight: PropTypes.bool,

        /**
         * This prop gets called when an option was selected. It returns the new values as array.
         */
        onValuesChange: PropTypes.func.isRequired,

        /**
         * An optional css theme to be injected.
         */
        theme: PropTypes.shape({/* eslint-disable quote-props */
            'selectedOptions': PropTypes.string,
            'selectedOptions--highlight': PropTypes.string,
            'selectedOptions__item': PropTypes.string
        }).isRequired, /* eslint-enable quote-props */

        IconComponent: PropTypes.any.isRequired,
        IconButtonComponent: PropTypes.any.isRequired
    };

    state = {
        draggableValues: ensureIsArray(optionsToValues(this.props.options))
    };

    componentWillReceiveProps(nextProps) {
        if (this.props.options !== nextProps.options) {
            this.setState({
                draggableValues: ensureIsArray(optionsToValues(nextProps.options))
            });
        }
    }

    handleSelectedValueWasMoved = () => {
        this.props.onValuesChange(this.state.draggableValues);
    }

    handleRemoveOption = valueToRemove => () => {
        const values = optionsToValues(this.props.options) || [];
        const updatedValues = values.filter(value => value !== valueToRemove);
        this.props.onValuesChange(updatedValues);
        this.setState({draggableValues: updatedValues});
    }

    moveSelectedValue = (dragIndex, hoverIndex) => {
        const {draggableValues} = this.state;
        const movedOption = draggableValues[dragIndex];

        const reorderedValues = draggableValues.slice();

        reorderedValues.splice(dragIndex, 1);
        reorderedValues.splice(hoverIndex, 0, movedOption);

        this.setState({draggableValues: reorderedValues});
    }

    render() {
        const {
            options,
            highlight,
            theme,
            allowEmpty,
            dndType,
            IconComponent,
            IconButtonComponent
        } = this.props;

        const draggableValues = this.state.draggableValues;

        const selectedOptionsClassNames = mergeClassNames({
            [theme.selectedOptions]: true,
            [theme['selectedOptions--highlight']]: highlight
        });

        return (
            <ul className={selectedOptionsClassNames}>
                {
                    (draggableValues || []).map((value, key) => {
                        return (
                            <DraggableValue
                                key={value}
                                index={key}
                                dndType={dndType}
                                onSelectedValueWasMoved={this.handleSelectedValueWasMoved}
                                onRemoveOption={this.handleRemoveOption}
                                moveSelectedValue={this.moveSelectedValue}
                                value={value}
                                theme={theme}
                                IconComponent={IconComponent}
                                IconButtonComponent={IconButtonComponent}
                                allowEmpty={allowEmpty}
                                options={options}
                                draggableValues={draggableValues}
                                />
                        );
                    })
                }
            </ul>
        );
    }
}

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

@DragSource(({dndType}) => dndType, {
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
}))
export class DraggableValue extends PureComponent {
    static propTypes = {
        /**
         * Value of the current item
         */
        value: PropTypes.string.isRequired,

        /**
         * This prop represents the current selected value.
         */
        draggableValues: PropTypes.arrayOf(PropTypes.string),

        isDragging: PropTypes.bool.isRequired,

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
            options,
            allowEmpty,
            theme,
            IconComponent,
            IconButtonComponent,
            onRemoveOption,
            connectDragSource,
            connectDropTarget,
            isDragging
         } = this.props;

        const option = (options || []).find(option => option.__value === value);
        const {icon, label} = option || {label: `[Loading ${value}]`};

        const finalClassNames = mergeClassNames({
            [theme.selectedOptions__item]: true,
            [theme['selectedOptions__item--draggable']]: draggableValues && draggableValues.length > 1
        });
        const opacity = isDragging ? 0 : 1;

        const refName = node => {
            this.node = node;
        };

        // TODO: Should use pluggable mechanism to render the previews.
        return connectDragSource(connectDropTarget(
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
            </li>
        ));
    }
}
