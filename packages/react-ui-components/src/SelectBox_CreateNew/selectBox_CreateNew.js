/* eslint-disable camelcase, react/jsx-pascal-case */
import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import SelectBox_Option_SingleLine from '../SelectBox_Option_SingleLine';

const CREATE_NEW_IS_FOCUSED = 'NEOS_UI_CREATE_NEW_IS_FOCUSED';

/**
 * **SelectBox_CreateNew is an internal implementation detail of SelectBox**, meant to improve code quality.
 *
 * It is used inside SelectBox_ListPreview as the last list element; and it is rendered if the `onCreateNew`
 * prop is specified.
 */

class SelectBox_CreateNew extends PureComponent {
    static propTypes = {
        // For explanations of the PropTypes, see SelectBox.js
        optionValueField: PropTypes.string.isRequired,
        searchTerm: PropTypes.string,
        onSearchTermChange: PropTypes.func,
        onCreateNew: PropTypes.func,
        createNewLabel: PropTypes.string,

        // API with SelectBox
        focusedValue: PropTypes.string,
        onOptionFocus: PropTypes.func.isRequired
    }

    handleCreateNew = () => {
        const {
            searchTerm,
            onSearchTermChange,
            onCreateNew
        } = this.props;
        onCreateNew(searchTerm);
        // Clear search box on creating new
        onSearchTermChange('');
    }

    handleMouseEnter = () => {
        const {
            optionValueField,
            onOptionFocus
        } = this.props;

        const selectedOption = {
            [optionValueField]: CREATE_NEW_IS_FOCUSED
        };

        onOptionFocus(selectedOption);
    };

    render() {
        const {
            searchTerm,
            onCreateNew,
            createNewLabel,
            focusedValue
        } = this.props;
        const isHighlighted = focusedValue === CREATE_NEW_IS_FOCUSED;
        const isCreateNewEnabled = onCreateNew && searchTerm;

        if (!isCreateNewEnabled) {
            return null;
        }

        return (
            <SelectBox_Option_SingleLine
                option={{label: `${createNewLabel} "${searchTerm}"`, icon: 'plus-circle'}}
                key={'___createNew'}
                isHighlighted={isHighlighted}
                onClick={this.handleCreateNew}
                onMouseEnter={this.handleMouseEnter}
                />
        );
    }
}

export default SelectBox_CreateNew;
