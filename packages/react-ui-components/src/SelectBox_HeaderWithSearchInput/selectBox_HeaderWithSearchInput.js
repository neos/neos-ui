/* eslint-disable camelcase, react/jsx-pascal-case */
import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';

const Fragment = props => props.children;

/**
 * **SelectBox_HeaderWithSearchInput is an internal implementation detail of SelectBox**, meant to improve code quality.
 *
 * It is used inside SelectBox as the header component when no value is selected, and a filter/search box is shown.
 */
export default class SelectBox_HeaderWithSearchInput extends PureComponent {

    static defaultProps = {
        placeholder: ''
    };

    static propTypes = {
        // For explanations of the PropTypes, see SelectBox.js
        placeholder: PropTypes.string,
        displayLoadingIndicator: PropTypes.bool,
        searchTerm: PropTypes.string.isRequired,
        onSearchTermChange: PropTypes.func.isRequired,
        setFocus: PropTypes.bool,

        /* ------------------------------
         * Theme & Dependencies
         * ------------------------------ */
        theme: PropTypes.shape({
            selectBoxHeaderWithSearchInput__inputContainer: PropTypes.string.isRequired,
            selectBoxHeaderWithSearchInput__input: PropTypes.string.isRequired,
            selectBoxHeaderWithSearchInput__loader: PropTypes.string.isRequired,
            selectBoxHeaderWithSearchInput__deleteButton: PropTypes.string.isRequired
        }).isRequired,
        Icon: PropTypes.any.isRequired,
        TextInput: PropTypes.any.isRequired,
        IconButton: PropTypes.any.isRequired
    }

    render() {
        const {
            searchTerm,
            onSearchTermChange,
            placeholder,
            displayLoadingIndicator,
            setFocus,
            theme,
            Icon,
            TextInput,
            IconButton
        } = this.props;

        const clearSearch = event => {
            event.stopPropagation();
            onSearchTermChange('');
        };

        return (
            <Fragment>
                <Icon
                    icon="search"
                    />
                <TextInput
                    containerClassName={theme.selectBoxHeaderWithSearchInput__inputContainer}
                    className={theme.selectBoxHeaderWithSearchInput__input}
                    value={searchTerm}
                    onChange={onSearchTermChange}
                    placeholder={placeholder}
                    setFocus={setFocus}
                    type="search"
                    />
                {searchTerm && <IconButton className={theme.selectBoxHeaderWithSearchInput__deleteButton} icon="times" onClick={clearSearch}/>}
                {displayLoadingIndicator && <Icon className={theme.selectBoxHeaderWithSearchInput__loader} spin={true} icon="spinner"/>}
            </Fragment>
        );
    }
}
