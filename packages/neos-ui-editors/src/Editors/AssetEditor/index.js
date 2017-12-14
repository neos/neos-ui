import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import MultiSelectBox from '@neos-project/react-ui-components/src/MultiSelectBox/';
import SelectBox from '@neos-project/react-ui-components/src/SelectBox/';
import AssetOption from '@neos-project/neos-ui-ckeditor-bindings/src/EditorToolbar/AssetOption';
import {dndTypes} from '@neos-project/neos-ui-constants';
import {neos} from '@neos-project/neos-ui-decorators';
import {$get} from 'plow-js';
import Controls from './Components/Controls/index';
import {AssetUpload} from '../../Library/index';

const DEFAULT_FEATURES = {
    mediaBrowser: true,
    upload: true
};

@neos(globalRegistry => ({
    assetLookupDataLoader: globalRegistry.get('dataLoaders').get('AssetLookup'),
    i18nRegistry: globalRegistry.get('i18n'),
    secondaryEditorsRegistry: globalRegistry.get('inspector').get('secondaryEditors')
}))
export default class AssetEditor extends PureComponent {
    state = {
        options: [],
        isLoading: false,
        searchOptions: []
    };

    static propTypes = {
        // The propertyName this editor is used for, coming from the inspector
        identifier: PropTypes.string,

        value: PropTypes.oneOfType([PropTypes.string, PropTypes.object, PropTypes.arrayOf(PropTypes.string)]),
        options: PropTypes.object,
        searchOptions: PropTypes.array,
        highlight: PropTypes.bool,
        placeholder: PropTypes.string,
        onSearchTermChange: PropTypes.func,
        commit: PropTypes.func.isRequired,
        i18nRegistry: PropTypes.object.isRequired,
        assetLookupDataLoader: PropTypes.shape({
            resolveValue: PropTypes.func.isRequired,
            resolveValues: PropTypes.func.isRequired,
            search: PropTypes.func.isRequired
        }).isRequired,
        secondaryEditorsRegistry: PropTypes.object.isRequired,
        renderSecondaryInspector: PropTypes.func.isRequired,
        imagesOnly: PropTypes.bool
    };

    static defaultProps = {
        identifier: ''
    };

