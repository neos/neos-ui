import React, {Component, PropTypes} from 'react';
import shallowCompare from 'react-addons-shallow-compare';
import {connect} from 'react-redux';
import Icon from '@neos-project/react-ui-components/lib/Icon/';
import DropDown from '@neos-project/react-ui-components/lib/DropDown/';
import SelectBox from '@neos-project/react-ui-components/lib/SelectBox/';
import style from './style.css';
import {$map, $get, $transform} from 'plow-js';
import {Map} from 'immutable';
import {selectors, actions} from 'Host/Redux/index';
import I18n from 'Host/Containers/I18n/';

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
        onSelect(dimensionName, presetName);
    };

    return (
        <li key={dimensionName} className={style.dimensionCategory}>
            <Icon icon={icon} padded="right" className={style.dimensionCategory__icon}/>
            <I18n id={dimensionLabel}/>
            <br/>
            <SelectBox options={presetOptions} onSelect={onPresetSelect} value={activePreset}/>
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
export default class DimensionSwitcher extends Component {
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

    shouldComponentUpdate(...args) {
        return shallowCompare(this, ...args);
    }

    render() {
        const {contentDimensions, activePresets, selectPreset} = this.props;

        return (
            <DropDown className={style.dropDown}>
                <DropDown.Header className={style.dropDown__btn}>
                    {contentDimensions.map((dimensionConfiguration, dimensionName) =>
                        <SelectedPreset
                            key={dimensionName}
                            dimensionName={dimensionName}
                            icon={$get('icon', dimensionConfiguration)}
                            dimensionLabel={$get('label', dimensionConfiguration)}
                            presetLabel={$get([dimensionName, 'label'], activePresets)}
                            />
                    )}
                </DropDown.Header>
                <DropDown.Contents className={style.dropDown__contents}>
                    {contentDimensions.map((dimensionConfiguration, dimensionName) =>
                        <DimensionSelector
                            key={dimensionName}
                            dimensionName={dimensionName}
                            icon={$get('icon', dimensionConfiguration)}
                            dimensionLabel={$get('label', dimensionConfiguration)}
                            presets={this.presetsForDimension(dimensionName)}
                            activePreset={$get([dimensionName, 'name'], activePresets)}
                            onSelect={selectPreset}
                            />
                    )}
                </DropDown.Contents>
            </DropDown>
        );
    }

    presetsForDimension(dimensionName) {
        const {contentDimensions, allowedPresets} = this.props;
        const dimensionConfiguration = $get(dimensionName, contentDimensions);

        return dimensionConfiguration.get('presets').filter(
            (presetConfiguration, presetName) => allowedPresets.get(dimensionName).contains(presetName)
        );
    }
}
