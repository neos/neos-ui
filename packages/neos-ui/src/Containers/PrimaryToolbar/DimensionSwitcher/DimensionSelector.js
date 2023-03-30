import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import Icon from '@neos-project/react-ui-components/src/Icon/';
import SelectBox from '@neos-project/react-ui-components/src/SelectBox/';
import style from './style.module.css';
import {$get, $transform} from 'plow-js';
import mapValues from 'lodash.mapvalues';
import I18n from '@neos-project/neos-ui-i18n';
import sortBy from 'lodash.sortby';
import {neos} from '@neos-project/neos-ui-decorators';
import DimensionSelectorOption from './DimensionSelectorOption';

const searchOptions = (searchTerm, processedSelectBoxOptions) =>
    processedSelectBoxOptions.filter(option => option.label && option.label.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1);

@neos(globalRegistry => ({
    i18nRegistry: globalRegistry.get('i18n')
}))
export default class DimensionSelector extends PureComponent {
    static propTypes = {
        icon: PropTypes.string.isRequired,
        dimensionLabel: PropTypes.string.isRequired,
        presets: PropTypes.object.isRequired,
        activePreset: PropTypes.string.isRequired,
        dimensionName: PropTypes.string.isRequired,
        isLoading: PropTypes.bool,
        onSelect: PropTypes.func.isRequired,
        showOnlyDimensionDropdown: PropTypes.bool,

        i18nRegistry: PropTypes.object.isRequired
    };

    state = {
        searchTerm: ''
    };

    renderDimensionDropdown = () => {
        const {
            activePreset,
            isLoading,
            i18nRegistry,
            dimensionName,
            onSelect,
            presets
        } = this.props;

        const presetOptions = mapValues(
            presets,
            (presetConfiguration, presetName) => {
                return $transform(
                    {
                        label: $get('label'),
                        value: presetName,
                        disallowed: $get('disallowed')
                    },
                    presetConfiguration
                );
            }
        );

        const sortedPresetOptions = sortBy(presetOptions, ['label']);

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
                headerIcon={this.props.icon}
                displaySearchBox={sortedPresetOptions.length >= 10}
                searchOptions={searchOptions(this.state.searchTerm, sortedPresetOptions)}
                onSearchTermChange={this.handleSearchTermChange}
                noMatchesFoundLabel={i18nRegistry.translate('Neos.Neos:Main:noMatchesFound')}
                searchBoxLeftToTypeLabel={i18nRegistry.translate('Neos.Neos:Main:searchBoxLeftToType')}
                threshold={0}
                ListPreviewElement={DimensionSelectorOption}
                className={style.dimensionSwitcherDropDown}
            />
        )
    }

    render() {
        const {
            icon,
            dimensionLabel,
            dimensionName,
            showOnlyDimensionDropdown
        } = this.props;

        const dimensionDropdown = this.renderDimensionDropdown();

        return showOnlyDimensionDropdown === true ? dimensionDropdown : (
            <li key={dimensionName} className={style.dimensionCategory}>
                <div className={style.dimensionLabel}>
                    <Icon icon={icon} padded="right" className={style.dimensionCategory__icon}/>
                    <I18n id={dimensionLabel}/>
                </div>
                {dimensionDropdown}
            </li>
        );
    }

    handleSearchTermChange = searchTerm => {
        this.setState({searchTerm});
    }
}
