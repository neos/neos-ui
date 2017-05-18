import React, {PureComponent, PropTypes} from 'react';
import isFunction from 'lodash.isfunction';

// SHOULD BE REMOVED, NOT NEEDED ANYMORE
export const propTypes = {
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
    minimumResultsForSearch: PropTypes.number
};

export const state = {
    value: undefined,
    options: undefined,
    isLoadingOptions: false
};

export default class AbstractSelectBox extends PureComponent {
    static propTypes = {
        ...propTypes
    };

    constructor(...args) {
        super(...args);

        this.handleOptionsLoad = this.handleOptionsLoad.bind(this);
        this.select = this.select.bind(this);
    }

    componentDidMount() {
        this.setState({
            isLoadingOptions: false,
            options: this.props.options
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

        this.setState({
            isLoadingOptions: true
        });

        // We only use the current value when loading options, if the
        // 'loadOptionsOnInput' flag is on.
        return isFunction(options) && options({
            value: this.props.loadOptionsOnInput ? this.props.value : undefined,
            callback: options =>
                this.handleOptionsLoad(options)
        });
    }

    /**
     * Handler for the async options loading callback
     * @param {object} options
     */
    handleOptionsLoad(options) {
        this.setState({
            options,
            isLoadingOptions: false
        });

        // After options loaded, re-try to select the current element!
        this.select(this.props.value, false);
    }

    select() {
        // argument: incomingValue
        console.error('This method needs to be overridden!');
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
