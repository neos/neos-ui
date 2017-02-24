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
        //
        DropDownComponent: PropTypes.any.isRequired,
        IconComponent: PropTypes.any.isRequired,
        InputComponent: PropTypes.any.isRequired,
        SimpleSelectBoxComponent: PropTypes.any.isRequired,
        SearchableSelectBoxComponent: PropTypes.any.isRequired,
    };

    state = {
        value: undefined,
        icon: undefined,
        label: undefined,
        options: undefined,
        isLoadingOptions: false
    };

    constructor(...args) {
        super(...args);

        this.handleOptionsLoad = this.handleOptionsLoad.bind(this);
        this.select = this.select.bind(this);
        this.handleDeleteClick = this.handleDeleteClick.bind(this);
    }

    componentDidMount() {
        this.setState({
            isLoadingOptions: false,
            options: this.props.options,
        });

        // if options are a function, we load them asynchronously
        if (isFunction(this.props.options)) {
            this.loadOptions();
        } else {
            this.select(this.props.value, false);
        }
    }

    render() {
        const SearchableSelectBoxComponent = this.props.SearchableSelectBoxComponent;
        const SimpleSelectBoxComponent = this.props.SimpleSelectBoxComponent;

        const options = this.getOptions();
        const isLoadingOptions = this.state.isLoadingOptions;
        const icon = this.state.icon;
        const label = this.state.label;
        const value = this.state.value;

        // TODO: rendering happens to often on init
        console.log ('render with options', this.state);

        return (
            <div className={this.props.theme.wrapper}>
                {this.isSearchableSelectBox() ?
                    <SearchableSelectBoxComponent
                        value={value}
                        options={options}
                        isLoadingOptions={isLoadingOptions}
                        label={label}
                        icon={icon}
                        onSelect={this.select}
                        onDelete={this.handleDeleteClick}
                    /> :
                    <SimpleSelectBoxComponent
                        options={options}
                        isLoadingOptions={isLoadingOptions}
                        label={label}
                        icon={icon}
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
     * loads async options if options is a function
     *
     * @return {boolean} loadedOptions  TRUE, if options was called (async), otherwise FALSE
     */
    loadOptions() {
        const options = this.props.options;

        this.setState({
            isLoadingOptions: true
        });

        return isFunction(options) && options({
            value: this.state.searchValue,
            callback: this.handleOptionsLoad
        });
    }

    /**
     * Handler for the async options loading callback
     * @param {object} data
     */
    handleOptionsLoad(data) {
        this.setState({
            options: data,
            isLoadingOptions: false
        });

        // After options loaded, re-try to select the current element!
        this.select(this.props.value, false);
    }

    /**
     * select callback for option selection
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
