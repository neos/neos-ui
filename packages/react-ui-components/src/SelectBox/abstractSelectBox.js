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
    };

    state = {
        options: undefined,
        isLoadingOptions: false,
        selectedOptions: []
    };

    constructor(...args) {
        super(...args);

        this.handleOptionsLoad = this.handleOptionsLoad.bind(this);
        this.setLoadedOptions = this.setLoadedOptions.bind(this);
        this.select = this.select.bind(this);
    }

    /**
     * returns the options
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
        let selectedValue = undefined;

        this.setState({
            isLoadingOptions: true
        });

        // TODO explain
        if (this.props.loadOptionsOnInput) {
            selectedValue = this.props.value;
        }

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
     * Sets a given set of options to the internal state.
     * Also disables the loading state.
     *
     * @param options
     */
    setLoadedOptions(options) {
        console.log ('set options', options);
        this.setState({
            options: options,
            isLoadingOptions: false
        });
    }

    select(incomingValue, shouldTriggerOnSelect = true) {
        console.error ('This method needs to be overridden!')
    }

    getOptionLabelForValue(value) {
        return Object.prototype.toString.call(this.getOptions()) === '[object Array]' ?
            this.getOptions().filter(o => o.value === value).map(o => o.label)[0] : null;
    }

    getOptionIconForValue(value) {
        return Object.prototype.toString.call(this.getOptions()) === '[object Array]' ?
            this.getOptions().filter(o => o.value === value).map(o => o.icon)[0] : null;
    }

}
