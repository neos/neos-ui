import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import Button from '@neos-project/react-ui-components/src/Button/';
import Icon from '@neos-project/react-ui-components/src/Icon/';
import DropDown from '@neos-project/react-ui-components/src/DropDown/';
import SelectBox from '@neos-project/react-ui-components/src/SelectBox/';
import style from './style.css';
import backend from '@neos-project/neos-ui-backend-connector';
import {$get, $transform} from 'plow-js';
import {mapObjIndexed} from 'ramda';
import {Map} from 'immutable';
import {selectors, actions} from '@neos-project/neos-ui-redux-store';
import I18n from '@neos-project/neos-ui-i18n';
import sortBy from 'lodash.sortby';

// TODO Add title prop to Icon component
const SelectedPreset = props => {
    const {icon, dimensionLabel, presetLabel, dimensionName} = props;
    return (
        <span key={dimensionName} className={style.selectPreset}>
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
    const {icon, dimensionLabel, presets, dimensionName, activePreset, onSelect, isLoading} = props;

    const presetOptions = mapObjIndexed(
        (presetConfiguration, presetName) => {
            return $transform({
                label: $get('label'),
                value: presetName,
                disabled: $get('disabled')
            }, presetConfiguration);
        },
        presets
    );

    const sortedPresetOptions = sortBy(presetOptions, ['label']);

    const onPresetSelect = presetName => {
        onSelect(dimensionName, presetName);
    };

    return (
        <li key={dimensionName} className={style.dimensionCategory}>
            <div className={style.dimensionLabel}>
                <Icon icon={icon} padded="right" className={style.dimensionCategory__icon}/>
                <I18n id={dimensionLabel}/>
            </div>
            <SelectBox
                displayLoadingIndicator={isLoading}
                options={sortedPresetOptions}
                onValueChange={onPresetSelect}
                value={activePreset}
                />
        </li>
    );
};
DimensionSelector.propTypes = {
    icon: PropTypes.string.isRequired,
    dimensionLabel: PropTypes.string.isRequired,
    presets: PropTypes.object.isRequired,
    activePreset: PropTypes.string.isRequired,
    dimensionName: PropTypes.string.isRequired,
    isLoading: PropTypes.bool,
    onSelect: PropTypes.func.isRequired
};

@connect($transform({
    contentDimensions: selectors.CR.ContentDimensions.byName,
    allowedPresets: selectors.CR.ContentDimensions.allowedPresets,
    activePresets: selectors.CR.ContentDimensions.activePresets
}), {
    selectPreset: actions.CR.ContentDimensions.selectPreset,
    setAllowed: actions.CR.ContentDimensions.setAllowed
})
export default class DimensionSwitcher extends PureComponent {
    static propTypes = {
        contentDimensions: PropTypes.object.isRequired,
        activePresets: PropTypes.object.isRequired,
        allowedPresets: PropTypes.object.isRequired,
        selectPreset: PropTypes.func.isRequired,
        setAllowed: PropTypes.func.isRequired
    };

    static defaultProps = {
        contentDimensions: new Map(),
        allowedPresets: new Map(),
        activePresets: new Map()
    };

    state = {
        isOpen: false,
        transientPresets: {},
        loadingPresets: {}
    };

    //
    // Merge active presets comming from redux with local transientPresets state (i.e. presents selected, but not yet applied)
    //
    getEffectivePresets = () => {
        const activePresets = mapObjIndexed(dimensionPreset => dimensionPreset.name, this.props.activePresets);
        return Object.assign({}, activePresets, this.state.transientPresets);
    };

    handleSelectPreset = (selectedDimensionName, presetName) => {
        // If only one dimension commit right away; else store in the transient state
        if (Object.keys(this.props.contentDimensions).length === 1) {
            this.setState({isOpen: false});
            this.props.selectPreset({[selectedDimensionName]: presetName});
        } else {
            const {contentDimensions} = backend.get().endpoints;
            const transientPresets = {
                ...this.state.transientPresets,
                [selectedDimensionName]: presetName
            };
            // First we update transientPresets in state, and only then we can get relevant effectivePresets
            this.setState({
                transientPresets
            }, () => {
                const effectivePresets = this.getEffectivePresets();
                Object.keys(effectivePresets).forEach(dimensionName => {
                    // No need to update constraints for just chosen dimension
                    if (dimensionName !== selectedDimensionName) {
                        // For each other dimension update constraints
                        this.setState({loadingPresets: {[dimensionName]: true}});
                        // Query backend API for updated constraints
                        contentDimensions(dimensionName, effectivePresets).then(dimensionConfig => {
                            const allowedPresets = Object.keys($get([dimensionName, 'presets'], dimensionConfig));
                            this.props.setAllowed(dimensionName, allowedPresets);
                            this.setState({loadingPresets: {[dimensionName]: false}});
                        });
                    }
                });
            });
        }
    }

    handleApplyPresets = () => {
        this.props.selectPreset(this.state.transientPresets);
        this.setState({isOpen: false, transientPresets: {}});
    }

    handleToggle = () => {
        this.setState({isOpen: !this.state.isOpen});
    }

    handleClose = () => {
        this.setState({isOpen: false});
    }

    render() {
        const {contentDimensions, activePresets} = this.props;
        const contentDimensionsObject = contentDimensions;
        const contentDimensionsObjectKeys = Object.keys(contentDimensionsObject);

        return contentDimensionsObjectKeys.length ? (
            <DropDown.Stateless
                style="darker"
                padded={true}
                className={style.dropDown}
                isOpen={this.state.isOpen}
                onToggle={this.handleToggle}
                onClose={this.handleClose}
                >
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
                        // First look for active preset in transient state, else take it from activePresets prop
                        const activePreset = this.getEffectivePresets()[dimensionName];
                        return (<DimensionSelector
                            isLoading={this.state.loadingPresets[dimensionName]}
                            key={dimensionName}
                            dimensionName={dimensionName}
                            icon={icon}
                            dimensionLabel={$get('label', dimensionConfiguration)}
                            presets={this.presetsForDimension(dimensionName)}
                            activePreset={activePreset}
                            onSelect={this.handleSelectPreset}
                            />
                        );
                    })}
                    {Object.keys(contentDimensions).length > 1 && <div className={style.buttonGroup}>
                        <Button
                            onClick={this.handleClose}
                            style="lighter"
                            className={style.cancelButton}
                            >
                            <I18n id="Neos.Neos:Main:cancel" fallback="Cancel"/>
                        </Button>
                        <Button
                            onClick={this.handleApplyPresets}
                            style="brand"
                            >
                            <I18n id="Neos.Neos:Main:apply" fallback="Apply"/>
                        </Button>
                    </div>}
                </DropDown.Contents>
            </DropDown.Stateless>
        ) : null;
    }

    presetsForDimension(dimensionName) {
        const {contentDimensions, allowedPresets} = this.props;
        const dimensionConfiguration = $get(dimensionName, contentDimensions);

        return mapObjIndexed((presetConfiguration, presetName) => {
            return Object.assign({}, presetConfiguration, {
                disabled: !(allowedPresets[dimensionName] && allowedPresets[dimensionName].includes(presetName))
            });
        }, dimensionConfiguration.presets);
    }
}
