// tslint:disable:class-name
import React, {PureComponent} from 'react';
import MultiSelectBox_ListPreviewSortable_DraggableListPreviewElement from '../MultiSelectBox_ListPreviewSortable_DraggableListPreviewElement';
import {SelectBoxOption, SelectBoxOptions, SelectBoxOptionValueAccessor} from '../SelectBox/selectBox';

// TODO is this type guard still needed with TS?
function ensureIsArray<T>(v: any): ReadonlyArray<T> {
    if (Array.isArray(v)) {
        return v;
    }
    // tslint:disable-next-line:no-console
    console.warn('<MultiSelectBox/> Expected "values" to be an Array but found the following value (Falling back to an empty list): ', v);
    return [];
}

interface MultiSelectBox_ListPreviewSortableProps extends Readonly<{
    // For explanations of the PropTypes, see MultiSelectBox.js
    options: SelectBoxOptions;
    values: ReadonlyArray<string>;
    onValuesChange: (values: ReadonlyArray<string>) => void;
    ListPreviewElement?: any; // TODO

    // API with MultiSelectBox
    optionValueAccessor: SelectBoxOptionValueAccessor;
    disabled: boolean;
}> {}

interface MultiSelectBox_ListPreviewSortableState extends Readonly<{
    draggableValues: ReadonlyArray<string>;
}> {}

/**
 * **MultiSelectBox_ListPreviewSortable is an internal implementation detail of MultiSelectBox**, meant to improve code quality.
 *
 * It is used inside MultiSelectBox, to render the selected elements in the list.
 */
export default class MultiSelectBox_ListPreviewSortable extends PureComponent<MultiSelectBox_ListPreviewSortableProps, MultiSelectBox_ListPreviewSortableState> {
    constructor(props: MultiSelectBox_ListPreviewSortableProps) {
        super(props);

        this.state = {
            draggableValues: ensureIsArray(this.props.values)
        };

        // this.DraggableListPreviewElement = makeDraggableListPreviewElement(props.ListPreviewElement);
    }

    public componentWillReceiveProps(nextProps: MultiSelectBox_ListPreviewSortableProps): void {
        if (this.props.values !== nextProps.values) {
            this.setState({
                draggableValues: ensureIsArray(nextProps.values)
            });
        }

        // this.DraggableListPreviewElement = makeDraggableListPreviewElement(nextProps.ListPreviewElement);
    }

    public render(): ReadonlyArray<JSX.Element> { // TODO
        const {
            options,
            optionValueAccessor
        } = this.props;

        const {draggableValues} = this.state;

        // Sorted options by draggable value ordering
        // TODO somehow TS does not seem to understand that we filter all undefined values out of the array
        // @ts-ignore
        const draggableOptions: SelectBoxOptions = draggableValues
            .map(value => options.find(option => optionValueAccessor(option) === value))
            .filter(Boolean);

        return draggableOptions.map(this.renderOption);
    }

    private renderOption = (option: SelectBoxOption, index: number) => {
        const {
            optionValueAccessor
        } = this.props;

        return (
            <MultiSelectBox_ListPreviewSortable_DraggableListPreviewElement
                {...this.props as any} // TODO there are a lot of strange props missing
                InnerListPreviewElement={this.props.ListPreviewElement}
                key={optionValueAccessor(option)}
                index={index}
                option={option}
                onMoveSelectedValue={this.handleMoveSelectedValue}
                onSelectedValueWasMoved={this.handleSelectedValueWasMoved}
                onRemoveItem={this.handleRemoveItem}
            />
        );
    }

    private handleMoveSelectedValue = (dragIndex: number, hoverIndex: number) => {
        const {draggableValues} = this.state;
        const movedOption = draggableValues[dragIndex];

        const reorderedValues = draggableValues.slice();

        reorderedValues.splice(dragIndex, 1);
        reorderedValues.splice(hoverIndex, 0, movedOption);

        this.setState({draggableValues: reorderedValues});
    }

    private handleSelectedValueWasMoved = () => {
        this.props.onValuesChange(this.state.draggableValues);
    }

    private handleRemoveItem = (removeIndex: number) => {
        const newValues = this.state.draggableValues.slice();
        newValues.splice(removeIndex, 1);
        this.setState({draggableValues: newValues});
        this.props.onValuesChange(newValues);
    }
}
