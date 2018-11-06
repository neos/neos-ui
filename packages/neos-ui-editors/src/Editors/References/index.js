import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import MultiSelectBox from '@neos-project/react-ui-components/src/MultiSelectBox/';
import createNew from '../Reference/createNew';
import dataLoader from '../Reference/referenceDataLoader';
import NodeOption from '../../Library/NodeOption';
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
        placeholder: PropTypes.string,
        displayLoadingIndicator: PropTypes.bool,
        threshold: PropTypes.number,
        onSearchTermChange: PropTypes.func,
        onCreateNew: PropTypes.func,
        commit: PropTypes.func.isRequired,
        i18nRegistry: PropTypes.object.isRequired,
        disabled: PropTypes.bool
    };

    handleValueChange = value => {
        this.props.commit(value);
    }

    render() {
        const {className, i18nRegistry, threshold, placeholder, options, value, displayLoadingIndicator, searchOptions, onSearchTermChange, onCreateNew, disabled} = this.props;

        return (<MultiSelectBox
            className={className}
            dndType={dndTypes.MULTISELECT}
            optionValueField="identifier"
            loadingLabel={i18nRegistry.translate('Neos.Neos:Main:loading')}
            displaySearchBox={true}
            ListPreviewElement={NodeOption}
            createNewLabel={i18nRegistry.translate('Neos.Neos:Main:createNew')}
            placeholder={i18nRegistry.translate(placeholder)}
            threshold={threshold}
            noMatchesFoundLabel={i18nRegistry.translate('Neos.Neos:Main:noMatchesFound')}
            searchBoxLeftToTypeLabel={i18nRegistry.translate('Neos.Neos:Main:searchBoxLeftToType')}
            options={options}
            values={value}
            onValuesChange={this.handleValueChange}
            displayLoadingIndicator={displayLoadingIndicator}
            showDropDownToggle={false}
            allowEmpty={true}
            searchOptions={searchOptions}
            onSearchTermChange={onSearchTermChange}
            onCreateNew={onCreateNew}
            disabled={disabled}
            />);
    }
}
