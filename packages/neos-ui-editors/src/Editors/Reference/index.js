import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import SelectBox from '@neos-project/react-ui-components/src/SelectBox/';
import dataLoader from './referenceDataLoader';
import createNew from './createNew';
import ReferenceOption from './ReferenceOption';
import {neos} from '@neos-project/neos-ui-decorators';

@neos(globalRegistry => ({
    i18nRegistry: globalRegistry.get('i18n')
}))
@createNew()
@dataLoader({isMulti: false})
export default class ReferenceEditor extends PureComponent {
    static propTypes = {
        value: PropTypes.string,
        options: PropTypes.array,
        searchOptions: PropTypes.array,
        highlight: PropTypes.bool,
        placeholder: PropTypes.string,
        displayLoadingIndicator: PropTypes.bool,
        searchTerm: PropTypes.string,
        onSearchTermChange: PropTypes.func,
        onCreateNew: PropTypes.func,
        commit: PropTypes.func.isRequired,
        i18nRegistry: PropTypes.object.isRequired
    };

    handleValueChange = value => {
        this.props.commit(value);
    }

    render() {
        return (<SelectBox
            optionValueField="identifier"
            displaySearchBox={true}
            optionComponent={ReferenceOption}
            createNewLabel={this.props.i18nRegistry.translate('Neos.Neos.Ui:Main:createNew')}
            placeholder={this.props.i18nRegistry.translate(this.props.placeholder)}
            options={this.props.options}
            value={this.props.value}
            highlight={this.props.highlight}
            onValueChange={this.handleValueChange}
            loadingLabel={this.props.i18nRegistry.translate('Neos.Neos:Main:loading')}
            displayLoadingIndicator={this.props.displayLoadingIndicator}
            searchTerm={this.props.searchTerm}
            onSearchTermChange={this.props.onSearchTermChange}
            onCreateNew={this.props.onCreateNew}
            />);
    }
}
