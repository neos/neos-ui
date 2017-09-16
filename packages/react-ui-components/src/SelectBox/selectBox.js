import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import DropDown from '../DropDown/index';
import mergeClassNames from 'classnames';

export default class SelectBox extends PureComponent {

    static defaultProps = {
        optionValueField: 'value',
        scrollable: true
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
         * if true, allows to clear the selected element completely (without choosing another one)
         */
        allowEmpty: PropTypes.bool,

        /**
         * limit height and show scrollbars if needed, defaults to true
         */
        scrollable: PropTypes.bool,

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
            highlight,
            placeholder,
            placeholderIcon,
            displaySearchBox,
            searchTerm,
            onSearchTermChange,
            scrollable,
            TextInputComponent,
            IconButtonComponent,
            IconComponent
        } = this.props;
        const {isOpen} = this.state
        let allowEmpty = this.props.allowEmpty;

        const selectedValue = (options || []).find(option => option[optionValueField] === value);

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
            label = '[Loading]'; // TODO: localize
        } else if (placeholder) {
            label = (<span className={theme.dropDown__placeholder}>{placeholder}</span>);
            icon = placeholderIcon ? placeholderIcon : icon;
        }

        const classNames = mergeClassNames({
            [theme.wrapper]: true,
            [theme['wrapper--highlight']]: (highlight && !isOpen)
        });

        return (
            <div className={classNames}>
                <DropDown.Stateless className={theme.dropDown} isOpen={isOpen} onToggle={this.handleDropdownToggle} onClose={this.handleDropdownClose}>
                    <DropDown.Header className={theme.dropDown__btn} shouldKeepFocusState={false}>
                        {icon ?
                            <IconComponent className={theme.dropDown__btnIcon} icon={icon}/> :
                            null
                        }
                        {displaySearchBox && !selectedValue ?
                            <TextInputComponent
                                placeholder={placeholder}
                                value={searchTerm}
                                onChange={onSearchTermChange}
                                className={theme.dropDown__searchInput}
                                containerClassName={theme.dropDown__searchInputContainer}
                                /> :
                            <span className={theme.dropDown__itemLabel}>{label}</span>
                        }

                        {displayLoadingIndicator ?
                            <IconComponent className={theme.dropDown__loadingIcon} spin={true} icon="spinner"/> :
                            null
                        }
                        {!displayLoadingIndicator && allowEmpty && selectedValue ?
                            <IconButtonComponent className={theme.dropDown__loadingIcon} icon="times" onClick={this.handleDeleteClick}/> :
                            null
                        }
                    </DropDown.Header>
                    <DropDown.Contents className={theme.dropDown__contents} scrollable={scrollable}>
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
                <span className={theme.dropDown__itemLabel}>{ label }</span>
            </li>
        );
    }

    handleDeleteClick() {
        this.props.onValueChange('');
    }
}
