import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import DropDown from '../DropDown/index';

export default class SelectBox extends PureComponent {

    static defaultProps = {
        optionValueField: 'value'
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
         * This prop is the placeholder text which is displayed in the selectbox when no option was selected.
         */
        placeholder: PropTypes.string,

        /**
         * This prop is an icon for the placeholder.
         */
        placeholderIcon: PropTypes.string,

        /**
         * helper for asynchronous loading; should be set to "true" as long as "options" is not yet populated.
         */
        displayLoadingIndicator: PropTypes.bool,

        /**
         * search box related properties
         */
        displaySearchBox: PropTypes.bool,

        searchTerm: PropTypes.string,

        onSearchTermChange: PropTypes.func,

        /**
         * An optional css theme to be injected.
         */
        theme: PropTypes.shape({/* eslint-disable quote-props */
            'wrapper': PropTypes.string,
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

    constructor(...args) {
        super(...args);

        this.state = {isOpen: false};

        this.renderOption = this.renderOption.bind(this);
        this.handleDeleteClick = this.handleDeleteClick.bind(this);
    }

    handleDropdownToggle = e => {
        if (e.target.nodeName.toLowerCase() === 'input' && e.target.type === 'text') {
            // force dropdown open if the search-input-box is focused
            this.setState({isOpen: true});
        } else {
            this.setState({isOpen: !this.state.isOpen});
        }
    }

    handleDropdownClose = () => {
        this.setState({isOpen: false});
    }

    render() {
        const {
            options,
            value,
            optionValueField,
            displayLoadingIndicator,
            theme,
            placeholder,
            placeholderIcon,
            displaySearchBox,
            searchTerm,
            onSearchTermChange,
            TextInputComponent,
            IconButtonComponent,
            IconComponent
        } = this.props;

        const selectedValue = (options || []).find(option => option[optionValueField] === value);

        let icon = '';
        let label = '';
        if (displaySearchBox) {
            icon = 'search';
        }
        if (selectedValue) {
            label = selectedValue.label;
            icon = selectedValue.icon ? selectedValue.icon : icon;
        } else if (displayLoadingIndicator) {
            label = '[Loading]'; // TODO: localize
        } else if (placeholder) {
            label = placeholder;
            icon = placeholderIcon ? placeholderIcon : icon;
        }

        return (
            <div className={theme.wrapper}>
                <DropDown.Stateless className={theme.dropDown} isOpen={this.state.isOpen} onToggle={this.handleDropdownToggle} onClose={this.handleDropdownClose}>
                    <DropDown.Header className={theme.dropDown__btn} shouldKeepFocusState={false}>
                        {icon ?
                            <IconComponent className={theme.dropDown__btnIcon} icon={icon}/> :
                            null
                        }
                        {displaySearchBox && !selectedValue ?
                            <TextInputComponent
                                value={searchTerm}
                                onChange={onSearchTermChange}
                                className={theme.dropDown__searchInput}
                                containerClassName={theme.dropDown__searchInputContainer}
                                /> :
                            <span>{label}</span>
                        }

                        {displayLoadingIndicator ?
                            <IconComponent className={theme.dropDown__loadingIcon} spin={true} icon="spinner"/> :
                            null
                        }
                        {!displayLoadingIndicator && displaySearchBox && selectedValue ?
                            <IconButtonComponent className={theme.dropDown__loadingIcon} icon="times" onClick={this.handleDeleteClick}/> :
                            null
                        }
                    </DropDown.Header>
                    <DropDown.Contents className={theme.dropDown__contents}>
                        {(options || []).map(this.renderOption)}
                    </DropDown.Contents>
                </DropDown.Stateless>
            </div>
        );
    }

    /**
     * renders a single option (<li/>) for the select box
     * @returns {JSX} option element
     */
    renderOption(option, index) {
        const {icon, label} = option;
        const value = option[this.props.optionValueField];
        const {theme, IconComponent} = this.props;
        const onClick = () => {
            this.props.onValueChange(value);
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

    handleDeleteClick() {
        this.props.onValueChange('');
    }
}
