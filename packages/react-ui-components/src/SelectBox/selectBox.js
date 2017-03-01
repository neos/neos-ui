import React, {PureComponent, PropTypes} from 'react';
import isFunction from 'lodash.isfunction';

export default class SelectBox extends PureComponent {
    static propTypes = {
        /**
         * This prop represents the current selected value.
         */
        value: PropTypes.string,

        /**
         * This prop represents either a set of options or a function that returns those.
         * Each option must have a value and can have a label and an icon.
         */
        options: React.PropTypes.oneOfType([
            PropTypes.arrayOf(
                PropTypes.shape({
                    icon: PropTypes.string,
                    value: PropTypes.oneOfType([
                        PropTypes.string,
                        PropTypes.object
                    ]).isRequired,
                    label: PropTypes.oneOfType([
                        PropTypes.string,
                        PropTypes.object
                    ]).isRequired
                })
            ),
            PropTypes.func
        ]),

        /**
         * This prop represents if the options should be loaded on init or when the user starts typing
         * something in the search field.
         */
        loadOptionsOnInput: PropTypes.bool,

        /**
         * This prop is the placeholder text which is displayed in the selectbox when no option was selected.
         */
        placeholder: PropTypes.string,

        /**
         * This prop is an icon for the placeholder.
         */
        placeholderIcon: PropTypes.string,

        /**
         * This prop gets called when an option was selected. It returns the new value.
         */
        onSelect: PropTypes.func.isRequired,

        /**
         * If passed, a `delete` icon will be rendered instead of a chevron,
         * this prop will be called when clicking on the icon.
         */
        onDelete: PropTypes.func,

        /**
         * The minimum amount of items in the select before showing a search box, if set to -1 the search box
         * will never be shown.
         */
        minimumResultsForSearch: PropTypes.number,

        /**
         * An optional css theme to be injected.
         */
        theme: PropTypes.shape({/* eslint-disable quote-props */
            'wrapper': PropTypes.string,
        }).isRequired, /* eslint-enable quote-props */

        //
        // Static component dependencies which are injected from the outside (index.js)
        // Used in sub-components
        //
        DropDownComponent: PropTypes.any.isRequired,
        IconComponent: PropTypes.any.isRequired,
        InputComponent: PropTypes.any.isRequired,
        SearchableSelectBoxComponent: PropTypes.any.isRequired,
        SimpleSelectBoxComponent: PropTypes.any.isRequired
    };

    state = {
        value: undefined,
        icon: undefined,
        label: undefined,
        options: undefined,
        isLoadingOptions: false,
    };

    constructor(...args) {
        super(...args);

        this.handleOptionsLoad = this.handleOptionsLoad.bind(this);
        this.setLoadedOptions = this.setLoadedOptions.bind(this);
        this.select = this.select.bind(this);
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
     * returns the options or inits the loading of the options
     *
     * @returns {Array}
     */
    getOptions() {
        return this.state.options || this.props.options;
    }

    /**
     * Loads async options if options is a function.
     *
     * @return {boolean} loadedOptions  TRUE, if options was called (async), otherwise FALSE
     */
    loadOptions() {
        const options = this.props.options;
        const selectedValue = this.props.value;

        this.setState({
            isLoadingOptions: true
        });

        return isFunction(options) && options({
            value: selectedValue,
            callback: this.handleOptionsLoad
        });
    }

    /**
     * Handler for the async options loading callback
     * @param {object} options
     */
    handleOptionsLoad(options) {
        this.setLoadedOptions(options);

        // After options loaded, re-try to select the current element!
        this.select(this.props.value, false);
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
     * Sets a given set of options to the internal state.
     * Also disables the loading state.
     *
     * @param options
     */
    setLoadedOptions(options) {
        this.setState({
            options: options,
            isLoadingOptions: false
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

        if (incomingValue) {
            this.setState({
                value: incomingValue,
                icon: Object.prototype.toString.call(this.getOptions()) === '[object Array]' ?
                    this.getOptions().filter(o => o.value === incomingValue).map(o => o.icon)[0] : placeholderIcon,
                label: Object.prototype.toString.call(this.getOptions()) === '[object Array]' ?
                    this.getOptions().filter(o => o.value === incomingValue).map(o => o.label)[0] : placeholder
            });
        } else {
            this.setState({
                value: incomingValue,
                icon: placeholderIcon,
                label: placeholder
            });
        }

        if (shouldTriggerOnSelect) {
            this.props.onSelect(incomingValue);
        }
    }

}
