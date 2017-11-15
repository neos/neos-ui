import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import SelectBox from '@neos-project/react-ui-components/src/SelectBox/';
import dataLoader from './referenceDataLoader';
import ReferenceOption from './ReferenceOption';

@dataLoader(false)
export default class ReferenceEditor extends PureComponent {
    static propTypes = {
        value: PropTypes.string,
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
        return (<SelectBox
            optionValueField="identifier"
            displaySearchBox={true}
            optionComponent={ReferenceOption}
            options={this.props.options}
            value={this.props.value}
            highlight={this.props.highlight}
            onValueChange={this.handleValueChange}
            placeholder={this.props.placeholder}
            displayLoadingIndicator={this.props.displayLoadingIndicator}
            searchTerm={this.props.searchTerm}
            onSearchTermChange={this.props.onSearchTermChange}
            />);
    }
}
