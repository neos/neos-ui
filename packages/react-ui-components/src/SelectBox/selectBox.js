import React, {PureComponent, PropTypes} from 'react';
import isFunction from 'lodash.isfunction';
import AbstractSelectBox from './abstractSelectBox';

export default class SelectBox extends AbstractSelectBox {

    static propTypes = {
        /**
         *
         */
        clearOnSelect: PropTypes.bool,

        /**
         * An optional css theme to be injected.
         */
        theme: PropTypes.shape({/* eslint-disable quote-props */
            'wrapper': PropTypes.string,
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
        InputComponent: PropTypes.any.isRequired,
        SearchableSelectBoxComponent: PropTypes.any.isRequired,
        SimpleSelectBoxComponent: PropTypes.any.isRequired
    };

    state = {
        value: undefined,
        icon: undefined,
        label: undefined,
    };

    constructor(...args) {
        super(...args);

        this.handleDeleteClick = this.handleDeleteClick.bind(this);
        this.handleInput = this.handleInput.bind(this);
    }

    componentDidMount() {
        this.setState({
            isLoadingOptions: false,
            options: this.props.options,
        });

        // if options are a function, we load them asynchronously
        if (isFunction(this.props.options) && !this.props.loadOptionsOnInput) {
            this.loadOptions();
        } else if (this.props.loadOptionsOnInput && this.props.value) {
            this.loadOptions();
        } else {
            this.select(this.props.value, false);
        }
    }

    render() {
        const options = this.getOptions();
        const {theme, SearchableSelectBoxComponent, SimpleSelectBoxComponent, loadOptionsOnInput} = this.props;
        const {isLoadingOptions, icon, label, value} = this.state;

        return (
            <div className={this.props.theme.wrapper}>
                {this.isSearchableSelectBox() ?
                    <SearchableSelectBoxComponent
                        value={value}
                        options={options}
                        loadOptionsOnInput={loadOptionsOnInput}
                        isLoadingOptions={isLoadingOptions}
                        label={label}
                        icon={icon}
                        theme={theme}
                        onSelect={this.select}
                        onDelete={this.handleDeleteClick}
                        onInput={this.handleInput}
                    /> :
                    <SimpleSelectBoxComponent
                        options={options}
                        isLoadingOptions={isLoadingOptions}
                        label={label}
                        icon={icon}
                        theme={theme}
                        onSelect={this.select}
                    />
                }
            </div>
        );
    }

    /**
     * Handles the delete-option-click for searchable selectBox
     */
    handleDeleteClick() {
        this.select('', false);
        this.props.onDelete();
    }

    /**
     * Handles a search request
     *
     * @param searchValue
     */
    handleInput(searchValue) {
        this.loadOptionsWithSearchTerm(searchValue);
    }

    /**
     * We use a searchable selectBox if:
     * - we have a delete method (when searching, you need to delete a selected option
     *   in order to search again)
     * - or props.minimumResultsForSearch is set and > options
     *
     * @returns {boolean}
     */
    isSearchableSelectBox() {
        if (isFunction(this.props.onDelete)) {
            return true
        } else if (this.props.minimumResultsForSearch !== -1 && this.getOptions().length >= this.props.minimumResultsForSearch) {
            return true
        } else {
            return false
        }
    }

    /**
     * Handler for loading async options with a given searchValue
     *
     * @returns {*}
     */
    loadOptionsWithSearchTerm(searchValue) {
        const options = this.props.options;

        this.setState({
            isLoadingOptions: true
        });

        return isFunction(options) && options({
            searchTerm: searchValue,
            callback: this.setLoadedOptions
        });
    }

    /**
     * select callback for option selection
     *
     * @param {string} incomingValue
     * @param {boolean} shouldTriggerOnSelect
     */
    select(incomingValue, shouldTriggerOnSelect = true) {
        const {placeholder, placeholderIcon} = this.props;

        if (incomingValue && !this.props.clearOnSelect) {
            this.setState({
                value: incomingValue,
                icon: this.getOptionIconForValue(incomingValue) || placeholderIcon,
                label: this.getOptionLabelForValue(incomingValue) || placeholder
            });

        } else {
            this.setState({
                icon: placeholderIcon,
                label: placeholder
            });
        }

        if (shouldTriggerOnSelect) {
            this.props.onSelect(incomingValue);
        }
    }

}
