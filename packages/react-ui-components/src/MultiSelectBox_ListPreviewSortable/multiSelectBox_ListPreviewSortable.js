/* eslint-disable camelcase, react/jsx-pascal-case */
import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import injectProps from './../_lib/injectProps';
import MultiSelectBox_ListPreviewSortable_DraggableListPreviewElement from '../MultiSelectBox_ListPreviewSortable_DraggableListPreviewElement';

const ensureIsArray = v => {
    if (Array.isArray(v)) {
        return v;
    }
    console.warn('<MultiSelectBox/> Expected "values" to be an Array but found the following value (Falling back to an empty list): ', v);
    return [];
};

const makeDraggableListPreviewElement = ListPreviewElement =>
    injectProps({
        InnerListPreviewElement: ListPreviewElement
    })(MultiSelectBox_ListPreviewSortable_DraggableListPreviewElement);

/**
 * **MultiSelectBox_ListPreviewSortable is an internal implementation detail of MultiSelectBox**, meant to improve code quality.
 *
 * It is used inside MultiSelectBox, to render the selected elements in the list.
 */
export default class MultiSelectBox_ListPreviewSortable extends PureComponent {
    static propTypes = {
        // For explanations of the PropTypes, see MultiSelectBox.js
        options: PropTypes.arrayOf(
            PropTypes.shape({})
        ).isRequired,
        values: PropTypes.arrayOf(PropTypes.string),
        onValuesChange: PropTypes.func.isRequired,
        ListPreviewElement: PropTypes.any.isRequired,

        // API with MultiSelectBox
        optionValueAccessor: PropTypes.func.isRequired
    }

    constructor(props) {
        super(props);

        this.state = {
            draggableValues: ensureIsArray(this.props.values)
        };

        this.DraggableListPreviewElement = makeDraggableListPreviewElement(props.ListPreviewElement);
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (this.props.values !== nextProps.values) {
            this.setState({
                draggableValues: ensureIsArray(nextProps.values)
            });
        }

        this.DraggableListPreviewElement = makeDraggableListPreviewElement(nextProps.ListPreviewElement);
    }

    render() {
        const {
            options,
            optionValueAccessor
        } = this.props;

        const {draggableValues} = this.state;

        // Sorted options by draggable value ordering
        const draggableOptions = draggableValues.map(value =>
            options.find(option => optionValueAccessor(option) === value)
        ).filter(Boolean);

        return draggableOptions.map(this.renderOption);
    }

    renderOption = (option, index) => {
        const {
            optionValueAccessor
        } = this.props;

        const {DraggableListPreviewElement} = this;

        return (
            <DraggableListPreviewElement
                {...this.props}
                key={optionValueAccessor(option)}
                index={index}
                option={option}
                onMoveSelectedValue={this.handleMoveSelectedValue}
                onSelectedValueWasMoved={this.handleSelectedValueWasMoved}
                onRemoveItem={this.handleRemoveItem}
                />
        );
    }

    handleMoveSelectedValue = (dragIndex, hoverIndex) => {
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

    handleRemoveItem = removeIndex => {
        const newValues = this.state.draggableValues.slice();
        newValues.splice(removeIndex, 1);
        this.setState({draggableValues: newValues});
        this.props.onValuesChange(newValues);
    }
}
