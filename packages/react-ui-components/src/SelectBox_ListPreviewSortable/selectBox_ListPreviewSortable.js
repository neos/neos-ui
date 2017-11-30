import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import mergeClassNames from 'classnames';
import injectProps from './../_lib/injectProps.js';
import SelectBox_ListPreviewSortable_DraggableListPreviewElement from '../SelectBox_ListPreviewSortable_DraggableListPreviewElement/index';

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
    })(SelectBox_ListPreviewSortable_DraggableListPreviewElement);

export default class SelectBox_ListPreviewSortable extends PureComponent {
    static propTypes = {
        /**
         * This prop represents the current selected value.
         */
        values: PropTypes.arrayOf(PropTypes.string),
        

        ListPreviewElement: PropTypes.any.isRequired,

        // dependency injection
        SelectBox_ListPreviewUngrouped: PropTypes.any.isRequired
    }

    constructor(props) {
        super(props);

        this.state = {
            draggableValues: ensureIsArray(this.props.values)
        };

        this.DraggableListPreviewElement = makeDraggableListPreviewElement(props.ListPreviewElement);
    }

    componentWillReceiveProps(nextProps) {
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
            optionValueAccessor,
            ListPreviewElement,
            SelectBox_ListPreviewUngrouped
        } = this.props;

        const {draggableValues} = this.state;

        // sorted options by draggable value ordering
        const draggableOptions = draggableValues.map(value =>
            options.find(option => optionValueAccessor(option) === value)
        ).filter(Boolean)

        return draggableOptions.map(this.renderOption);
    }

    renderOption = (option, index) => {
        console.log("OPT", option, index);
        const DraggableListPreviewElement = this.DraggableListPreviewElement;

        return (
            <DraggableListPreviewElement
                {...this.props}
                key={index}
                index={index}
                option={option}
                onMoveSelectedValue={this.handleMoveSelectedValue}
                onSelectedValueWasMoved={this.handleSelectedValueWasMoved}
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
}
