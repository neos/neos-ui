/* eslint-disable camelcase, react/jsx-pascal-case */
import React, {PureComponent, ComponentClass} from 'react';
import {$get} from 'plow-js';
import mergeClassNames from 'classnames';
import {omit} from 'lodash';
import SelectBox_Option_SingleLine from '../SelectBox_Option_SingleLine';
import SelectBox from '../SelectBox';
import {SelectBoxOptions, SelectBoxOptionValueAccessor} from '../SelectBox/selectBox';
import {PickDefaultProps} from '../../types';
import MultiSelectBox_ListPreviewSortable from '../MultiSelectBox_ListPreviewSortable';
import {SelectBox_Option_SingleLineProps} from '../SelectBox_Option_SingleLine/selectBox_Option_SingleLine';

export interface MultiSelectBoxProps extends Readonly<{
    // ------------------------------
    // Basic Props for core functionality
    // ------------------------------
    /**
     * This prop represents a set of options.
     * Each option must have a value and can have a label and an icon.
     */
    options: SelectBoxOptions;

    /**
     * Additional className wich will be applied
     */
    className?: string;

    /**
     * Field name specifying which field in a single "option" contains the "value"
     */
    optionValueField: string;

    /**
     * This prop represents the current selected value.
     */
    values: ReadonlyArray<string>;

    /**
     * This prop gets called when an option was selected. It returns the new values as array.
     */
    onValuesChange: (values: ReadonlyArray<string>) => void;

    // ------------------------------
    // Visual customization of the MultiSelect Box
    // ------------------------------
    /**
     * This prop is the placeholder text which is displayed in the selectbox when no option was selected.
     */
    placeholder?: string;

    /**
     * This prop is an icon for the placeholder.
     */
    placeholderIcon?: string;

    /**
     * Text for the group label of options without a group
     */
    withoutGroupLabel?: string;

    /**
     * If false, prevents removing the last element.
     */
    allowEmpty?: boolean;

    /**
     * Limit height and show scrollbars if needed, defaults to true
     */
    scrollable: boolean;

    /**
     * Component used for rendering the individual option elements; Usually this component uses "SelectBoxOption" internally for common styling.
     */
    ListPreviewElement?: ComponentClass<SelectBox_Option_SingleLineProps>; // TODO type the Props

    disabled: boolean;

    // ------------------------------
    // Asynchronous loading of data
    // ------------------------------

    /**
     * This prop is the loading text which is displayed in the selectbox when displayLoadingIndicator ist set to true.
     */
    loadingLabel?: string;

    /**
     * Helper for asynchronous loading; should be set to "true" as long as "options" is not yet populated.
     */
    displayLoadingIndicator: boolean;

    // ------------------------------
    // Search-As-You-Type related functionality
    // ------------------------------
    displaySearchBox: boolean;
    searchTerm: string;
    onSearchTermChange: (searchTerm: string) => void;
    searchOptions?: SelectBoxOptions;

    /**
     * If set to true, the search box is directly focussed once the SelectBox is rendered;
     * such that the user can start typing right away.
     */
    setFocus: boolean;

    // ------------------------------
    // "Create new if not exists" functionality
    // ------------------------------
    /**
     * This prop gets called when requested to create a new element
     */
    onCreateNew: () => void; // TODO

    /**
     * "Create new" label
     */
    createNewLabel: string;

    // ------------------------------
    // Drag&Drop Reordering of Selected Values
    // ------------------------------
    /**
     * Specifying the dnd type. Defaults to 'multiselect-box-value'
     */
    dndType?: string;

    // ------------------------------
    // Theme & Dependencies
    // ------------------------------
    theme: MultiSelectBoxTheme;
}> {}

interface MultiSelectBoxTheme extends Readonly<{
    'selectedOptions': string;
    'selectedOptions__item': string;
    'wrapper': string;
}> {}

export const defaultProps: PickDefaultProps<MultiSelectBoxProps, 'optionValueField' | 'dndType' | 'allowEmpty' | 'ListPreviewElement' | 'disabled'> = {
    optionValueField: 'value',
    dndType: 'multiselect-box-value',
    allowEmpty: true,
    ListPreviewElement: SelectBox_Option_SingleLine,
    disabled: false,
};

export default class MultiSelectBox extends PureComponent<MultiSelectBoxProps> {
    public static readonly defaultProps = defaultProps;

    public render(): JSX.Element {
        const {
            searchOptions,
            values,
            optionValueField,
            theme,
            className,
            disabled
        } = this.props;

        const filteredSearchOptions = (searchOptions || [])
            .filter(option => !(values && values.indexOf(option[optionValueField]) !== -1));

        const selectedOptionsClassNames = mergeClassNames({
            [theme.selectedOptions]: true
        });

        const optionValueAccessor = this.getOptionValueAccessor();

        const classNames = mergeClassNames(className, theme.wrapper);

        return (
            <div className={classNames}>
                <ul className={selectedOptionsClassNames}>
                    <MultiSelectBox_ListPreviewSortable
                        {...omit(this.props, ['theme'])}
                        optionValueAccessor={optionValueAccessor}
                        disabled={disabled}
                    />
                </ul>
                <SelectBox
                    {...omit(this.props, ['theme', 'className'])}
                    options={filteredSearchOptions}
                    value=""
                    onValueChange={this.handleNewValueSelected}
                    disabled={disabled}
                />
            </div>
        );
    }

    private getOptionValueAccessor(): SelectBoxOptionValueAccessor {
        const {optionValueField} = this.props;
        // @ts-ignore
        return $get([optionValueField]);
    }

    private handleNewValueSelected = (value: string) => {
        const {onValuesChange} = this.props;
        const values = this.props.values || [];
        const updatedValues = [...values, value];

        onValuesChange(updatedValues);
    }
}
