import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import DropDown from '../DropDown/index';
import DefaultSelectBoxOption from './defaultSelectBoxOption';
import mergeClassNames from 'classnames';

export default class SelectBox extends PureComponent {

    static defaultProps = {
        options: [],
        optionValueField: 'value',
        withoutGroupLabel: 'Without group',
        scrollable: true,
        optionComponent: DefaultSelectBoxOption
    };

    static propTypes = {
        /**
         * This prop represents a set of options.
         * Each option must have a value and can have a label and an icon.
         */
        options: PropTypes.arrayOf(
            PropTypes.shape({
                icon: PropTypes.string,
                // "value" is not part of PropTypes validation, as the "value field" is specified via the "optionValueField" property
                label: PropTypes.oneOfType([
                    PropTypes.string,
                    PropTypes.object
                ]).isRequired
            })
        ),

        /**
         * Field name specifying which field in a single "option" contains the "value"
         */
        optionValueField: PropTypes.string,

        /**
         * This prop represents the current selected value.
         */
        value: PropTypes.string,

        /**
         * This prop gets called when an option was selected. It returns the new value.
         */
        onValueChange: PropTypes.func.isRequired,

        /**
         * This prop gets called when requested to create a new element
         */
        onCreateNew: PropTypes.func,

        /**
         * "Create new" label
         */
        createNewLabel: PropTypes.string,

        /**
         * This prop is the placeholder text which is displayed in the selectbox when no option was selected.
         */
        placeholder: PropTypes.string,

        /**
         * This prop is an icon for the placeholder.
         */
        placeholderIcon: PropTypes.string,

        /**
         * text for the group label of options without a group
         */
        withoutGroupLabel: PropTypes.string,

        /**
         * This prop is the loading text which is displayed in the selectbox when displayLoadingIndicator ist set to true.
         */
        loadingLabel: PropTypes.string,

        /**
         * helper for asynchronous loading; should be set to "true" as long as "options" is not yet populated.
         */
        displayLoadingIndicator: PropTypes.bool,

        /**
         * if true, allows to clear the selected element completely (without choosing another one)
         */
        allowEmpty: PropTypes.bool,

        /**
         * limit height and show scrollbars if needed, defaults to true
         */
        scrollable: PropTypes.bool,

        /**
         * Set the focus to the input element after mount
         */
        setFocus: PropTypes.bool,

        /**
         * search box related properties
         */
        displaySearchBox: PropTypes.bool,

        searchTerm: PropTypes.string,

        onSearchTermChange: PropTypes.func,

        /**
         * Highlight input
         */
        highlight: PropTypes.bool,

        /**
         * Component used for rendering the individual option elements; Usually this component uses "SelectBoxOption" internally for common styling.
         */
        optionComponent: PropTypes.any,

        /**
         * An optional css theme to be injected.
         */
        theme: PropTypes.shape({/* eslint-disable quote-props */
            'wrapper': PropTypes.string,
            'wrapper--highlight': PropTypes.string,
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
        TextInputComponent: PropTypes.any.isRequired
    };

    state = {
        isOpen: false,
        selectedIndex: -1
    };

    componentWillReceiveProps({keydown}) {
        this.handleKeyDown(keydown.event);
    }

    handleDropdownToggle = e => {
        if (e.target.nodeName.toLowerCase() === 'input' && e.target.type === 'text') {
            // force dropdown open if the search-input-box is focused
            this.setState({isOpen: true});
        } else if (this.state.isOpen) {
            // reset selected index to not get falsy preselected values
            // if dropdown is opened more than once
            this.setState({
                isOpen: false,
                selectedIndex: -1
            });
        } else {
            this.setState({
                isOpen: true
            });
        }
    }

    handleDropdownClose = () => {
        this.setState({isOpen: false});
    }

    handleSearchTermChange = (...args) => {
        this.setState({isOpen: true});
        this.props.onSearchTermChange(...args);
    }

    isCreateNewEnabled = () => this.props.onCreateNew && this.props.searchTerm;

    getOptionsCount = () => {
        const {options, withoutGroupLabel} = this.props;

        const groupedOptions = this.getGroupedOptions(options);
        const hasMultipleGroups = Object.keys(groupedOptions).length > 1 || (Object.keys(groupedOptions).length === 1 && !groupedOptions[withoutGroupLabel]);
        let count = hasMultipleGroups ? groupedOptions.length : options.length;
        if (this.isCreateNewEnabled()) {
            count++;
        }
        return count;
    }

    handleClearSearch = () => {
        const {onSearchTermChange} = this.props;

        if (onSearchTermChange) {
            onSearchTermChange('');
        }
    }

    handleValueChange = (...rest) => {
        this.props.onValueChange(...rest);
        // Clear search box after searching
        this.handleClearSearch();
    }

    handleCreateNew = (...rest) => {
        this.props.onCreateNew(...rest);
        // Clear search box on creating new
        this.handleClearSearch();
    }

    handleKeyDown = e => {
        if (this.state.isOpen && e) {
            const {options, optionValueField, searchTerm} = this.props;
            const currentIndex = this.state.selectedIndex;

            if (e.key === 'ArrowDown') {
                this.setState({
                    selectedIndex: currentIndex + 1 >= this.getOptionsCount() ? currentIndex : currentIndex + 1
                });
            } else if (e.key === 'ArrowUp') {
                this.setState({
                    selectedIndex: currentIndex - 1 < 0 ? 0 : currentIndex - 1
                });
            } else if (e.key === 'Enter') {
                if (this.isCreateNewEnabled() && currentIndex + 1 === this.getOptionsCount()) {
                    this.handleCreateNew(searchTerm);
                } else if (optionValueField === undefined) {
                    this.handleValueChange(options[currentIndex].value);
                } else {
                    this.handleValueChange(options[currentIndex][optionValueField]);
                }
                this.setState({
                    isOpen: false
                });
            }
        }
    }

    render() {
        const {
            options,
            value,
            optionValueField,
            loadingLabel,
            displayLoadingIndicator,
            theme,
            highlight,
            setFocus,
            placeholder,
            placeholderIcon,
            displaySearchBox,
            searchTerm,
            scrollable,
            TextInputComponent,
            IconButtonComponent,
            IconComponent,
            withoutGroupLabel
        } = this.props;
        const {isOpen} = this.state;
        let {allowEmpty} = this.props;

        const selectedValue = options.find(option => option[optionValueField] === value);

        const groupedOptions = this.getGroupedOptions(options);

        const hasMultipleGroups = Object.keys(groupedOptions).length > 1 || (Object.keys(groupedOptions).length === 1 && !groupedOptions[withoutGroupLabel]);

        // if the search box should be shown, we *need* to force allowEmpty (to display the "clear" button if a value is selected),
        // as the search box is only shown if nothing is selected.
        // If we would not force this and allowEmpty=false, the user could not go back to the search box after he has initially selected a value.
        if (displaySearchBox) {
            allowEmpty = true;
        }

        let icon = '';
        let label = '';
        if (displaySearchBox) {
            icon = 'search';
        }
        if (selectedValue) {
            label = selectedValue.label;
            icon = selectedValue.icon ? selectedValue.icon : icon;
        } else if (displayLoadingIndicator) {
            label = loadingLabel ? '[' + loadingLabel + ']' : '[Loading]';
        } else if (placeholder) {
            label = (<span className={theme.selectBox__placeholder}>{placeholder}</span>);
            icon = placeholderIcon ? placeholderIcon : icon;
        }

        const classNames = mergeClassNames({
            [theme.wrapper]: true,
            [theme['wrapper--highlight']]: (highlight && !isOpen)
        });

        const showResetButton = !displayLoadingIndicator && allowEmpty && selectedValue;

        let headerClass = theme.selectBox__btn;
        if (showResetButton || displayLoadingIndicator) {
            headerClass += ' ' + theme.selectBox__twoIconIndention;
        }

        return (
            <div className={classNames}>
                <DropDown.Stateless className={theme.selectBox} isOpen={isOpen} onToggle={this.handleDropdownToggle} onClose={this.handleDropdownClose}>
                    <DropDown.Header className={headerClass} shouldKeepFocusState={false} showDropDownToggle={Boolean(options.length)}>
                        {icon ?
                            <IconComponent className={theme.selectBox__btnIcon} icon={icon}/> :
                            null
                        }
                        {displaySearchBox && !selectedValue ?
                            <TextInputComponent
                                placeholder={placeholder}
                                value={searchTerm}
                                onChange={this.handleSearchTermChange}
                                className={theme.selectBox__searchInput}
                                setFocus={setFocus}
                                onKeyDown={this.handleKeyDown}
                                containerClassName={theme.selectBox__searchInputContainer}
                                /> :
                            <span className={theme.dropDown__itemLabel}>{label}</span>
                        }

                        {displayLoadingIndicator ?
                            <IconComponent className={theme.selectBox__loadingIcon} spin={true} icon="spinner"/> :
                            null
                        }
                        {showResetButton ?
                            <IconButtonComponent className={theme.selectBox__deleteIcon} icon="times" onClick={this.handleDeleteClick}/> :
                            null
                        }
                    </DropDown.Header>
                    <DropDown.Contents className={theme.selectBox__contents} scrollable={scrollable}>
                        {hasMultipleGroups ? // skip rendering of groups if there are none or only one group
                            Object.entries(groupedOptions).map(this.renderGroup) :
                            options.map(this.renderOption)}
                        {this.renderCreateNew()}
                    </DropDown.Contents>
                </DropDown.Stateless>
            </div>
        );
    }

    renderCreateNew() {
        const {theme, searchTerm, IconComponent, createNewLabel} = this.props;
        const index = this.getOptionsCount() - 1;
        if (!this.isCreateNewEnabled()) {
            return null;
        }
        const onClick = () => {
            this.handleCreateNew(searchTerm);
        };
        const isActive = index === this.state.selectedIndex;
        const className = isActive ? theme['selectBox__item--isSelectable--active'] : '';

        const setIndex = () => {
            this.setSelectedIndex(index);
        };
        return (
            <div key={index} onMouseEnter={setIndex}>
                <DefaultSelectBoxOption
                    option={{value: searchTerm, label: `${createNewLabel} "${searchTerm}"`, icon: 'plus-circle'}}
                    theme={theme}
                    className={className}
                    onClick={onClick}
                    IconComponent={IconComponent}
                    />
            </div>
        );
    }

    /**
     * Groups the options of the selectBox by their group-attribute. Returns a javascript Map with the group names
     * as key and an array of options as values.
     * Options without a group-attribute assigned will receive the key specified in props.withoutGroupLabel.
     */
    getGroupedOptions = options => {
        return options.reduce((accumulator, currentOpt) => {
            const groupLabel = currentOpt.group ? currentOpt.group : this.props.withoutGroupLabel;
            accumulator[groupLabel] = accumulator[groupLabel] || [];
            accumulator[groupLabel].push(currentOpt);
            return accumulator;
        }, Object.create(null)); // <-- Initial value of the accumulator
    }

    /**
     * Renders the options of the selectBox as <li> and groups them below a <span>
     * that displays their group name.
     * @returns {JSX} option elements grouped by and labeled with their group-attribute.
     */
    renderGroup = group => {
        const [groupLabel, optionsList] = group;
        const {theme} = this.props;
        const groupClassName = mergeClassNames({
            [theme.selectBox__item]: true,
            [theme['selectBox__item--isGroup']]: true
        });
        return (
            <li
                key={groupLabel}
                className={groupClassName}
                >
                <span>
                    {groupLabel}
                </span>
                <ul>
                    { optionsList.map(this.renderOption) }
                </ul>
            </li>
        );
    }

    /**
     * Renders a single option (<li/>) for the select box
     * @returns {JSX} option element
     */
    renderOption = (option, index) => {
        const {theme, IconComponent, optionComponent, optionValueField} = this.props;
        const selectedIndex = this.state.selectedIndex;
        const value = option[optionValueField];
        const onClick = () => {
            this.handleValueChange(value);
        };
        const isActive = index === selectedIndex;
        const className = isActive ? theme['selectBox__item--isSelectable--active'] : '';

        const setIndex = () => {
            this.setSelectedIndex(index);
        };

        const OptionComponent = optionComponent;
        // onMouseEnter doesn't work on OptionComponent
        return <div key={index} onMouseEnter={setIndex}><OptionComponent className={className} isActive={isActive} option={option} key={index} onClick={onClick} theme={theme} IconComponent={IconComponent}/></div>;
    }

    setSelectedIndex = selectedIndex => {
        if (selectedIndex !== this.state.selectedIndex) {
            this.setState({selectedIndex});
        }
    }

    handleDeleteClick = () => {
        this.handleValueChange('');
    }
}
