import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Button, Icon, DropDown} from '@neos-project/react-ui-components';
import style from './style.module.css';
import backend from '@neos-project/neos-ui-backend-connector';
import {$get, $transform} from 'plow-js';
import mapValues from 'lodash.mapvalues';
import {selectors, actions} from '@neos-project/neos-ui-redux-store';
import I18n from '@neos-project/neos-ui-i18n';
import {neos} from '@neos-project/neos-ui-decorators';
import DimensionSelector from './DimensionSelector';

// TODO Add title prop to Icon component
const SelectedPreset = props => {
    const {icon, dimensionLabel, presetLabel, dimensionName} = props;
    return (
        <span key={dimensionName} className={style.selectPreset}>
            <Icon className={style.dropDown__btnIcon} icon={icon} title={dimensionLabel}/>
            <span className={style.selectPresetLabel}>{presetLabel}</span>
        </span>
    );
};
SelectedPreset.propTypes = {
    icon: PropTypes.string.isRequired,
    dimensionLabel: PropTypes.string.isRequired,
    presetLabel: PropTypes.string.isRequired,
    dimensionName: PropTypes.string.isRequired
};

@connect($transform({
    contentDimensions: selectors.CR.ContentDimensions.byName,
    allowedPresets: selectors.CR.ContentDimensions.allowedPresets,
    activePresets: selectors.CR.ContentDimensions.activePresets,
    getNodeByContextPath: selectors.CR.Nodes.nodeByContextPath,
    documentNode: selectors.CR.Nodes.documentNodeSelector
}), {
    selectPreset: actions.CR.ContentDimensions.selectPreset,
    setAllowed: actions.CR.ContentDimensions.setAllowed
})
@neos(globalRegistry => ({
    i18nRegistry: globalRegistry.get('i18n')
}))
export default class DimensionSwitcher extends PureComponent {
    static propTypes = {
        contentDimensions: PropTypes.oneOfType([PropTypes.object, PropTypes.array]).isRequired,
        activePresets: PropTypes.object.isRequired,
        allowedPresets: PropTypes.object.isRequired,
        selectPreset: PropTypes.func.isRequired,
        getNodeByContextPath: PropTypes.func.isRequired,
        documentNode: PropTypes.object.isRequired,
        setAllowed: PropTypes.func.isRequired,

        i18nRegistry: PropTypes.object.isRequired
    };

    static defaultProps = {
        contentDimensions: {},
        allowedPresets: {},
        activePresets: {}
    };

    state = {
        isOpen: false,
        transientPresets: {},
        loadingPresets: {}
    };

    componentDidMount() {
        const activePresets = mapValues(
            this.props.activePresets,
            dimensionPreset => dimensionPreset.name
        );
        this.setState({
            transientPresets: activePresets
        });
    }

    getDimensionIcon = (dimensionName, contentDimensionsObject) => {
        const dimensionConfiguration = contentDimensionsObject[dimensionName];
        return dimensionConfiguration?.icon || null;
    }

