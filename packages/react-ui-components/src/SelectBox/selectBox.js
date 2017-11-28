import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {$get} from 'plow-js';
import DefaultSelectBoxOption from './defaultSelectBoxOption';
import mergeClassNames from 'classnames';
import SearchInput from '../Finder/SearchInput';
import Selector from './selector';
import GroupedPreviewList from '../Previews/GroupedPreviewList';
import Finder from '../Finder/index';

export default class SelectBox extends PureComponent {

    static defaultProps = {
        options: [],
        optionValueField: 'value',
        withoutGroupLabel: 'Without group',
        scrollable: true,
        optionComponent: DefaultSelectBoxOption
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
        value: PropTypes.string,

        /**
         * This prop gets called when an option was selected. It returns the new value.
         */
        onValueChange: PropTypes.func.isRequired,

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
         * text for the group label of options without a group
         */
        withoutGroupLabel: PropTypes.string,

        /**
         * This prop is the loading text which is displayed in the selectbox when displayLoadingIndicator ist set to true.
         */
        loadingLabel: PropTypes.string,

        /**
         * helper for asynchronous loading; should be set to "true" as long as "options" is not yet populated.
         */
        displayLoadingIndicator: PropTypes.bool,

        /**
         * if true, allows to clear the selected element completely (without choosing another one)
         */
        allowEmpty: PropTypes.bool,

        /**
         * limit height and show scrollbars if needed, defaults to true
         */
        scrollable: PropTypes.bool,

        /**
         * search box related properties
         */
        displaySearchBox: PropTypes.bool,

        searchTerm: PropTypes.string,

        onSearchTermChange: PropTypes.func,

        /**
         * Highlight input
         */
        highlight: PropTypes.bool,

        /**
         * Component used for rendering the individual option elements; Usually this component uses "SelectBoxOption" internally for common styling.
         */
        optionComponent: PropTypes.any,

        /**
         * An optional css theme to be injected.
         */
        theme: PropTypes.shape({/* eslint-disable quote-props */
            'wrapper': PropTypes.string,
            'wrapper--highlight': PropTypes.string,
            'selectedOptions': PropTypes.string,
            'selectedOptions__item': PropTypes.string
        }).isRequired, /* eslint-enable quote-props */

        //
        // Static component dependencies which are injected from the outside (index.js)
        // Used in sub-components
        //
        DropDownComponent: PropTypes.any.isRequired,
        IconComponent: PropTypes.any.isRequired,
        IconButtonComponent: PropTypes.any.isRequired,
        TextInputComponent: PropTypes.any.isRequired
    };

    state = {
        hasFocus: false,
        focusedValue: ''
    };

    isCreateNewEnabled = () => this.props.onCreateNew && this.props.searchTerm;

    getOptionsCount = () => {
        const {options, withoutGroupLabel} = this.props;

        const groupedOptions = this.getGroupedOptions(options);
        const hasMultipleGroups = Object.keys(groupedOptions).length > 1 || (Object.keys(groupedOptions).length === 1 && !groupedOptions[withoutGroupLabel]);
        let count = hasMultipleGroups ? groupedOptions.length : options.length;
        if (this.isCreateNewEnabled()) {
            count++;
        }
        return count;
    }

    handleClearSearch = () => {
        const {onSearchTermChange} = this.props;

        if (onSearchTermChange) {
            onSearchTermChange('');
        }
    }

    handleSearchTermChange = (...args) => {
        this.props.onSearchTermChange(...args);
    }

    handleValueChange = (...rest) => {
        this.props.onValueChange(...rest);
        // Clear search box after searching
        this.handleClearSearch();
    }

    handleCreateNew = (...rest) => {
        this.props.onCreateNew(...rest);
        // Clear search box on creating new
        this.handleClearSearch();
    }

    handleFocusToggle = hasFocus => {
        this.setState({hasFocus});
    }

    prepareOptions() {
        // TODO remove
        const {
            options,
            optionValueField
        } = this.props;

        return options.map(option => {
            const identifier = option[optionValueField];
            return Object.assign({__value: identifier}, option);
        });
    }

