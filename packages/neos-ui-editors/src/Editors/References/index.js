import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import MultiSelectBox from '@neos-project/react-ui-components/src/MultiSelectBox/';
import createNew from '../Reference/createNew';
import dataLoader from '../Reference/referenceDataLoader';
import ReferenceOption from '../Reference/ReferenceOption';
import {dndTypes} from '@neos-project/neos-ui-constants';
import {neos} from '@neos-project/neos-ui-decorators';

@neos(globalRegistry => ({
    i18nRegistry: globalRegistry.get('i18n')
}))
@createNew()
@dataLoader({isMulti: true})
export default class ReferencesEditor extends PureComponent {
    static propTypes = {
        value: PropTypes.arrayOf(PropTypes.string),
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
        return (<MultiSelectBox
            dndType={dndTypes.MULTISELECT}
            optionValueField="identifier"
            loadingLabel={this.props.i18nRegistry.translate('Neos.Neos:Main:loading')}
            displaySearchBox={true}
            optionComponent={ReferenceOption}
            createNewLabel={this.props.i18nRegistry.translate('Neos.Neos.Ui:Main:createNew')}
            noMatchesLabel={this.props.i18nRegistry.translate('Neos.Neos.Ui:Main:noMatchesLabel')}
            placeholder={this.props.i18nRegistry.translate(this.props.placeholder)}
            options={this.props.options}
            values={this.props.value}
            highlight={this.props.highlight}
            onValuesChange={this.handleValueChange}
            displayLoadingIndicator={this.props.displayLoadingIndicator}
            searchTerm={this.props.searchTerm}
            searchOptions={this.props.searchOptions}
            onSearchTermChange={this.props.onSearchTermChange}
            onCreateNew={this.props.onCreateNew}
            />);
    }
}