    componentDidMount() {
        this.resolveValue();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.value !== this.props.value) {
            this.resolveValue();
        }
    }

    getValue() {
        const value = this.props.value;
        if (value && value.__identity) {
            // Needed to handle Image assets
            return value.__identity;
        }
        return value;
    }

    resolveValue = () => {
        if (this.props.value) {
            this.setState({isLoading: true});
            const resolver = this.props.options.multiple ? this.props.assetLookupDataLoader.resolveValues.bind(this.props.assetLookupDataLoader) : this.props.assetLookupDataLoader.resolveValue.bind(this.props.assetLookupDataLoader);
            resolver({}, this.getValue())
                .then(options => {
                    this.setState({
                        isLoading: false,
                        options
                    });
                });
        }
    }

    isFeatureEnabled(featureName) {
        const features = Object.assign({}, DEFAULT_FEATURES, this.props.options.features);
        return features[featureName];
    }

    handleSearchTermChange = searchTerm => {
        if (searchTerm) {
            this.setState({isLoading: true, searchOptions: []});
            this.props.assetLookupDataLoader.search({}, searchTerm)
                .then(searchOptions => {
                    this.setState({
                        isLoading: false,
                        searchOptions
                    });
                });
        } else {
            this.setState({
                isLoading: false,
                searchOptions: []
            });
        }
    }

    handleValueChange = value => {
        this.setState({searchOptions: []});
        this.props.commit(value);
    }

    handleChooseFromMedia = () => {
        const {secondaryEditorsRegistry} = this.props;
        const {component: MediaSelectionScreen} = secondaryEditorsRegistry.get('Neos.Neos/Inspector/Secondary/Editors/MediaSelectionScreen');

        this.props.renderSecondaryInspector('IMAGE_SELECT_MEDIA', () =>
            <MediaSelectionScreen onComplete={this.handleMediaSelected}/>
        );
    }

    handleMediaSelected = assetIdentifier => {
        const {value} = this.props;
        if (this.props.options.multiple) {
            const values = value ? value.slice() : [];
            values.push(assetIdentifier);
            this.handleValueChange(values);
        } else {
            this.handleValueChange(assetIdentifier);
        }
    }

    handleChooseFile = () => {
        this.assetUpload.chooseFromLocalFileSystem();
    }

    renderControls() {
        return (
            <Controls
                onChooseFromMedia={this.handleChooseFromMedia}
                onChooseFromLocalFileSystem={this.handleChooseFile}
                isUploadEnabled={this.isFeatureEnabled('upload')}
                isMediaBrowserEnabled={this.isFeatureEnabled('mediaBrowser')}
                />
        );
    }

    renderAssetUpload() {
        if (!this.isFeatureEnabled('upload')) {
            return null;
        }

        return (
            <AssetUpload
                highlight={this.props.highlight}
                multiple={true}
                multipleData={this.props.value}
                onAfterUpload={this.handleValueChange}
                ref={this.setAssetUploadReference}
                isLoading={false}
                imagesOnly={this.props.imagesOnly}
                >
                {this.props.options.multiple ? (<MultiSelectBox
                    dndType={dndTypes.MULTISELECT}
                    optionValueField="identifier"
                    loadingLabel={this.props.i18nRegistry.translate('Neos.Neos:Main:loading')}
                    displaySearchBox={true}
                    ListPreviewElement={AssetOption}
                    placeholder={this.props.i18nRegistry.translate(this.props.placeholder)}
                    options={this.state.options || []}
                    values={this.getValue()}
                    highlight={this.props.highlight}
                    onValuesChange={this.handleValueChange}
                    displayLoadingIndicator={this.state.isLoading}
                    searchOptions={this.state.searchOptions}
                    showDropDownToggle={false}
                    onSearchTermChange={this.handleSearchTermChange}
                    noMatchesFoundLabel={this.props.i18nRegistry.translate('Neos.Neos.Ui:Main:noMatchesFound')}
                    searchBoxLeftToTypeLabel={this.props.i18nRegistry.translate('Neos.Neos.Ui:Main:searchBoxLeftToType')}
                    threshold={$get('options.threshold', this.props)}
                    />) : (<SelectBox
                        optionValueField="identifier"
                        loadingLabel={this.props.i18nRegistry.translate('Neos.Neos:Main:loading')}
                        displaySearchBox={true}
                        ListPreviewElement={AssetOption}
                        placeholder={this.props.i18nRegistry.translate(this.props.placeholder)}
                        options={this.props.value ? this.state.options : this.state.searchOptions}
                        value={this.getValue()}
                        highlight={this.props.highlight}
                        onValueChange={this.handleValueChange}
                        displayLoadingIndicator={this.state.isLoading}
                        showDropDownToggle={false}
                        allowEmpty={true}
                        onSearchTermChange={this.handleSearchTermChange}
                        noMatchesFoundLabel={this.props.i18nRegistry.translate('Neos.Neos.Ui:Main:noMatchesFound')}
                        searchBoxLeftToTypeLabel={this.props.i18nRegistry.translate('Neos.Neos.Ui:Main:searchBoxLeftToType')}
                        threshold={$get('options.threshold', this.props)}
                        />)}
            </AssetUpload>
        );
    }

    render() {
        return (
            <div>
                {this.renderAssetUpload()}
                {this.renderControls()}
            </div>
        );
    }

    setAssetUploadReference = ref => {
        if (ref === null) {
            this.assetUpload = null;
            return;
        }
        this.assetUpload = ref.getWrappedInstance();
    }
}