    render() {
        const {
            value,
            theme,
            highlight,
            displaySearchBox,
            TextInputComponent,
            IconButtonComponent,
            IconComponent,
            optionValueField,
            optionComponent
        } = this.props;

        const {
            focusedValue
        } = this.state;

        const selectWrapperClassNames = mergeClassNames({
            [theme['wrapper--highlight']]: highlight
        });

        const preparedOptions = this.prepareOptions();
        //const selectedOption = value ? preparedOptions.reduce((selected, current) => {
        //    return (current.__value === value ? current : selected);
        //}, null) : {__value: value, label: value};

        const optionValueAccessor = $get([optionValueField]);

        if (displaySearchBox && !value) {
            return (
                <Finder
                    options={preparedOptions}
                    previewRenderer={this.renderOption}
                    classNames={selectWrapperClassNames}
                    onValueChange={this.handleValueChange}
                    onSearchTermChange={this.handleSearchTermChange}
                    theme={theme}
                    IconComponent={IconComponent}
                    TextInputComponent={TextInputComponent}
                    />
            );
        }

        if (displaySearchBox && selectedOption) {
            return (
                <ul className={theme.selectBox__contents}>
                    {this.renderOption(this.handleDeleteClick, selectedOption, null)}
                </ul>
            );
        }

        return (
            <div className={selectWrapperClassNames}>
                <Selector
                    options={preparedOptions}
                    preview={optionComponent}
                    value={value}
                    focusedValue={focusedValue}
                    onChange={this.handleValueChange}
                    optionValueAccessor={optionValueAccessor}
                    onOptionFocus={this.handleOptionFocusChange}
                    theme={theme}
                    IconComponent={IconComponent}
                    TextInputComponent={TextInputComponent}
                    IconButtonComponent={IconButtonComponent}
                    />
            </div>
        );
    }

    renderCreateNew() {
        const {theme, searchTerm, IconComponent, createNewLabel} = this.props;
        const index = this.getOptionsCount() - 1;
        if (!this.isCreateNewEnabled()) {
            return null;
        }
        const onClick = () => {
            this.handleCreateNew(searchTerm);
        };
        const isActive = index === this.state.selectedIndex;
        const className = isActive ? theme['selectBox__item--isSelectable--active'] : '';

        const setIndex = () => {
            this.setSelectedIndex(index);
        };
        return (
            <div key={index} onMouseEnter={setIndex}>
                <DefaultSelectBoxOption
                    option={{value: searchTerm, label: `${createNewLabel} "${searchTerm}"`, icon: 'plus-circle'}}
                    theme={theme}
                    className={className}
                    onClick={onClick}
                    IconComponent={IconComponent}
                    />
            </div>
        );
    }

    /**
     * Groups the options of the selectBox by their group-attribute. Returns a javascript Map with the group names
     * as key and an array of options as values.
     * Options without a group-attribute assigned will receive the key specified in props.withoutGroupLabel.
     */
    getGroupedOptions = options => {
        return options.reduce((accumulator, currentOpt) => {
            const groupLabel = currentOpt.group ? currentOpt.group : this.props.withoutGroupLabel;
            accumulator[groupLabel] = accumulator[groupLabel] || [];
            accumulator[groupLabel].push(currentOpt);
            return accumulator;
        }, Object.create(null)); // <-- Initial value of the accumulator
    }

    /**
     * Renders a single option (<li/>) for the select box
     * @returns {JSX} option element
     */
    renderOption = (wrappingClickHandler, option, index) => {
        throw new Error("NOT USED ANYMORE!!!");
        const {theme, optionComponent, optionValueField} = this.props;
        const selectedIndex = this.state.selectedIndex;
        const value = option[optionValueField];
        const onClick = () => {
            wrappingClickHandler(value);
        };
        const isActive = index === selectedIndex;
        //

        const setIndex = () => {
            
        };

        const OptionComponent = optionComponent;
        // onMouseEnter doesn't work on OptionComponent
        return <OptionComponent key={index} className={className} isActive={isActive} option={option} onClick={onClick} onMouseEnter={setIndex}/>;
    }

    setSelectedIndex = selectedIndex => {
        // TODO remove
        if (selectedIndex !== this.state.selectedIndex) {
            this.setState({selectedIndex});
        }
    }

    handleDeleteClick = () => {
        this.handleValueChange('');
    }

    handleOptionFocusChange = option => {
        const {optionValueField} = this.props;
        const optionValueAccessor = $get([optionValueField]);
        this.setState({
            focusedValue: optionValueAccessor(option)
        });
    }
}
