import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {DragSource, DropTarget} from 'react-dnd';
import mergeClassNames from 'classnames';

const ensureIsArray = v => {
    if (Array.isArray(v)) {
        return v;
    }
    console.warn('<MultiSelectBox/> Expected "values" to be an Array but found the following value (Falling back to an empty list): ', v);
    return [];
};

export default class MultiSelectBox extends PureComponent {

    static defaultProps = {
        optionValueField: 'value',
        dndType: 'multiselect-box-value',
        allowEmpty: true
    };

    static propTypes = {
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

        /**
         * Field name specifying which field in a single "option" contains the "value"
         */
        optionValueField: PropTypes.string,

        /**
         * Specifying the dnd type. Defaults to 'multiselect-box-value'
         */
        dndType: PropTypes.string.isRequired,

        /**
         * if false, prevents removing the last element.
         */
        allowEmpty: PropTypes.bool,

        /**
         * This prop represents the current selected value.
         */
        values: PropTypes.arrayOf(PropTypes.string),

        /**
         * This prop gets called when an option was selected. It returns the new values as array.
         */
        onValuesChange: PropTypes.func.isRequired,

        /**
         * This prop gets called when requested to create a new element
         */
        onCreateNew: PropTypes.func,

        /**
         * "Create new" label
         */
        createNewLabel: PropTypes.string,

        /**
         * This prop is the placeholder text which is displayed in the selectbox when no option was selected.
         */
        placeholder: PropTypes.string,

        /**
         * This prop is an icon for the placeholder.
         */
        placeholderIcon: PropTypes.string,

        /**
         * This prop is the loading text which is displayed in the selectbox when displayLoadingIndicator ist set to true.
         */
        loadingLabel: PropTypes.string,

        /**
         * helper for asynchronous loading; should be set to "true" as long as "options" is not yet populated.
         */
        displayLoadingIndicator: PropTypes.bool,

        /**
         * search box related properties
         */
        displaySearchBox: PropTypes.bool,

        /**
         * Highlight input
         */
        highlight: PropTypes.bool,

        searchTerm: PropTypes.string,

        searchOptions: PropTypes.arrayOf(
            PropTypes.shape({
                icon: PropTypes.string,
                // "value" is not part of PropTypes validation, as the "value field" is specified via the "optionValueField" property
                label: PropTypes.oneOfType([
                    PropTypes.string,
                    PropTypes.object
                ]).isRequired
            })
        ),

        onSearchTermChange: PropTypes.func,

        /**
         * Component used for rendering the individual option elements; Usually this component uses "SelectBoxOption" internally for common styling.
         */
        optionComponent: PropTypes.any,

        /**
         * An optional css theme to be injected.
         */
        theme: PropTypes.shape({/* eslint-disable quote-props */
            'selectedOptions': PropTypes.string,
            'selectedOptions--highlight': PropTypes.string,
            'selectedOptions__item': PropTypes.string
        }).isRequired, /* eslint-enable quote-props */

        //
        // Static component dependencies which are injected from the outside (index.js)
        // Used in sub-components
        //
        SelectBoxComponent: PropTypes.any.isRequired,
        IconComponent: PropTypes.any.isRequired,
        IconButtonComponent: PropTypes.any.isRequired,
        hasStaticArrayValue: PropTypes.bool
    };

    state = {
        draggableValues: ensureIsArray(this.props.values)
    };

    componentWillReceiveProps(nextProps) {
        if (this.props.values !== nextProps.values) {
            this.setState({
                draggableValues: ensureIsArray(nextProps.values)
            });
        }
    }

    render() {
        const {
            searchOptions,
            values,
            optionValueField,
            loadingLabel,
            displayLoadingIndicator,
            theme,
            placeholder,
            placeholderIcon,
            displaySearchBox,
            searchTerm,
            onSearchTermChange,
            onCreateNew,
            createNewLabel,
            SelectBoxComponent,
            highlight,
            IconButtonComponent,
            IconComponent,
            allowEmpty,
            options,
            dndType,
            optionComponent,
            hasStaticArrayValue
        } = this.props;

        const {draggableValues} = this.state;
        const filteredSearchOptions = (searchOptions || [])
            .filter(option => !(values && values.indexOf(option[optionValueField]) !== -1));

        const selectedOptionsClassNames = mergeClassNames({
            [theme.selectedOptions]: true,
            [theme['selectedOptions--highlight']]: highlight
        });

        return (
            <div className={theme.wrapper}>
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
                                    optionValueField={optionValueField}
                                    draggableValues={draggableValues}
                                    hasStaticArrayValue={hasStaticArrayValue}
                                    />
                            );
                        })
                    }
                </ul>
                <SelectBoxComponent
                    options={filteredSearchOptions}
                    value=""
                    optionValueField={optionValueField}
                    loadingLabel={loadingLabel}
                    displayLoadingIndicator={displayLoadingIndicator}
                    placeholder={placeholder}
                    placeholderIcon={placeholderIcon}
                    displaySearchBox={displaySearchBox}
                    searchTerm={searchTerm}
                    onSearchTermChange={onSearchTermChange}
                    onValueChange={this.handleNewValueSelected}
                    onCreateNew={onCreateNew}
                    createNewLabel={createNewLabel}
                    optionComponent={optionComponent}
                    />
            </div>
        );
    }

    moveSelectedValue = (dragIndex, hoverIndex) => {
        const {draggableValues} = this.state;
        const movedOption = draggableValues[dragIndex];

        const reorderedValues = draggableValues.slice();

        reorderedValues.splice(dragIndex, 1);
        reorderedValues.splice(hoverIndex, 0, movedOption);

        this.setState({draggableValues: reorderedValues});
    }

    handleSelectedValueWasMoved = () => {
        this.props.onValuesChange(this.state.draggableValues);
    }

    handleNewValueSelected = value => {
        const values = this.props.values || [];
        const updatedValues = [...values, value];
        this.props.onValuesChange(updatedValues);
        this.setState({draggableValues: updatedValues});
    }

    handleRemoveOption = valueToRemove => () => {
        const values = this.props.values || [];
        const updatedValues = values.filter(value => value !== valueToRemove);
        this.props.onValuesChange(updatedValues);
        this.setState({draggableValues: updatedValues});
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
        connectDropTarget: PropTypes.func.isRequired,
        hasStaticDataSource: PropTypes.bool
    }

    render() {
        const {
            value,
            draggableValues,
            optionValueField,
            options,
            allowEmpty,
            theme,
            IconComponent,
            IconButtonComponent,
            onRemoveOption,
            connectDragSource,
            connectDropTarget,
            isDragging,
            hasStaticDataSource
         } = this.props;

        const option = (options || []).find(option => option[optionValueField] === value);
        const {icon, label} = option || (hasStaticDataSource ? {label: value} : {label: `[Loading ${value}]`});

        const finalClassNames = mergeClassNames({
            [theme.selectedOptions__item]: true,
            [theme['selectedOptions__item--draggable']]: draggableValues && draggableValues.length > 1
        });
        const opacity = isDragging ? 0 : 1;

        const refName = node => {
            this.node = node;
        };

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
