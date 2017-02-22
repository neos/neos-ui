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
         * An optional css theme to be injected.
         */
        theme: PropTypes.shape({/* eslint-disable quote-props */
            'wrapper': PropTypes.string,
            'dropDown': PropTypes.string,
            'dropDown__btn': PropTypes.string,
            'dropDown__btnIcon': PropTypes.string,
            'dropDown__contents': PropTypes.string,
            'dropDown__item': PropTypes.string,
            'dropDown__itemIcon': PropTypes.string,
            'dropDown__loadingIcon': PropTypes.string,
            'dropDown__searchInput': PropTypes.string
        }).isRequired, /* eslint-enable quote-props */

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
        value: undefined,
        icon: undefined,
        label: undefined,
        searchValue: '',
        isLoadingOptions: false
    };

    constructor(...args) {
        super(...args);

        this.filterOption = this.filterOption.bind(this);
        this.renderOption = this.renderOption.bind(this);
        this.handleDeleteClick = e => {
            e.preventDefault();
            e.stopPropagation();

            this.setState({
                value: undefined,
                label: undefined,
                searchValue: ''
            });

            if (this.props.onDelete) {
                this.props.onDelete();
            }
        };
        this.handleOnInputChange = this.handleOnInputChange.bind(this);
        this.handleOptionsLoad = this.handleOptionsLoad.bind(this);
    }

    componentDidMount() {
        this.select(this.props.value, false);

        if (isFunction(this.props.options)) {
            this.loadOptions(); // initially load options
        }
    }

    componentDidUpdate(_, prevState) {
        // if the search input changes, reload async options
        if (prevState.searchValue !== this.state.searchValue && isFunction(this.props.options)) {
            this.loadOptions();
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
        const {icon, label, searchValue = '', isLoadingOptions} = this.state;

        return (
            <div className={theme.wrapper}>
                <DropDownComponent className={theme.dropDown}>
                    <DropDownComponent.Header className={theme.dropDown__btn} shouldKeepFocusState={false}>
                        {this.isSearchEnabled() ?
                            <IconComponent icon="search"/> :
                            icon || placeholderIcon ?
                                <IconComponent className={theme.dropDown__btnIcon} icon={icon || placeholderIcon}/> :
                                null
                        }
                        {this.isSearchEnabled() ?
                            <InputComponent
                                value={searchValue}
                                placeholder={placeholder}
                                onChange={this.handleOnInputChange}
                                className={theme.dropDown__searchInput}
                            /> :
                            isLoadingOptions ?
                                <span>Loading ...</span> :
                                <span>{label || placeholder}</span>

                        }
                        {this.isDeleteEnabled() ?
                            <a href="" onClick={this.handleDeleteClick} className={theme.dropDown__btnDelete}><IconComponent icon="close"/></a> :
                            null
                        }
                        {isLoadingOptions ?
                            <IconComponent className={theme.dropDown__loadingIcon} icon="spinner"/> :
                            null
                        }
                    </DropDownComponent.Header>
                    <DropDownComponent.Contents className={theme.dropDown__contents}>
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
        if (!isFunction(this.props.onDelete)) {
            return false
        } else if (this.state.value) {
            return false
        } else {
            return (this.props.minimumResultsForSearch !== -1 && this.getOptions().length >= this.props.minimumResultsForSearch) ||
                // the options prop has to be a function in order to assume that options are loaded async
                isFunction(this.props.options);
        }
    }

    /**
     * @returns {boolean} isDeleteEnabled   TRUE if delete button should be displayed
     */
    isDeleteEnabled() {
        return !!this.state.value && isFunction(this.props.onDelete)
    }

    /**
     * loads async options if options is a function
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
        this.select(this.state.value, false);
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

        this.setState({
            value: incomingValue,
            icon: Object.prototype.toString.call(this.getOptions()) === '[object Array]' ?
                this.getOptions().filter(o => o.value === incomingValue).map(o => o.icon)[0] : placeholderIcon,
            label: Object.prototype.toString.call(this.getOptions()) === '[object Array]' ?
                this.getOptions().filter(o => o.value === incomingValue).map(o => o.label)[0] : placeholder
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
