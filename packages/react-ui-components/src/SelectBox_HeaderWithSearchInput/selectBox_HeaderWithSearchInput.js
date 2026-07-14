/* eslint-disable camelcase, react/jsx-pascal-case */
import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';

/**
 * **SelectBox_HeaderWithSearchInput is an internal implementation detail of SelectBox**, meant to improve code quality.
 *
 * It is used inside SelectBox as the header component when no value is selected, and a filter/search box is shown.
 */
class SelectBox_HeaderWithSearchInput extends PureComponent {
    static propTypes = {
        // For explanations of the PropTypes, see SelectBox.js
        placeholder: PropTypes.string,
        placeholderIcon: PropTypes.string,
        displayLoadingIndicator: PropTypes.bool,
        searchTerm: PropTypes.string.isRequired,
        onSearchTermChange: PropTypes.func.isRequired,
        setFocus: PropTypes.bool,
        disabled: PropTypes.bool,

        // For keyboard handling
        onKeyDown: PropTypes.func,

        /* ------------------------------
         * Theme & Dependencies
         * ------------------------------ */
        theme: PropTypes.shape({
            selectBoxHeaderWithSearchInput: PropTypes.string.isRequired,
            selectBoxHeaderWithSearchInput__inputContainer: PropTypes.string.isRequired,
            selectBoxHeaderWithSearchInput__icon: PropTypes.string.isRequired,
            selectBoxHeaderWithSearchInput__input: PropTypes.string.isRequired
        }).isRequired,
        Icon: PropTypes.any.isRequired,
        TextInput: PropTypes.any.isRequired,
        IconButton: PropTypes.any.isRequired
    }

    static defaultProps = {
        placeholder: '',
        placeholderIcon: 'search'
    }

    clearSearch = event => {
        event.stopPropagation();
        this.props.onSearchTermChange('');
    }

    render() {
        const {
            searchTerm,
            onSearchTermChange,
            onKeyDown,
            placeholder,
            placeholderIcon,
            displayLoadingIndicator,
            setFocus,
            theme,
            Icon,
            TextInput,
            IconButton,
            disabled
        } = this.props;

        return (
            <div className={theme.selectBoxHeaderWithSearchInput}>
                <Icon
                    icon={placeholderIcon}
                    className={theme.selectBoxHeaderWithSearchInput__icon}
                    />
                <TextInput
                    containerClassName={theme.selectBoxHeaderWithSearchInput__inputContainer}
                    className={theme.selectBoxHeaderWithSearchInput__input}
                    value={searchTerm}
                    onChange={onSearchTermChange}
                    onKeyDown={onKeyDown}
                    placeholder={placeholder}
                    setFocus={setFocus}
                    type="search"
                    disabled={disabled}
                    />
                {displayLoadingIndicator && <Icon className={theme.selectBoxHeaderWithSearchInput__icon} spin={true} icon="spinner"/>}
                {searchTerm && <IconButton className={theme.selectBoxHeaderWithSearchInput__icon} icon="times" onClick={this.clearSearch}/>}
            </div>
        );
    }
}

export default SelectBox_HeaderWithSearchInput;
