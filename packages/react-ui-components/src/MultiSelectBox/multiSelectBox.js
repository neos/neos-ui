/* eslint-disable camelcase, react/jsx-pascal-case */
import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {$get} from 'plow-js';
import mergeClassNames from 'classnames';
import omit from 'lodash.omit';
import SelectBox_Option_SingleLine from '../SelectBox_Option_SingleLine';

class MultiSelectBox extends PureComponent {
    static propTypes = {
        // ------------------------------
        // Basic Props for core functionality
        // ------------------------------
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
         * Additional className wich will be applied
         */
        className: PropTypes.string,

        /**
         * Field name specifying which field in a single "option" contains the "value"
         */
        optionValueField: PropTypes.string,

        /**
         * This prop represents the current selected value.
         */
        values: PropTypes.arrayOf(PropTypes.string),

        /**
         * This prop gets called when an option was selected. It returns the new values as array.
         */
        onValuesChange: PropTypes.func.isRequired,

        // ------------------------------
        // Visual customization of the MultiSelect Box
        // ------------------------------
        /**
         * This prop is the placeholder text which is displayed in the selectbox when no option was selected.
         */
        placeholder: PropTypes.string,

        /**
         * This prop is an icon for the placeholder.
         */
        placeholderIcon: PropTypes.string,

        /**
         * Text for the group label of options without a group
         */
        withoutGroupLabel: PropTypes.string,

        /**
         * If false, prevents removing the last element.
         */
        allowEmpty: PropTypes.bool,

        /**
         * Limit height and show scrollbars if needed, defaults to true
         */
        scrollable: PropTypes.bool,

        /**
         * Component used for rendering the individual option elements; Usually this component uses "SelectBoxOption" internally for common styling.
         */
        ListPreviewElement: PropTypes.any,

        // ------------------------------
        // Asynchronous loading of data
        // ------------------------------

        /**
         * This prop is the loading text which is displayed in the selectbox when displayLoadingIndicator ist set to true.
         */
        loadingLabel: PropTypes.string,

        /**
         * Helper for asynchronous loading; should be set to "true" as long as "options" is not yet populated.
         */
        displayLoadingIndicator: PropTypes.bool,

        // ------------------------------
        // Search-As-You-Type related functionality
        // ------------------------------
        displaySearchBox: PropTypes.bool,
        searchTerm: PropTypes.string,
        onSearchTermChange: PropTypes.func,
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

        /**
         * If set to true, the search box is directly focussed once the SelectBox is rendered;
         * such that the user can start typing right away.
         */
        setFocus: PropTypes.bool,

        // ------------------------------
        // "Create new if not exists" functionality
        // ------------------------------
        /**
         * This prop gets called when requested to create a new element
         */
        onCreateNew: PropTypes.func,

        /**
         * "Create new" label
         */
        createNewLabel: PropTypes.string,

        // ------------------------------
        // Drag&Drop Reordering of Selected Values
        // ------------------------------
        /**
         * Specifying the dnd type. Defaults to 'multiselect-box-value'
         */
        dndType: PropTypes.string.isRequired,

        // ------------------------------
        // Theme & Dependencies
        // ------------------------------
        theme: PropTypes.shape({/* eslint-disable quote-props */
            'selectedOptions': PropTypes.string,
            'selectedOptions__item': PropTypes.string
        }).isRequired, /* eslint-enable quote-props */

        SelectBox: PropTypes.any.isRequired,
        IconComponent: PropTypes.any.isRequired,
        IconButtonComponent: PropTypes.any.isRequired,
        MultiSelectBox_ListPreviewSortable: PropTypes.any.isRequired
    }

    static defaultProps = {
        optionValueField: 'value',
        dndType: 'multiselect-box-value',
        allowEmpty: true,
        ListPreviewElement: SelectBox_Option_SingleLine
    }

    getOptionValueAccessor = () => {
        const {optionValueField} = this.props;
        return $get([optionValueField]);
    };

    handleNewValueSelected = value => {
        const {onValuesChange} = this.props;
        const values = this.props.values || [];
        let updatedValues;
        if (Array.isArray(values)) {
            updatedValues = [...values, value];
        } else {
            console.error('MultiSelectBox received an invalid value, invalid value will be discarded', values);
            updatedValues = [value];
        }

        onValuesChange(updatedValues);
    };

    render() {
        const {
            searchOptions,
            values,
            optionValueField,
            theme,
            SelectBox,
            MultiSelectBox_ListPreviewSortable,
            disabled,
            className
        } = this.props;

        const filteredSearchOptions = (searchOptions || [])
            .filter(option => !(values && values.indexOf(option[optionValueField]) !== -1));

        const selectedOptionsClassNames = mergeClassNames({
            [theme.selectedOptions]: true
        });

        const optionValueAccessor = this.getOptionValueAccessor();

        const classNames = mergeClassNames({
            [className]: true,
            [theme.wrapper]: true
        });

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
}

export default MultiSelectBox;
