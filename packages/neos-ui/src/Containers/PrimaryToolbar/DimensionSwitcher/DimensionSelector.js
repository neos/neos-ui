import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import SelectBox from '@neos-project/react-ui-components/src/SelectBox/';
import style from './style.module.css';

import mapValues from 'lodash.mapvalues';
import sortBy from 'lodash.sortby';
import {translate} from '@neos-project/neos-ui-i18n';
import DimensionSelectorOption from './DimensionSelectorOption';

const searchOptions = (searchTerm, processedSelectBoxOptions) =>
    processedSelectBoxOptions.filter(option => option.label && option.label.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1);

export default class DimensionSelector extends PureComponent {
    static propTypes = {
        icon: PropTypes.string,
        dimensionLabel: PropTypes.string.isRequired,
        presets: PropTypes.object.isRequired,
        activePreset: PropTypes.string.isRequired,
        dimensionName: PropTypes.string.isRequired,
        isLoading: PropTypes.bool,
        onSelect: PropTypes.func.isRequired,
        showDropDownHeaderIcon: PropTypes.bool
    };

    state = {
        searchTerm: ''
    };

    render() {
        const {
            activePreset,
            isLoading,
            dimensionName,
            onSelect,
            presets,
            showDropDownHeaderIcon
        } = this.props;

        const presetOptions = mapValues(
            presets,
            (presetConfiguration, presetName) => {
                return {
                    label: presetConfiguration?.label,
                    value: presetName,
                    disallowed: presetConfiguration?.disallowed,
                    covered: presetConfiguration?.covered,
                    group: presetConfiguration?.group,
                    url: presetConfiguration?.url
                };
            }
        );

        const sortedPresetOptions = sortBy(presetOptions, ['group', 'label']);

        const onPresetSelect = presetName => {
            onSelect(dimensionName, presetName);
        };

        return (
            <SelectBox
                displayLoadingIndicator={isLoading}
                options={this.state.searchTerm ? searchOptions(this.state.searchTerm, sortedPresetOptions) : sortedPresetOptions}
                onValueChange={onPresetSelect}
                value={activePreset}
                allowEmpty={false}
                headerIcon={showDropDownHeaderIcon ? this.props.icon : null}
                displaySearchBox={false} // TODO reenable `sortedPresetOptions.length >= 10` but see https://github.com/neos/neos-ui/issues/3495
                searchOptions={searchOptions(this.state.searchTerm, sortedPresetOptions)}
                onSearchTermChange={this.handleSearchTermChange}
                noMatchesFoundLabel={translate('Neos.Neos.Ui:Main:noMatchesFound')}
                searchBoxLeftToTypeLabel={translate('Neos.Neos.Ui:Main:searchBoxLeftToType')}
                threshold={0}
                ListPreviewElement={DimensionSelectorOption}
                className={style.dimensionSwitcherDropDown}
            />
        )
    }

    handleSearchTermChange = searchTerm => {
        this.setState({searchTerm});
    }
}
