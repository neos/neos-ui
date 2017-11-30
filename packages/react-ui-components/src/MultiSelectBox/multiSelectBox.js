import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {$get} from 'plow-js';
import SortablePreviewList from '../Previews/SortablePreviewList';
import {TextInput} from '@neos-project/react-ui-components';
import mergeClassNames from 'classnames';

// TODO: document component usage && check code in detail
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
        ListPreviewElement: PropTypes.any,

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
        SelectBox: PropTypes.any.isRequired,
        IconComponent: PropTypes.any.isRequired,
        IconButtonComponent: PropTypes.any.isRequired
    };

    state = {
        isExpanded: false,
        focusedValue: ''
    };

    getOptionValueAccessor() {
        return $get([this.props.optionValueField]);
    }

    render() {
        const {
            searchOptions,
            values,
            optionValueField,
            theme,
            onSearchTermChange,
            highlight,
            IconButtonComponent,
            IconComponent,
            allowEmpty,
            options,
            dndType,
            SelectBox,
            SelectBox_ListPreviewSortable
        } = this.props;

        const filteredSearchOptions = (searchOptions || [])
            .filter(option => !(values && values.indexOf(option[optionValueField]) !== -1));

        const selectedOptionsClassNames = mergeClassNames({
            [theme.selectedOptions]: true,
            [theme['selectedOptions--highlight']]: highlight
        });

        const optionValueAccessor = this.getOptionValueAccessor();

        /*
        <SortablePreviewList
                    options={preparedOptions}
                    dndType={dndType}
                    allowEmpty={allowEmpty}
                    highlight={highlight}
                    onValuesChange={this.handleValuesChanged}
                    theme={theme}
                    IconComponent={IconComponent}
                    IconButtonComponent={IconButtonComponent}
                    />
                */

        return (
            <div className={theme.wrapper}>
                <ul className={selectedOptionsClassNames}>
                    <SelectBox_ListPreviewSortable
                        {...this.props}
                        optionValueAccessor={optionValueAccessor}
                        />
                </ul>
                <SelectBox
                    {...this.props}
                    options={filteredSearchOptions}
                    highlight={false}
                    value=""
                    onValueChange={this.handleNewValueSelected}
                    />
            </div>
        );
    }

    /**
     * Renders a single option (<li/>) for the select box
     * @returns {JSX} option element
     */
    renderOption = (wrappingClickHandler, option, index) => {
        const {theme, IconComponent, ListPreviewElement, optionValueField} = this.props;
        const value = option[optionValueField];
        const onClick = () => {
            wrappingClickHandler(value);
        };

        // onMouseEnter doesn't work on ListPreviewElement??
        return <ListPreviewElement className="" isActive={false} option={option} key={index} onClick={onClick} theme={theme} IconComponent={IconComponent}/>;
    }

    handleValuesChanged = values => {
        this.props.onValuesChange(values);
    }

    handleNewValueSelected = value => {
        const values = this.props.values || [];
        const updatedValues = [...values, value];
        this.props.onValuesChange(updatedValues);
    }
}
