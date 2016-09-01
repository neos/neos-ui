import React, {Component, PropTypes} from 'react';
import shallowCompare from 'react-addons-shallow-compare';
import isFunction from 'lodash.isfunction';

export default class SelectBox extends Component {
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
                    label: PropTypes.string.isRequired
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
         * An optional css theme to be injected.
         */
        theme: PropTypes.shape({// eslint-disable-line quote-props
            'wrapper': PropTypes.string,
            'dropDown': PropTypes.string,
            'dropDown__btn': PropTypes.string,
            'dropDown__btnIcon': PropTypes.string,
            'dropDown__contents': PropTypes.string,
            'dropDown__item': PropTypes.string,
            'dropDown__itemIcon': PropTypes.string
        }).isRequired,

        /**
         * The minimum amount of items in the select before showing a search box, if set to -1 the search box
         * will never be shown.
         */
        minimumResultsForSearch: PropTypes.number,

        //
        // Static component dependencies which are injected from the outside (index.js)
        //
        DropDownComponent: PropTypes.any.isRequired,
        IconComponent: PropTypes.any.isRequired,
        InputComponent: PropTypes.any.isRequired
    };

    state = {
        value: ''
    };

    constructor(...args) {
        super(...args);
        this.filterOption = this.filterOption.bind(this);
        this.renderOption = this.renderOption.bind(this);
        this.handleOnInputClick = this.handleOnInputClick.bind(this);
        this.handleOnInputChange = this.handleOnInputChange.bind(this);
        this.handleOptionsLoad = this.handleOptionsLoad.bind(this);
    }

    componentDidMount() {
        const {value} = this.props;
        this.loadOptions(); // initially load options
        this.select(value, false);
    }

    shouldComponentUpdate(...args) {
        return shallowCompare(this, ...args);
    }

    componentDidUpdate(prevProps, prevState) {
        // if the search input changes, reload async options
        if (prevState.searchValue !== this.state.searchValue) {
            this.loadOptions();
        }

        if (prevProps.value !== this.props.value) {
            this.select(this.props.value, false);
        }
    }

    render() {
        const {
            DropDownComponent,
            IconComponent,
            InputComponent,
            placeholder,
            placeholderIcon,
            theme
        } = this.props;
        const {icon, label, searchValue = ''} = this.state;

        return (
            <div className={theme.wrapper}>
                <DropDownComponent className={theme.dropDown}>
                    <DropDownComponent.Header className={theme.dropDown__btn} shouldKeepFocusState={false}>
                        {icon || placeholderIcon ?
                            <IconComponent className={theme.dropDown__btnIcon} icon={icon || placeholderIcon}/> :
                            null
                        }
                        <span>{label || placeholder}</span>
                    </DropDownComponent.Header>
                    <DropDownComponent.Contents className={theme.dropDown__contents}>
                        {
                            this.isSearchEnabled() ?
                                <li className={theme.dropDown__item}>
                                    <InputComponent
                                        value={searchValue}
                                        onClick={this.handleOnInputClick}
                                        onChange={this.handleOnInputChange}
                                        />
                                </li> : null
                        }

                        {Object.prototype.toString.call(this.getOptions()) === '[object Array]' ?
                            this.getOptions()
                                .filter(this.filterOption)
                                .map(this.renderOption) : null}
                    </DropDownComponent.Contents>
                </DropDownComponent>
            </div>
        );
    }

    /**
     * returns the options
     * @returns {Array}
     */
    getOptions() {
        return this.state.options || this.props.options;
    }

    /**
     * iterator method for filtering by searchValue
     * @param {object} o option
     * @returns {boolean} TRUE if passed filter
     */
    filterOption(o) {
        return !this.state.searchValue || o.label.toLowerCase().indexOf(this.state.searchValue.toLowerCase()) !== -1;
    }

    /**
     * @returns {boolean} isSearchEnabled   TRUE if searchbox should be displayed
     */
    isSearchEnabled() {
        return (this.props.minimumResultsForSearch !== -1 && this.getOptions().length >= this.props.minimumResultsForSearch) ||
            // the options prop has to be a function in order to assume that options are loaded async
            isFunction(this.props.options);
    }

    /**
     * loads async options if options is a function
     * @return {boolean} loadedOptions  TRUE, if options was called (async), otherwise FALSE
     */
    loadOptions() {
        const options = this.props.options;
        return isFunction(options) && options({
            value: '',
            callback: this.handleOptionsLoad
        });
    }

    /**
     * Handler for the async options loading callback
     * @param {object} data
     */
    handleOptionsLoad(data) {
        this.setState({
            options: data
        });
    }

    /**
     * Handler for input click event
     * prevents the dropdown from closing when you focus the text input
     * @param {object} e    event
     */
    handleOnInputClick(e) {
        e.stopPropagation();
    }

    /**
     * Handler for input change event
     * @param input
     */
    handleOnInputChange(input) {
        this.setState({
            searchValue: input
        });
    }

    /**
     * select callback for option selection
     * @param {string} incomingValue
     * @param {boolean} shouldTriggerOnSelect
     */
    select(incomingValue, shouldTriggerOnSelect = true) {
        const {placeholder, placeholderIcon} = this.props;
        const value = incomingValue || placeholder;

        this.setState({
            value,
            icon: Object.prototype.toString.call(this.getOptions()) === '[object Array]' ?
                this.getOptions().filter(o => o.value === value).map(o => o.icon)[0] : placeholderIcon,
            label: Object.prototype.toString.call(this.getOptions()) === '[object Array]' ?
                this.getOptions().filter(o => o.value === value).map(o => o.label)[0] : placeholder
        });

        if (shouldTriggerOnSelect) {
            this.props.onSelect(incomingValue);
        }
    }

    /**
     * renders a single option (<li/>) for the select box
     * @param {object} option
     * @param {string} option.icon
     * @param {string} option.label
     * @param {string} option.value
     * @param {number} index
     * @returns {JSX} option element
     */
    renderOption({icon, label, value}, index) {
        const theme = this.props.theme;
        const IconComponent = this.props.IconComponent;
        const onClick = () => {
            this.select(value);
        };

        return (
            <li
                key={index}
                className={theme.dropDown__item}
                onClick={onClick}
                >
                {
                    icon ?
                        <IconComponent className={theme.dropDown__itemIcon} icon={icon}/> :
                        null
                }
                <span>{ label }</span>
            </li>
        );
    }
}
