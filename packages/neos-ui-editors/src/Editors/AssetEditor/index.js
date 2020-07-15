import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import MultiSelectBox from '@neos-project/react-ui-components/src/MultiSelectBox/';
import SelectBox from '@neos-project/react-ui-components/src/SelectBox/';
import {dndTypes} from '@neos-project/neos-ui-constants';
import {neos} from '@neos-project/neos-ui-decorators';
import {$get} from 'plow-js';
import Controls from './Components/Controls/index';
import AssetOption from '../../Library/AssetOption';
import {AssetUpload} from '../../Library/index';
import backend from '@neos-project/neos-ui-backend-connector';

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
        className: PropTypes.string,
        value: PropTypes.oneOfType([PropTypes.string, PropTypes.object, PropTypes.arrayOf(PropTypes.string), PropTypes.arrayOf(PropTypes.object)]),
        options: PropTypes.object,
        searchOptions: PropTypes.array,
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

    getIdentity(value) {
        // Information coming from metadata
        if (value && value.__identity) {
            return value.__identity;
        }
        // Information coming from upload endpoint
        if (value && value.assetUuid) {
            return value.assetUuid;
        }
        return value;
    }

    getValue() {
        return this.getIdentity(this.props.value);
    }

    getValues() {
        const {value} = this.props;
        return Array.isArray(value) ? value.map(this.getIdentity) : [];
    }

    resolveValue = () => {
        if (this.props.value) {
            this.setState({isLoading: true});
            const resolver = this.props.options.multiple ? this.props.assetLookupDataLoader.resolveValues.bind(this.props.assetLookupDataLoader) : this.props.assetLookupDataLoader.resolveValue.bind(this.props.assetLookupDataLoader);
            const value = this.props.options.multiple ? this.getValues() : this.getValue();
            resolver({}, value)
                .then(options => {
                    this.setState({
                        isLoading: false,
                        options
                    });
                });
        }
    }

    isFeatureEnabled(featureName) {
        const features = Object.assign({}, DEFAULT_FEATURES, (this.props.options ? this.props.options.features : {}));
        return features[featureName];
    }

    handleSearchTermChange = searchTerm => {
        if (searchTerm) {
            this.setState({isLoading: true, searchOptions: []});
            this.props.assetLookupDataLoader.search({assetsToExclude: this.getValues(), constraints: this.props.options.constraints || {}}, searchTerm)
                .then(searchOptions => {
                    this.setState({
                        isLoading: false,
                        searchOptions: searchOptions.map(result => {
                            result.group = result.assetSourceLabel;
                            return result;
                        })
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
        const {assetProxyImport} = backend.get().endpoints;
        const valuePromise = (value.indexOf('/') === -1) ? Promise.resolve(value) : assetProxyImport(value);

        valuePromise.then(value => {
            this.props.commit(this.getIdentity(value));
            this.setState({isLoading: false});
        });
    }

    handleValuesChange = values => {
        this.setState({searchOptions: []});
        const {assetProxyImport} = backend.get().endpoints;
        this.setState({isLoading: true});

        if (Array.isArray(values)) {
            const valuePromises = values.map(value => {
                if (typeof value === 'object' || value instanceof Object) {
                    return Promise.resolve(value);
                }
                return (value.indexOf('/') === -1) ? Promise.resolve(value) : assetProxyImport(value);
            });
            Promise.all(valuePromises).then(values => {
                this.props.commit(values.map(this.getIdentity));
                this.setState({isLoading: false});
            });
        } else {
            const value = values;
            const valuePromise = (typeof value === 'object' || value instanceof Object || value.indexOf('/') === -1) ? Promise.resolve(value) : assetProxyImport(value);
            valuePromise.then(value => {
                this.props.commit(this.getIdentity(value));
                this.setState({isLoading: false});
            });
        }
    }

    handleChooseFromMedia = () => {
        const {secondaryEditorsRegistry, options} = this.props;
        const {component: MediaSelectionScreen} = secondaryEditorsRegistry.get('Neos.Neos/Inspector/Secondary/Editors/MediaSelectionScreen');

        this.props.renderSecondaryInspector('IMAGE_SELECT_MEDIA', () =>
            <MediaSelectionScreen constraints={options.constraints || {}} onComplete={this.handleMediaSelected}/>
        );
    }

    handleMediaSelected = assetIdentifier => {
        if (this.props.options.multiple) {
            const values = this.getValues();
            values.push(assetIdentifier);
            this.handleValuesChange(values);
        } else {
            this.handleValueChange(assetIdentifier);
        }
    }

    handleChooseFile = () => {
        this.assetUpload.chooseFromLocalFileSystem();
    }

    renderControls() {
        const disabled = $get('options.disabled', this.props);

        return (
            <Controls
                onChooseFromMedia={this.handleChooseFromMedia}
                onChooseFromLocalFileSystem={this.handleChooseFile}
                isUploadEnabled={this.isFeatureEnabled('upload')}
                isMediaBrowserEnabled={this.isFeatureEnabled('mediaBrowser')}
                disabled={disabled}
                />
        );
    }

    renderAssetSelectorAndUpload() {
        const mediaTypeConstraint = $get('options.constraints.mediaTypes', this.props);
        const accept = $get('options.accept', this.props) || (mediaTypeConstraint && mediaTypeConstraint.join(','));
        const multiple = $get('options.multiple', this.props);
        const {className, imagesOnly, value} = this.props;

        if (!this.isFeatureEnabled('upload')) {
            return this.renderAssetSelect();
        }

        return (
            <AssetUpload
                className={className}
                multiple={multiple}
                multipleData={multiple ? value : []}
                onAfterUpload={this.handleValuesChange}
                ref={this.setAssetUploadReference}
                isLoading={false}
                imagesOnly={imagesOnly}
                accept={accept}
            >
                {this.renderAssetSelect()}
            </AssetUpload>
        );
    }

    renderAssetSelect() {
        const multiple = $get('options.multiple', this.props);

        return multiple ? this.renderAssetMultiSelect() : this.renderAssetSingleSelect();
    }

    renderAssetSingleSelect() {
        const disabled = $get('options.disabled', this.props);

        return (
            <SelectBox
                optionValueField="identifier"
                loadingLabel={this.props.i18nRegistry.translate('Neos.Neos:Main:loading')}
                displaySearchBox={true}
                ListPreviewElement={AssetOption}
                placeholder={this.props.i18nRegistry.translate(this.props.placeholder)}
                options={this.props.value ? this.state.options : this.state.searchOptions}
                value={this.getValue()}
                onValueChange={this.handleValueChange}
                displayLoadingIndicator={this.state.isLoading}
                showDropDownToggle={false}
                allowEmpty={true}
                onSearchTermChange={this.handleSearchTermChange}
                noMatchesFoundLabel={this.props.i18nRegistry.translate('Neos.Neos:Main:noMatchesFound')}
                searchBoxLeftToTypeLabel={this.props.i18nRegistry.translate('Neos.Neos:Main:searchBoxLeftToType')}
                threshold={$get('options.threshold', this.props)}
                disabled={disabled}
            />
        );
    }

    renderAssetMultiSelect() {
        const disabled = $get('options.disabled', this.props);

        return (
            <MultiSelectBox
                dndType={dndTypes.MULTISELECT}
                optionValueField="identifier"
                loadingLabel={this.props.i18nRegistry.translate('Neos.Neos:Main:loading')}
                displaySearchBox={true}
                ListPreviewElement={AssetOption}
                placeholder={this.props.i18nRegistry.translate(this.props.placeholder)}
                options={this.state.options || []}
                values={this.getValues()}
                onValuesChange={this.handleValuesChange}
                displayLoadingIndicator={this.state.isLoading}
                searchOptions={this.state.searchOptions}
                showDropDownToggle={false}
                onSearchTermChange={this.handleSearchTermChange}
                noMatchesFoundLabel={this.props.i18nRegistry.translate('Neos.Neos:Main:noMatchesFound')}
                searchBoxLeftToTypeLabel={this.props.i18nRegistry.translate('Neos.Neos:Main:searchBoxLeftToType')}
                threshold={$get('options.threshold', this.props)}
                disabled={disabled}
            />
        );
    }

    render() {
        return (
            <div>
                {this.renderAssetSelectorAndUpload()}
                {this.renderControls()}
            </div>
        );
    }

    setAssetUploadReference = ref => {
        this.assetUpload = ref;
    }
}
