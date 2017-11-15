import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import MultiSelectBox from '@neos-project/react-ui-components/src/MultiSelectBox/';
import dataLoader from '../Reference/referenceDataLoader';
import ReferenceOption from '../Reference/ReferenceOption';
import {dndTypes} from '@neos-project/neos-ui-constants';

@dataLoader(true)
export default class ReferencesEditor extends PureComponent {
    static propTypes = {
        value: PropTypes.arrayOf(PropTypes.string),
        options: PropTypes.array,
        searchOptions: PropTypes.array,
        isLoading: PropTypes.bool,
        highlight: PropTypes.bool,
        placeholder: PropTypes.string,
        displayLoadingIndicator: PropTypes.bool,
        searchTerm: PropTypes.string,
        onSearchTermChange: PropTypes.func,
        commit: PropTypes.func.isRequired
    };

    handleValueChange = value => {
        this.props.commit(value);
    }

    render() {
        return (<MultiSelectBox
            dndType={dndTypes.MULTISELECT}
            optionValueField="identifier"
            displaySearchBox={true}
            optionComponent={ReferenceOption}
            options={this.props.options}
            values={this.props.value}
            highlight={this.props.highlight}
            onValuesChange={this.handleValueChange}
            placeholder={this.props.placeholder}
            displayLoadingIndicator={this.props.displayLoadingIndicator}
            searchTerm={this.props.searchTerm}
            searchOptions={this.props.searchOptions}
            onSearchTermChange={this.props.onSearchTermChange}
            />);
    }
}
