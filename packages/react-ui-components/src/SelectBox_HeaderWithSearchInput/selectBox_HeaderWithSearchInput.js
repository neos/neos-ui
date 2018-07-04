/* eslint-disable camelcase, react/jsx-pascal-case */
import React from 'react';
import PropTypes from 'prop-types';

/**
 * **SelectBox_HeaderWithSearchInput is an internal implementation detail of SelectBox**, meant to improve code quality.
 *
 * It is used inside SelectBox as the header component when no value is selected, and a filter/search box is shown.
 */
const SelectBox_HeaderWithSearchInput = props => {
    const {
        searchTerm,
        onSearchTermChange,
        onKeyDown,
        placeholder,
        displayLoadingIndicator,
        setFocus,
        theme,
        Icon,
        TextInput,
        IconButton,
        disabled
    } = props;

    const clearSearch = event => {
        event.stopPropagation();
        onSearchTermChange('');
    };

    return (
        <div className={theme.selectBoxHeaderWithSearchInput}>
            <Icon
                icon="search"
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
            {searchTerm && <IconButton className={theme.selectBoxHeaderWithSearchInput__icon} icon="times" onClick={clearSearch}/>}
        </div>
    );
};
SelectBox_HeaderWithSearchInput.defaultProps = {
    placeholder: ''
};
SelectBox_HeaderWithSearchInput.propTypes = {
    // For explanations of the PropTypes, see SelectBox.js
    placeholder: PropTypes.string,
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
};

export default SelectBox_HeaderWithSearchInput;
