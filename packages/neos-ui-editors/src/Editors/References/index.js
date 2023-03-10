import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import MultiSelectBox from '@neos-project/react-ui-components/src/MultiSelectBox/';
import createNew from '../Reference/createNew';
import dataLoader from '../Reference/referenceDataLoader';
import NodeOption from '../../Library/NodeOption';
import {dndTypes} from '@neos-project/neos-ui-constants';
import {neos} from '@neos-project/neos-ui-decorators';
import {connect} from 'react-redux';
import {actions} from '@neos-project/neos-ui-redux-store';

import {sanitizeOptions} from '../../Library';

@connect((state) => ({
    creationDialogIsOpen: state?.ui?.nodeCreationDialog?.isOpen,
    changesInInspector: state?.ui?.inspector?.valuesByNodePath
}), {
    setActiveContentCanvasSrc: actions.UI.ContentCanvas.setSrc
})
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
        disabled: PropTypes.bool,
        creationDialogIsOpen: PropTypes.bool,
        changesInInspector: PropTypes.object,
        setActiveContentCanvasSrc: PropTypes.func.isRequired
    };

    handleValueChange = value => {
        this.props.commit(value);
    }

    handleClick = option => {
        const {creationDialogIsOpen, changesInInspector, setActiveContentCanvasSrc} = this.props;

        if (setActiveContentCanvasSrc && option && option.uri && !creationDialogIsOpen && !Object.keys(changesInInspector).length) {
            setActiveContentCanvasSrc(option.uri);
        }
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
            options={sanitizeOptions(options)}
            values={value}
            onValuesChange={this.handleValueChange}
            onItemClick={this.handleClick}
            displayLoadingIndicator={displayLoadingIndicator}
            showDropDownToggle={false}
            allowEmpty={true}
            searchOptions={sanitizeOptions(searchOptions)}
            onSearchTermChange={onSearchTermChange}
            onCreateNew={onCreateNew}
            disabled={disabled}
        />);
    }
}
