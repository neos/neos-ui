import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import mergeClassNames from 'classnames';

export default class MultiSelectBox extends PureComponent {

    static defaultProps = {
        optionValueField: 'value',
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
         * This prop represents the current selected value.
         */
        values: PropTypes.arrayOf(PropTypes.string),

        /**
         * This prop gets called when an option was selected. It returns the new values as array.
         */
        onValuesChange: PropTypes.func.isRequired,

        /**
         * This prop is the placeholder text which is displayed in the selectbox when no option was selected.
         */
        placeholder: PropTypes.string,

        /**
         * This prop is an icon for the placeholder.
         */
        placeholderIcon: PropTypes.string,

        /**
         * helper for asynchronous loading; should be set to "true" as long as "options" is not yet populated.
         */
        displayLoadingIndicator: PropTypes.bool,

        /**
         * if false, prevents removing the last element.
         */
        allowEmpty: PropTypes.bool,

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
        IconButtonComponent: PropTypes.any.isRequired
    };

    render() {
        const {
            searchOptions,
            values,
            optionValueField,
            displayLoadingIndicator,
            theme,
            placeholder,
            placeholderIcon,
            displaySearchBox,
            searchTerm,
            onSearchTermChange,
            SelectBoxComponent,
            highlight
        } = this.props;

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
                        (values || []).map(this.renderSelectedValue)
                    }
                </ul>
                <SelectBoxComponent
                    options={filteredSearchOptions}
                    value=""
                    optionValueField={optionValueField}
                    displayLoadingIndicator={displayLoadingIndicator}
                    placeholder={placeholder}
                    placeholderIcon={placeholderIcon}
                    displaySearchBox={displaySearchBox}
                    searchTerm={searchTerm}
                    onSearchTermChange={onSearchTermChange}
                    onValueChange={this.handleNewValueSelected}
                    />
            </div>
        );
    }

    /**
     * renders a single option (<li/>) for the list of multi selected values
     *
     * @param {string} option
     * @param {string} option.icon
     * @param {string} option.label
     * @param {number} index
     * @returns {JSX} option element
     */
    renderSelectedValue = (value, index) => {
        const {
            values,
            optionValueField,
            options,
            allowEmpty,
            theme,
            IconComponent,
            IconButtonComponent
        } = this.props;

        const option = (options || [])
            .find(option => option[optionValueField] === value);

        const {icon, label} = option || {label: `[Loading ${value}]`};

        return (
            <li
                key={index}
                className={theme.selectedOptions__item}
                >
                <span>
                    {
                        icon ?
                            <IconComponent className={theme.selectedOptions__itemIcon} icon={icon}/> :
                            null
                    }

                    { label }
                </span>
                {
                    values && values.length === 1 && !allowEmpty ?
                    null :
                    <IconButtonComponent
                        icon={'close'}
                        onClick={this.handleRemoveOption(value)}
                        />
                }
            </li>
        );
    }

    handleNewValueSelected = value => {
        const values = this.props.values || [];
        const updatedValues = [...values, value];
        this.props.onValuesChange(updatedValues);
    }

    handleRemoveOption = valueToRemove => () => {
        const values = this.props.values || [];
        const updatedValues = values.filter(value => value !== valueToRemove);
        this.props.onValuesChange(updatedValues);
    }
}
