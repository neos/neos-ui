import React, {Component, PropTypes} from 'react';
import shallowCompare from 'react-addons-shallow-compare';
import isFunction from 'lodash.isfunction';

export default class SelectBox extends Component {
    static propTypes = {
        value: PropTypes.string,
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
        placeholder: PropTypes.string,
        placeholderIcon: PropTypes.string,
        onSelect: PropTypes.func.isRequired,
        theme: PropTypes.shape({// eslint-disable-line quote-props
            'wrapper': PropTypes.string,
            'dropDown': PropTypes.string,
            'dropDown__btn': PropTypes.string,
            'dropDown__btnIcon': PropTypes.string,
            'dropDown__contents': PropTypes.string,
            'dropDown__item': PropTypes.string,
            'dropDown__itemIcon': PropTypes.string
        }).isRequired,
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
    }

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
        this.select(value);
    }

    shouldComponentUpdate(...args) {
        return shallowCompare(this, ...args);
    }

    componentDidUpdate(prevProps, prevState) {
        // if the search input changes, reload async options
        if (prevState.searchValue !== this.state.seachValue) {
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

    getOptions() {
        return this.state.options || this.props.options;
    }

    // filter options by searchValue
    filterOption(o) {
        return !this.state.searchValue || o.label.toLowerCase().indexOf(this.state.searchValue.toLowerCase()) !== -1;
    }

    // returns TRUE if searchbox should be displayed
    isSearchEnabled() {
        return (this.props.minimumResultsForSearch !== -1 && this.getOptions().length >= this.props.minimumResultsForSearch) ||
            // the options prop has to be a function in order to assume that options are loaded async
            isFunction(this.props.options);
    }

    // loads async options if options is a function
    loadOptions() {
        const options = this.props.options;
        return isFunction(options) && options({
            value: '',
            callback: this.handleOptionsLoad
        });
    }

    handleOptionsLoad(data) {
        this.setState({
            options: data
        });
    }

    // prevent the dropdown from closing when you focus the text input
    handleOnInputClick(e) {
        e.stopPropagation();
    }

    handleOnInputChange(input) {
        this.setState({
            searchValue: input
        });
    }

    select(incomingValue) {
        const {placeholder, placeholderIcon} = this.props;
        const value = incomingValue || placeholder;

        this.setState({
            value,
            icon: Object.prototype.toString.call(this.getOptions()) === '[object Array]' ?
                this.getOptions().filter(o => o.value === value).map(o => o.icon)[0] : placeholderIcon,
            label: Object.prototype.toString.call(this.getOptions()) === '[object Array]' ?
                this.getOptions().filter(o => o.value === value).map(o => o.label)[0] : placeholder
        });
    }

    // renders a single option (<li/>) for the select box
    renderOption({icon, label, value}, index) {
        const theme = this.props.theme;
        const IconComponent = this.props.IconComponent;
        const onClick = () => {
            this.select(value);
            this.props.onSelect(value);
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
