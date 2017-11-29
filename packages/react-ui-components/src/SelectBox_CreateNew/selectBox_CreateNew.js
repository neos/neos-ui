import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import mergeClassNames from 'classnames';
import DefaultSelectBoxOption from '../SelectBox/defaultSelectBoxOption';

const CREATE_NEW_IS_FOCUSED = 'NEOS_UI_CREATE_NEW_IS_FOCUSED';

export default class SelectBox_CreateNew extends PureComponent {
    static propTypes = {
        searchTerm: PropTypes.string,
        onCreateNew: PropTypes.func.isRequired,
        onSearchTermChange: PropTypes.func.isRequired,
        optionValueField: PropTypes.string.isRequired,
        focusedValue: PropTypes.string,
        createNewLabel: PropTypes.string.isRequired,
    }

    render() {
        const {
            createNewLabel,
            searchTerm,
            focusedValue,
        } = this.props;
        const isHighlighted = focusedValue === CREATE_NEW_IS_FOCUSED;

        return (
            <DefaultSelectBoxOption
                option={{label: `${createNewLabel} "${searchTerm}"`, icon: 'plus-circle'}}
                key={'___createNew'}
                isHighlighted={isHighlighted}
                onClick={this.handleCreateNew}
                onMouseEnter={this.handleMouseEnter}
                />
        );
    }


    handleCreateNew = () => {
        const {
            onCreateNew,
            searchTerm,
            onSearchTermChange
        } = this.props;
        onCreateNew(searchTerm);
        // Clear search box on creating new
        onSearchTermChange('');
    }

    handleMouseEnter = () => {
        const {
            onOptionFocus,
            optionValueField
        } = this.props;

        const selectedOption = {
            [optionValueField]: CREATE_NEW_IS_FOCUSED
        }
        onOptionFocus(selectedOption);
    }

}
