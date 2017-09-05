import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import Icon from '@neos-project/react-ui-components/src/Icon/';
import DropDown from '@neos-project/react-ui-components/src/DropDown/';
import SelectBox from '@neos-project/react-ui-components/src/SelectBox/';
import style from './style.css';
import {$map, $get, $transform} from 'plow-js';
import {Map} from 'immutable';
import {selectors, actions} from '@neos-project/neos-ui-redux-store';
import I18n from '@neos-project/neos-ui-i18n';

// TODO Add title prop to Icon component
const SelectedPreset = props => {
    const {icon, dimensionLabel, presetLabel, dimensionName} = props;
    return (
        <span key={dimensionName}>
            <Icon className={style.dropDown__btnIcon} icon={icon} title={dimensionLabel}/>
            {presetLabel}
        </span>
    );
};
SelectedPreset.propTypes = {
    icon: PropTypes.string.isRequired,
    dimensionLabel: PropTypes.string.isRequired,
    presetLabel: PropTypes.string.isRequired,
    dimensionName: PropTypes.string.isRequired
};

const DimensionSelector = props => {
    const {icon, dimensionLabel, presets, dimensionName, activePreset, onSelect} = props;

    const presetOptions = $map(
        (presetConfiguration, presetName) => $transform({label: $get('label'), value: presetName}, presetConfiguration),
        [],
        presets
    ).toArray();

    const onPresetSelect = presetName => {
        onSelect(dimensionName, presetName, activePreset);
    };

    return (
        <li key={dimensionName} className={style.dimensionCategory}>
            <Icon icon={icon} padded="right" className={style.dimensionCategory__icon}/>
            <I18n id={dimensionLabel}/>
            <br/>
            <SelectBox options={presetOptions} onValueChange={onPresetSelect} value={activePreset}/>
        </li>
    );
};
DimensionSelector.propTypes = {
    icon: PropTypes.string.isRequired,
    dimensionLabel: PropTypes.string.isRequired,
    presets: PropTypes.object.isRequired,
    activePreset: PropTypes.string.isRequired,
    dimensionName: PropTypes.string.isRequired,
    onSelect: PropTypes.func.isRequired
};

@connect($transform({
    contentDimensions: selectors.CR.ContentDimensions.byName,
    allowedPresets: selectors.CR.ContentDimensions.allowedPresets,
    activePresets: selectors.CR.ContentDimensions.activePresets
}), {
    selectPreset: actions.CR.ContentDimensions.selectPreset
})
export default class DimensionSwitcher extends PureComponent {
    static propTypes = {
        contentDimensions: PropTypes.object.isRequired,
        activePresets: PropTypes.object.isRequired,
        allowedPresets: PropTypes.object.isRequired,
        selectPreset: PropTypes.func.isRequired
    };

    static defaultProps = {
        contentDimensions: new Map(),
        allowedPresets: new Map(),
        activePresets: new Map()
    };

    render() {
        const {contentDimensions, activePresets, selectPreset} = this.props;
        const contentDimensionsObject = contentDimensions.toObject();
        const contentDimensionsObjectKeys = Object.keys(contentDimensionsObject);

        return contentDimensionsObjectKeys.lenght ? (
            <DropDown style="darker" padded={true} className={style.dropDown}>
                <DropDown.Header>
                    {contentDimensionsObjectKeys.map(dimensionName => {
                        const dimensionConfiguration = contentDimensionsObject[dimensionName];
                        const icon = $get('icon', dimensionConfiguration) && $get('icon', dimensionConfiguration);
                        return (<SelectedPreset
                            key={dimensionName}
                            dimensionName={dimensionName}
                            icon={icon}
                            dimensionLabel={$get('label', dimensionConfiguration)}
                            presetLabel={$get([dimensionName, 'label'], activePresets)}
                            />
                        );
                    })}
                </DropDown.Header>
                <DropDown.Contents>
                    {contentDimensionsObjectKeys.map(dimensionName => {
                        const dimensionConfiguration = contentDimensionsObject[dimensionName];
                        const icon = $get('icon', dimensionConfiguration) && $get('icon', dimensionConfiguration);
                        return (<DimensionSelector
                            key={dimensionName}
                            dimensionName={dimensionName}
                            icon={icon}
                            dimensionLabel={$get('label', dimensionConfiguration)}
                            presets={this.presetsForDimension(dimensionName)}
                            activePreset={$get([dimensionName, 'name'], activePresets)}
                            onSelect={selectPreset}
                            />
                        );
                    })}
                </DropDown.Contents>
            </DropDown>
        ) : <span />;
    }

    presetsForDimension(dimensionName) {
        const {contentDimensions, allowedPresets} = this.props;
        const dimensionConfiguration = $get(dimensionName, contentDimensions);

        return dimensionConfiguration.get('presets').filter(
            (presetConfiguration, presetName) => allowedPresets.get(dimensionName).contains(presetName)
        );
    }
}