    //
    // Merge active presets comming from redux with local transientPresets state (i.e. presents selected, but not yet applied)
    //
    getEffectivePresets = transientPresets => {
        const activePresets = mapValues(
            this.props.activePresets,
            dimensionPreset => dimensionPreset.name
        );
        return Object.assign(
            {},
            activePresets,
            transientPresets
        );
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

            const effectivePresets = this.getEffectivePresets(transientPresets);
            Object.keys(effectivePresets).forEach(dimensionName => {
                // No need to update constraints for just chosen dimension, we'll do it later
                if (dimensionName !== selectedDimensionName) {
                    // For each other dimension update constraints
                    this.setState({
                        loadingPresets: {[dimensionName]: true}
                    });
                    // Query backend API for updated constraints
                    contentDimensions(dimensionName, effectivePresets).then(
                        dimensionConfig => {
                            const allowedPresets = Object.keys(
                                $get([dimensionName, 'presets'], dimensionConfig)
                            );
                            this.props.setAllowed(dimensionName, allowedPresets);

                            if (
                                !allowedPresets.includes(effectivePresets[dimensionName]) && // dimension preset is not among allowed
                                allowedPresets[0] // and there is at least one allowed preset
                            ) {
                                // switch dimension to the first allowed preset
                                transientPresets[dimensionName] = allowedPresets[0];
                            }
                            this.setState({
                                transientPresets,
                                loadingPresets: {
                                    [dimensionName]: false
                                }
                            });

                            // If current dimension is not among allowed, re-fetch it
                            if (!this.props.allowedPresets[selectedDimensionName].includes(presetName)) {
                                contentDimensions(selectedDimensionName, this.getEffectivePresets(transientPresets)).then(
                                    dimensionConfig => {
                                        const allowedPresets = Object.keys($get([selectedDimensionName, 'presets'], dimensionConfig));
                                        this.props.setAllowed(selectedDimensionName, allowedPresets);
                                    }
                                );
                            }
                        }
                    );
                }
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

    createDirectDimensionsLink = (dimensionName, presetName) => {
        const {documentNode} = this.props;

        const nodeContextPath = documentNode.properties._path + ';' + dimensionName + '=' + presetName
        const uri = new URL(window.location.href);
        uri.searchParams.set('node', nodeContextPath);
        return uri.toString();
    }

    renderSingleDimensionSelector = (dimensionName, contentDimensionsObject) => {
        const dimensionConfiguration = contentDimensionsObject[dimensionName];
        const icon = this.getDimensionIcon(dimensionName, contentDimensionsObject);
        // First look for active preset in transient state, else take it from activePresets prop
        const activePreset = this.getEffectivePresets(this.state.transientPresets)[dimensionName];

        return (
            <DimensionSelector
                isLoading={this.state.loadingPresets[dimensionName]}
                key={dimensionName}
                dimensionName={dimensionName}
                icon={icon}
                dimensionLabel={$get('label', dimensionConfiguration)}
                presets={this.presetsForDimension(dimensionName)}
                activePreset={activePreset}
                onSelect={this.handleSelectPreset}
                showDropDownHeaderIcon={Object.keys(contentDimensionsObject).length === 1}
            />
        );
    }

    render() {
        const {contentDimensions, activePresets, i18nRegistry} = this.props;
        const contentDimensionsObject = contentDimensions;
        const contentDimensionsObjectKeys = Object.keys(contentDimensionsObject);

        if (contentDimensionsObjectKeys.length === 1) {
            const dimensionName = contentDimensionsObjectKeys[0];
            return (
                <div className={style.singleDimensionDropdown}>
                    {this.renderSingleDimensionSelector(dimensionName, contentDimensionsObject)}
                </div>
            )
        }

        if (contentDimensionsObjectKeys.length > 1) {
            return (
                <DropDown.Stateless
                    style="darkest"
                    padded={true}
                    className={style.dropDown}
                    isOpen={this.state.isOpen}
                    onToggle={this.handleToggle}
                    onClose={this.handleClose}
                >
                    <DropDown.Header
                        className={style.dropDown__header}
                    >
                        {contentDimensionsObjectKeys.map(dimensionName => {
                            const dimensionConfiguration = contentDimensionsObject[dimensionName];
                            const icon = this.getDimensionIcon(dimensionName, contentDimensionsObject);
                            return (
                                <SelectedPreset
                                    key={dimensionName}
                                    dimensionName={dimensionName}
                                    icon={icon}
                                    dimensionLabel={i18nRegistry.translate($get('label', dimensionConfiguration))}
                                    presetLabel={i18nRegistry.translate($get([dimensionName, 'label'], activePresets))}
                                />
                            );
                        })}
                    </DropDown.Header>
                    <DropDown.Contents className={style.dropDown__contents}>
                        {contentDimensionsObjectKeys.map(dimensionName => {
                            const dimensionConfiguration = contentDimensionsObject[dimensionName];
                            const icon = this.getDimensionIcon(dimensionName, contentDimensionsObject);
                            return (
                                <li key={dimensionName} className={style.dimensionCategory}>
                                    <div className={style.dimensionLabel}>
                                        <Icon icon={icon} padded="right" className={style.dimensionCategory__icon}/>
                                        <I18n id={$get('label', dimensionConfiguration)}/>
                                    </div>
                                    {this.renderSingleDimensionSelector(dimensionName, contentDimensionsObject)}
                                </li>
                            )
                        })}
                        {Object.keys(contentDimensions).length > 1 && <div className={style.buttonGroup}>
                            <Button
                                id="neos-DimensionSwitcher-Cancel"
                                onClick={this.handleClose}
                                style="lighter"
                                className={style.cancelButton}
                            >
                                <I18n id="Neos.Neos:Main:cancel" fallback="Cancel"/>
                            </Button>
                            <Button
                                id="neos-DimensionSwitcher-Apply"
                                onClick={this.handleApplyPresets}
                                style="brand"
                            >
                                <I18n id="Neos.Neos:Main:apply" fallback="Apply"/>
                            </Button>
                        </div>}
                    </DropDown.Contents>
                </DropDown.Stateless>
            )
        }

        return null;
    }

    getDocumentDimensions(dimensionName) {
        const {getNodeByContextPath, documentNode, allowedPresets, contentDimensions} = this.props;
        const currentDocumentNode = getNodeByContextPath(documentNode.contextPath)
        if (!currentDocumentNode.dimensions || currentDocumentNode.length === 0) {
            return allowedPresets[dimensionName]
        }

        const variants = [...currentDocumentNode.otherNodeVariants];
        variants.push(currentDocumentNode.dimensions)

        for (const dimensionKey of Object.keys(contentDimensions)) {
            if (dimensionKey === dimensionName || Object.keys(contentDimensions).length === 1) {
                break;
            }
            Object.entries(variants).forEach(entry => {
                const [key, value] = entry;
                if (value[dimensionKey] !== this.state.transientPresets[dimensionKey]) {
                    delete variants[key]
                }
            });
        }
        const dimensions = []
        Object.values(variants).forEach(entry => {
            dimensions.push(entry[dimensionName]);
        });

        return dimensions;
    }

    presetsForDimension(dimensionName) {
        const {contentDimensions, allowedPresets, i18nRegistry} = this.props;
        const dimensionConfiguration = $get(dimensionName, contentDimensions);
        const documentDimensions = this.getDocumentDimensions(dimensionName);
        return mapValues(dimensionConfiguration.presets,
            (presetConfiguration, presetName) => {
                return Object.assign({}, presetConfiguration, {
                    label: i18nRegistry.translate(presetConfiguration.label),
                    disallowed: !(allowedPresets[dimensionName] && allowedPresets[dimensionName].includes(presetName)),
                    covered: documentDimensions.some(dimension => presetConfiguration.values.includes(dimension)),
                    url: (Object.keys(contentDimensions).length === 1) ? this.createDirectDimensionsLink(dimensionName, presetName) : null
                });
            });
    }
}
