import React, {PureComponent, PropTypes} from 'react';

export default class SearchableSelectBox extends PureComponent {
    static propTypes = {
        value: PropTypes.string,
        label: PropTypes.string,
        icon: PropTypes.string,
        isLoadingOptions: PropTypes.bool,

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
         * This prop gets called when an option was selected. It returns the new value.
         */
        onSelect: PropTypes.func.isRequired,

        /**
         * If passed, a `delete` icon will be rendered instead of a chevron,
         * this prop will be called when clicking on the icon.
         */
        onDelete: PropTypes.func.isRequired,

        /**
         * An optional css theme to be injected.
         */
        theme: PropTypes.shape({/* eslint-disable quote-props */
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
        }).isRequired, /* eslint-enable quote-props */

        //
        // Static component dependencies which are injected from the outside (index.js)
        //
        DropDownComponent: PropTypes.any.isRequired,
        IconComponent: PropTypes.any.isRequired,
        InputComponent: PropTypes.any.isRequired
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
            this.setState({
                searchValue: ''
            });
            this.props.onDelete();
        };
        this.handleOnInputChange = this.handleOnInputChange.bind(this);
    }

    render() {
        const {
            DropDownComponent,
            IconComponent,
            InputComponent,
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
                        <IconComponent className={theme.dropDown__btnIcon} icon={icon}/> :
                        null
                    }
                    {label}
                    <a href="" onClick={handleDeleteClick} className={theme.dropDown__btnDelete}><IconComponent
                        icon="close"/></a>
                </div>
            )
        };

        const renderSearchHeader = (searchValue, label, onChange, theme) => {
            return (
                <div className={theme.dropDown__searchInputWrapper}>
                    <IconComponent icon="search"/>
                    <InputComponent
                        value={searchValue}
                        placeholder={label}
                        onChange={onChange}
                        className={theme.dropDown__searchInput}
                    />
                </div>
            )
        };

        return (
            <DropDownComponent className={theme.dropDown}>
                <DropDownComponent.Header className={theme.dropDown__btn} shouldKeepFocusState={false}>
                    {isLoadingOptions ?
                        <div>
                            <span>Loading ...</span>
                            <IconComponent className={theme.dropDown__loadingIcon} icon="spinner"/>
                        </div>
                        :
                        this.isOptionSelected() ?
                            renderOptionHeader(icon, label, this.handleDeleteClick, theme) :
                            renderSearchHeader(searchValue, label, this.handleOnInputChange, theme)
                    }
                </DropDownComponent.Header>
                {this.getOptions() ?
                    <DropDownComponent.Contents className={theme.dropDown__contents}>
                        {Object.prototype.toString.call(this.getOptions()) === '[object Array]' ?
                            this.getOptions()
                                .filter(this.filterOption)
                                .map(this.renderOption) : null}
                    </DropDownComponent.Contents> :
                    null
                }
            </DropDownComponent>
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
        return !this.state.searchValue || o.label.toLowerCase().indexOf(this.state.searchValue.toLowerCase()) !== -1;
    }

    /**
     * @returns {boolean} isOptionSelected   TRUE if a option is selected
     */
    isOptionSelected() {
        return !!this.props.value
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
            this.props.onSelect(value, true);
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
