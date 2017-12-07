/* eslint-disable camelcase, react/jsx-pascal-case */
import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {$get} from 'plow-js';
import SelectBox_Option_SingleLine from '../SelectBox_Option_SingleLine/index';
import mergeClassNames from 'classnames';

// TODO: document component usage && check code in detail
export default class SelectBox extends PureComponent {

    static defaultProps = {
        options: [],
        optionValueField: 'value',
        withoutGroupLabel: 'Without group',
        scrollable: true,
        showDropDownToggle: true,
        threshold: 2,
        ListPreviewElement: SelectBox_Option_SingleLine
    };

    static propTypes = {
        // ------------------------------
        // Basic Props for core functionality
        // ------------------------------
        /**
         * This prop represents the set of options to be chosen from
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
         * This prop represents the currently selected value.
         */
        value: PropTypes.string,

        /**
         * This prop gets called when an option was selected. It returns the new value.
         */
        onValueChange: PropTypes.func.isRequired,

        // ------------------------------
        // Visual customization of the Select Box
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
         * text for the group label of options without a group
         */
        withoutGroupLabel: PropTypes.string,

        /**
         * if true, allows to clear the selected element completely (without choosing another one)
         */
        allowEmpty: PropTypes.bool,

        /**
         * Shows dropdown toggle. Set by default. Useful in components that display search, where you don't want to let the user manually controll the collapsing of selectbox
         */
        showDropDownToggle: PropTypes.bool,

        /**
         * limit height and show scrollbars if needed, defaults to true
         */
        scrollable: PropTypes.bool,

        /**
         * Should the SelectBox be highlighted? (e.g. if the property was modified)
         */
        highlight: PropTypes.bool,

        /**
         * Component used for rendering the individual option elements; Usually this component uses "ListPreviewElement" internally for common styling.
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
         * helper for asynchronous loading; should be set to "true" as long as "options" is not yet populated.
         */
        displayLoadingIndicator: PropTypes.bool,

        // ------------------------------
        // Search-As-You-Type related functionality
        // ------------------------------
        displaySearchBox: PropTypes.bool,
        onSearchTermChange: PropTypes.func,
        threshold: PropTypes.number,
        searchBoxLeftToTypeLabel: PropTypes.string,
        noMatchesFoundLabel: PropTypes.string,

        /**
         * if set to true, the search box is directly focussed once the SelectBox is rendered;
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
        // Theme & Dependencies
        // ------------------------------
        theme: PropTypes.shape({/* eslint-disable quote-props */
            'wrapper--highlight': PropTypes.string,
            'selectBox__btn--noRightPadding': PropTypes.string
        }).isRequired, /* eslint-enable quote-props */

        DropDown: PropTypes.any.isRequired,
        SelectBox_Header: PropTypes.any.isRequired,
        SelectBox_HeaderWithSearchInput: PropTypes.any.isRequired,
        SelectBox_ListPreview: PropTypes.any.isRequired
    };

    state = {
        searchTerm: '',
        isExpanded: false,
        focusedValue: ''
    };

    getOptionValueAccessor() {
        return $get([this.props.optionValueField]);
    }

    render() {
        const {
            options,
            theme,
            highlight,
            showDropDownToggle,
            threshold,
            displayLoadingIndicator,
            ListPreviewElement,

            DropDown,
            SelectBox_ListPreview
        } = this.props;

        const {searchTerm} = this.state;

        const {
            focusedValue,
            isExpanded
        } = this.state;

        const headerClassName = mergeClassNames({
            [theme.selectBox__btn]: true,
            [theme['selectBox--highlight']]: highlight,
            [theme['selectBox__btn--noRightPadding']]: !showDropDownToggle
        });

        const optionValueAccessor = this.getOptionValueAccessor();

        const searchTermLeftToType = threshold - searchTerm.length;
        const noMatchesFound = searchTermLeftToType > 0 || displayLoadingIndicator ? false : !options.length;

        return (
            <DropDown.Stateless className={theme.selectBox} isOpen={isExpanded} onToggle={this.handleToggleExpanded} onClose={this.handleClose}>
                <DropDown.Header className={headerClassName} shouldKeepFocusState={false} showDropDownToggle={showDropDownToggle && Boolean(options.length)}>
                    {this.renderHeader()}
                </DropDown.Header>
                <DropDown.Contents className={theme.selectBox__contents} scrollable={true}>
                    <ul className={theme.selectBox__list}>
                        <SelectBox_ListPreview
                            {...this.props}

                            theme={theme}
                            optionValueAccessor={optionValueAccessor}
                            ListPreviewElement={ListPreviewElement}
                            focusedValue={focusedValue}
                            onChange={this.handleChange}
                            onOptionFocus={this.handleOptionFocusChange}
                            searchTermLeftToType={searchTermLeftToType}
                            noMatchesFound={noMatchesFound}
                            searchTerm={this.state.searchTerm}
                            />
                    </ul>
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
            allowEmpty,

            SelectBox_HeaderWithSearchInput,
            SelectBox_Header
        } = this.props;
        const optionValueAccessor = this.getOptionValueAccessor();

        const selectedOption = options.find(option => optionValueAccessor(option) === value);

        if (displaySearchBox && !value) {
            return (
                <SelectBox_HeaderWithSearchInput
                    {...this.props}
                    onSearchTermChange={this.handleSearchTermChange}
                    searchTerm={this.state.searchTerm}
                    onKeyDown={this.handleKeyDown}
                    />
            );
        }

        const showResetButton = Boolean(allowEmpty && !displayLoadingIndicator && value && !displaySearchBox);

        return (
            <SelectBox_Header
                {...this.props}
                option={selectedOption}
                showResetButton={showResetButton}
                onReset={this.handleDeleteClick}
                />
        );
    }

    handleChange = option => {
        const optionValueAccessor = this.getOptionValueAccessor();
        this.props.onValueChange(optionValueAccessor(option));
    }

    handleDeleteClick = event => {
        // Don't open SelectBox on value clear
        event.stopPropagation();
        this.props.onValueChange('');
    }

    handleToggleExpanded = () => {
        let isExpanded;
        if (this.props.displaySearchBox) {
            if (this.props.value) {
                // When click on header in search mode with value selected, clear it
                this.props.onValueChange('');
                isExpanded = true;
            } else {
                // Force expanded dropdown unless has showDropDownToggle (e.g. for nodetypes filter in the PageTree)
                isExpanded = this.props.showDropDownToggle ? !this.state.isExpanded : true;
            }
        } else {
            // if simple SelectBox, just toggle it
            isExpanded = !this.state.isExpanded;
        }
        this.setState({
            isExpanded
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

    handleSearchTermChange = searchTerm => {
        if (searchTerm.length >= this.props.threshold) {
            this.props.onSearchTermChange(searchTerm);
        } else {
            this.props.onSearchTermChange('');
        }
        this.setState({
            isExpanded: Boolean(searchTerm),
            searchTerm
        });
        this.props.onSearchTermChange(searchTerm);
    }

    /**
     * Keyboard handling
     */
    componentWillReceiveProps({keydown}) {
        this.handleKeyDown(keydown.event);
    }

    handleKeyDown = e => {
        if (this.state.isExpanded && e && ['ArrowDown', 'ArrowUp', 'Enter', 'Escape'].includes(e.key)) {
            // do not scroll while we are doing keyboard interaction
            e.preventDefault();

            const {options} = this.props;
            const optionValueAccessor = this.getOptionValueAccessor();
            const currentIndex = options.findIndex(option => optionValueAccessor(option) === this.state.focusedValue);

            if (e.key === 'ArrowDown') {
                const newIndex = currentIndex + 1 >= options.length ? currentIndex : currentIndex + 1;
                this.setState({
                    focusedValue: optionValueAccessor(options[newIndex])
                });
            } else if (e.key === 'ArrowUp') {
                const newIndex = currentIndex - 1 < 0 ? 0 : currentIndex - 1;
                this.setState({
                    focusedValue: optionValueAccessor(options[newIndex])
                });
            } else if (e.key === 'Enter') {
                if (currentIndex < options.length) {
                    this.handleChange(options[currentIndex]);
                }

                this.setState({
                    isExpanded: false
                });
            } else if (e.key === 'Escape') {
                this.setState({
                    focusedValue: '',
                    isExpanded: false
                });
            }
        }
    }
}
