import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {$get} from 'plow-js';
import DefaultSelectBoxOption from './defaultSelectBoxOption';
import mergeClassNames from 'classnames';
import GroupedPreviewList from '../Previews/GroupedPreviewList';

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
        //
        DropDown: PropTypes.any.isRequired,
        SelectBox_Header: PropTypes.any.isRequired,
        SelectBox_HeaderWithSearchInput: PropTypes.any.isRequired,
        SelectBox_ListPreview: PropTypes.any.isRequired,
    };

    state = {
        isExpanded: false,

        hasFocus: false,
        focusedValue: ''
    };

    getOptionValueAccessor() {
        return $get([this.props.optionValueField]);
    }

    render() {
        const {
            options,
            value,
            theme,
            highlight,
            displaySearchBox,
            TextInputComponent,
            IconButtonComponent,
            IconComponent,
            optionValueField,
            optionComponent,

            DropDown,
            SelectBox_Header,
            SelectBox_ListPreview,
        } = this.props;

        const {
            focusedValue,
            isExpanded
        } = this.state;

        const headerClassName = mergeClassNames({
            [theme.selectBox__btn]: true,
            [theme['selectBox--highlight']]: highlight
        });

        const optionValueAccessor = this.getOptionValueAccessor();

        return (
            <DropDown.Stateless className={theme.selectBox} isOpen={isExpanded} onToggle={this.handleToggleExpanded} onClose={this.handleClose}>
                <DropDown.Header className={headerClassName} shouldKeepFocusState={false} showDropDownToggle={Boolean(options.length)}>
                    {this.renderHeader()}
                </DropDown.Header>
                <DropDown.Contents className={theme.selectBox__contents} scrollable={true}>
                    <SelectBox_ListPreview
                        {...this.props}

                        optionValueAccessor={optionValueAccessor}
                        ListPreviewElement={optionComponent}
                        focusedValue={this.state.focusedValue}
                        onChange={this.handleChange}
                        onOptionFocus={this.handleOptionFocusChange}
                        />
                </DropDown.Contents>
            </DropDown.Stateless>
        );
    }

    renderHeader() {
        const {
            displaySearchBox,
            displayLoadingIndicator,
            options,
            value,

            SelectBox_HeaderWithSearchInput,
            SelectBox_Header
        } = this.props;
        let allowEmpty = this.props.allowEmpty;
        const optionValueAccessor = this.getOptionValueAccessor();

        const selectedOption = options.find(option => optionValueAccessor(option) === value);

        // if the search box should be shown, we *need* to force allowEmpty (to display the "clear" button if a value is selected),
        // as the search box is only shown if nothing is selected.
        // If we would not force this and allowEmpty=false, the user could not go back to the search box after he has initially selected a value.
        if (displaySearchBox) {
            allowEmpty = true;
        }

        const showResetButton = Boolean(!displayLoadingIndicator && allowEmpty && value);

        if (displaySearchBox && !value) {
            return (
                <SelectBox_HeaderWithSearchInput
                    {...this.props}
                />
            );
        } else {
            return (
                <SelectBox_Header
                    option={selectedOption}
                    showResetButton={showResetButton}
                    onReset={this.handleDeleteClick}
                />
            );
        }
    }

    handleChange = option => {
        const optionValueAccessor = this.getOptionValueAccessor();
        this.props.onValueChange(optionValueAccessor(option));
    }

    handleDeleteClick = () => {
        this.props.onValueChange('');
    }

    handleToggleExpanded = () => {
        this.setState({
            isExpanded: !this.state.isExpanded
        });
    }

    handleClose = () => {
        this.setState({
            isExpanded: false
        });
    }

    handleOptionFocusChange = option => {
        const optionValueAccessor = this.getOptionValueAccessor();
        this.setState({
            focusedValue: optionValueAccessor(option)
        });
    }
}
