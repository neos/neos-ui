import React, {PropTypes, PureComponent} from 'react';
import isFunction from 'lodash.isfunction';
import debounce from 'lodash.debounce';
import AbstractSelectBox, {propTypes as abstractSelectBoxPropTypes, state as abstractState} from './abstractSelectBox';
import DropDown from '../DropDown/index';

export default class SelectBox extends PureComponent {
    static propTypes = {
        /**
         * This prop represents either a set of options or a function that returns those.
         * Each option must have a value and can have a label and an icon.
         */
        options: PropTypes.arrayOf(
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
        SearchableSelectBoxComponent: PropTypes.any.isRequired,
        SimpleSelectBoxComponent: PropTypes.any.isRequired,
        TextInputComponent: PropTypes.any.isRequired
    };

    constructor(...args) {
        super(...args);

        this.renderOption = this.renderOption.bind(this);
        this.handleDeleteClick = this.handleDeleteClick.bind(this);
    }

    render() {
        const {
            options,
            value,
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

        const selectedValue = (options || []).find(option => option.value === value)

        let icon = '';

        let label = '';
        if (selectedValue) {
            label = selectedValue.label;
            icon = selectedValue.icon;
        } else if (displayLoadingIndicator) {
            label = '[Loading]'; // TODO: localize
        } else if (placeholder) {
            label = placeholder;
            icon = placeholderIcon;
        }

        return (
            <div className={theme.wrapper}>
                <DropDown className={theme.dropDown}>
                    <DropDown.Header className={theme.dropDown__btn} shouldKeepFocusState={false}>
                        {icon ?
                            <IconComponent className={theme.dropDown__btnIcon} icon={icon}/> :
                            null
                        }
                        {displaySearchBox && !selectedValue ?
                            <span><TextInputComponent value={searchTerm} onChange={onSearchTermChange}/></span>
                            : <span>{label}</span>
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
                </DropDown>
            </div>
        );
    }

    /**
     * renders a single option (<li/>) for the select box
     * @returns {JSX} option element
     */
    renderOption({icon, label, value}, index) {
        const theme = this.props.theme;
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
                        <Icon className={theme.dropDown__itemIcon} icon={icon}/> :
                        null
                }
                <span>{ label }</span>
            </li>
        );
    }

    handleDeleteClick() {
        this.props.onValueChange(undefined);
    }
}
