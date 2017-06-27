import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';

import DropDown from '../DropDown/index';
import Icon from '../Icon/index';
import TextInput from '../TextInput/index';

export default class SearchableSelectBox extends PureComponent {
    static propTypes = {
        /**
         * This prop represents the current selected value.
         */
        value: PropTypes.string,

        /**
         * This prop represents the current label to show. Can be a placeholder or the label of the selected value.
         */
        label: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.object
        ]),

        /**
         * This prop represents the current icon to show. Can be empty, or a placeholder or the icon of the selected value
         */
        icon: PropTypes.string,

        /**
         * This prop represents if the results are currently loading or not.
         */
        isLoadingOptions: PropTypes.bool,

        /**
         * This prop represents either a set of options or a function that returns those.
         * Each option must have a value and can have a label and an icon.
         */
        options: PropTypes.oneOfType([
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
         * This prop gets called when an option was selected. It returns the new value.
         */
        onSelect: PropTypes.func.isRequired,

        /**
         * If passed, a `delete` icon will be rendered instead of a chevron,
         * this prop will be called when clicking on the icon.
         */
        onDelete: PropTypes.func.isRequired,

        onInput: PropTypes.func.isRequired,

        /**
         * An optional css theme to be injected.
         */
        theme: PropTypes.shape({
            /* eslint-disable quote-props */
            'dropDown': PropTypes.string,
            'dropDown__btn': PropTypes.string,
            'dropDown__btnIcon': PropTypes.string,
            'dropDown__contents': PropTypes.string,
            'dropDown__item': PropTypes.string,
            'dropDown__itemIcon': PropTypes.string,
            'dropDown__loadingIcon': PropTypes.string,
            'dropDown__searchInput': PropTypes.string,
            'dropDown__searchInputWrapper': PropTypes.string,
            'dropDown__btnDelete': PropTypes.string
        }).isRequired /* eslint-enable quote-props */
    };

    state = {
        searchValue: ''
    };

    constructor(...args) {
        super(...args);

        this.filterOption = this.filterOption.bind(this);
        this.renderOption = this.renderOption.bind(this);
        this.handleDeleteClick = e => {
            e.preventDefault();
            e.stopPropagation();
            // TODO set focus on input field
            this.handleOnInputChange('');
            this.props.onDelete();
        };
        this.handleOnInputChange = this.handleOnInputChange.bind(this);
    }

    render() {
        const {
            label,
            icon,
            theme,
            isLoadingOptions
        } = this.props;
        const {searchValue = ''} = this.state;

        const renderOptionHeader = (icon, label, handleDeleteClick, theme) => {
            return (
                <div>
                    {icon ?
                        <Icon className={theme.dropDown__btnIcon} icon={icon}/> :
                        null
                    }
                    {label}
                    <a href="" onClick={handleDeleteClick} className={theme.dropDown__btnDelete}><Icon icon="close"/></a>
                </div>
            );
        };

        const renderSearchHeader = (searchValue, label, onChange, theme) => {
            return (
                <div className={theme.dropDown__searchInputWrapper}>
                    <Icon icon="search"/>
                    <TextInput
                        value={searchValue}
                        placeholder={label}
                        onChange={onChange}
                        className={theme.dropDown__searchInput}
                        />
                </div>
            );
        };

        return (
            <DropDown className={theme.dropDown}>
                <DropDown.Header className={theme.dropDown__btn} shouldKeepFocusState={false}>
                    {this.isOptionSelected() ?
                        renderOptionHeader(icon, label, this.handleDeleteClick, theme) :
                        renderSearchHeader(searchValue, label, this.handleOnInputChange, theme)
                    }

                    {isLoadingOptions ?
                        <Icon className={theme.dropDown__loadingIcon} spin={true} icon="spinner"/> : null
                    }
                </DropDown.Header>
                {Object.prototype.toString.call(this.getOptions()) === '[object Array]' ?
                    <DropDown.Contents className={theme.dropDown__contents}>
                        {this.getOptions()
                            .filter(this.filterOption) // TODO filtering is not needed when we use a external api for searching
                            .map(this.renderOption)}
                    </DropDown.Contents> :
                    null
                }
            </DropDown>
        );
    }

    /**
     * returns the options
     * @returns {Array}
     */
    getOptions() {
        return this.props.options;
    }

    /**
     * iterator method for filtering by searchValue
     * @param {object} o option
     * @returns {boolean} TRUE if passed filter
     */
    filterOption(o) {
        if (this.props.loadOptionsOnInput) {
            return true;
        }
        return !this.state.searchValue || o.label.toLowerCase().indexOf(this.state.searchValue.toLowerCase()) !== -1;
    }

    /**
     * @returns {boolean} isOptionSelected   TRUE if a option is selected
     */
    isOptionSelected() {
        return Boolean(this.props.value);
    }

    /**
     * Handler for input change event
     * @param input
     */
    handleOnInputChange(input) {
        this.setState({
            searchValue: input
        });

        // when we search options async we call the external api with the current searchValue
        if (this.props.loadOptionsOnInput) {
            this.props.onInput(input);
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
    renderOption(valueObject, index) {
        const {icon, label, value} = valueObject;
        const theme = this.props.theme;
        const onClick = () => {
            this.props.onSelect(valueObject, true);
        };

        return (
            <li
                key={index}
                className={theme.dropDown__item}
                onClick={onClick}
                >
                {
                    icon ?
                        <Icon className={theme.dropDown__itemIcon} icon={icon}/> :
                        null
                }
                <span>{ label }</span>
            </li>
        );
    }
}
