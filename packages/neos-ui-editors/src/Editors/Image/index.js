import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {$set, $drop, $get} from 'plow-js';

import backend from '@neos-project/neos-ui-backend-connector';
import {neos} from '@neos-project/neos-ui-decorators';

import {PreviewScreen, Controls, ResizeControls} from './Components/index';
import {Image, CROP_IMAGE_ADJUSTMENT, RESIZE_IMAGE_ADJUSTMENT} from './Utils/index';

import style from './style.css';

const DEFAULT_FEATURES = {
    crop: true,
    resize: false,
    mediaBrowser: true,
    upload: true
};

@neos(globalRegistry => ({
    secondaryEditorsRegistry: globalRegistry.get('inspector').get('secondaryEditors')
}))
export default class ImageEditor extends Component {
    state = {
        image: null,
        isImageCropperOpen: false,
        isAssetLoading: false
    };

    static propTypes = {
        // The propertyName this editor is used for, coming from the inspector
        identifier: PropTypes.string,

        value: PropTypes.oneOfType([
            PropTypes.shape({
                __identifier: PropTypes.string
            }),
            PropTypes.string
        ]),
        // "hooks" are the hooks specified by commit()
        hooks: PropTypes.object,

        commit: PropTypes.func.isRequired,
        renderSecondaryInspector: PropTypes.func.isRequired,
        secondaryEditorsRegistry: PropTypes.object.isRequired,

        options: PropTypes.object,
        highlight: PropTypes.bool,

        // Public API:
        // I18N key
        fileChooserLabel: PropTypes.string,

        allowedFileTypes: PropTypes.string
    };

    static defaultProps = {
        allowedFileTypes: 'jpg,jpeg,png,gif,svg',
        identifier: ''
    };

    componentDidMount() {
        const {loadImageMetadata} = backend.get().endpoints;

        if (this.props.value && this.props.value.__identity) {
            this.setState({
                isAssetLoading: true
            }, () => {
                this.loadImage = loadImageMetadata(this.props.value.__identity)
                    .then(image => {
                        this.setState({
                            image,
                            isAssetLoading: false
                        });
                    });
            });
        }

        this._isMounted = true;
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    componentWillReceiveProps(nextProps) {
        const {loadImageMetadata} = backend.get().endpoints;

        if (!nextProps.value || !nextProps.value.__identity) {
            this.setState({image: null});
        }

        //
        // Re-Load the image metadata in case a new image was selected.
        //
        if (
            nextProps.value &&
            nextProps.value.__identity &&
            nextProps.value.__identity !== (this.props.value && this.props.value.__identity)
        ) {
            loadImageMetadata(nextProps.value.__identity)
                .then(image => {
                    if (this._isMounted) {
                        this.setState({
                            image,
                            isAssetLoading: false
                        });
                    }
                });
        }
    }

    isFeatureEnabled(featureName) {
        const features = Object.assign({}, DEFAULT_FEATURES, this.props.options.features);
        return features[featureName];
    }

    afterUpload = uploadResult => {
        const {commit} = this.props;
        const {isImageCropperOpen} = this.state;

        commit(uploadResult.object);
        if (isImageCropperOpen) {
            this.handleCloseSecondaryScreen();
            this.handleOpenImageCropper();
        }
    }

    handleMediaCrop = cropArea => {
        const {commit, value} = this.props;
        const {image} = this.state;

        const imageWidth = $get('originalDimensions.width', image);
        const imageHeight = $get('originalDimensions.height', image);
        const cropAdjustments = {
            x: Math.round(cropArea.x / 100 * imageWidth),
            y: Math.round(cropArea.y / 100 * imageHeight),
            width: Math.round(cropArea.width / 100 * imageWidth),
            height: Math.round(cropArea.height / 100 * imageHeight)
        };
        const nextimage = $set(CROP_IMAGE_ADJUSTMENT, cropAdjustments, image);

        commit(value, {
            'Neos.UI:Hook.BeforeSave.CreateImageVariant': nextimage
        });
    }

    handleResize = resizeAdjustment => {
        const {commit, value} = this.props;
        const {image} = this.state;
        const nextimage = resizeAdjustment ?
            $set(RESIZE_IMAGE_ADJUSTMENT, resizeAdjustment, image) : $drop(RESIZE_IMAGE_ADJUSTMENT, image);
        this.setState({
            image: nextimage
        });
        commit(value, {
            'Neos.UI:Hook.BeforeSave.CreateImageVariant': nextimage
        });
    }

    handleCloseSecondaryScreen = () => {
        this.props.renderSecondaryInspector(undefined, undefined);
    }

    getValue() {
        return this.props.value ? this.props.value : {};
    }

    handleRemoveFile = () => {
        const {commit} = this.props;

        this.handleCloseSecondaryScreen();
        this.setState({
            image: null
        }, () => {
            commit('');
        });
    }

    handleMediaSelected = assetIdentifier => {
        const {commit} = this.props;
        const value = this.getValue();
        const newAsset = $set('__identity', assetIdentifier, value);

        this.setState({
            image: null,
            isAssetLoading: true
        }, () => {
            commit(newAsset);
            this.handleCloseSecondaryScreen();
        });
    }

    handleThumbnailClicked = () => {
        const {secondaryEditorsRegistry} = this.props;
        const {component: MediaDetailsScreen} = secondaryEditorsRegistry.get('Neos.Neos/Inspector/Secondary/Editors/MediaDetailsScreen');
        const imageIdentity = $get('__identity', this.props.value);

        if (imageIdentity) {
            this.props.renderSecondaryInspector('IMAGE_MEDIA_DETAILS', () =>
                <MediaDetailsScreen
                    onClose={this.handleCloseSecondaryScreen}
                    imageIdentity={imageIdentity}
                    />
            );
        } else {
            this.handleChooseFile();
        }
    }

    handleChooseFile = () => {
        this.previewScreen.chooseFromLocalFileSystem();
    }

    handleChooseFromMedia = () => {
        const {secondaryEditorsRegistry} = this.props;
        const {component: MediaSelectionScreen} = secondaryEditorsRegistry.get('Neos.Neos/Inspector/Secondary/Editors/MediaSelectionScreen');

        this.props.renderSecondaryInspector('IMAGE_SELECT_MEDIA', () =>
            <MediaSelectionScreen onComplete={this.handleMediaSelected}/>
        );
    }

    handleOpenImageCropper = () => {
        const {secondaryEditorsRegistry} = this.props;
        const {component: ImageCropper} = secondaryEditorsRegistry.get('Neos.Neos/Inspector/Secondary/Editors/ImageCropper');

        this.setState({isImageCropperOpen: true}, () => {
            this.props.renderSecondaryInspector('IMAGE_CROP', () => <ImageCropper
                sourceImage={Image.fromImageData(this.getUsedImage())}
                options={this.props.options}
                onComplete={this.handleMediaCrop}
                />);
        });
    }

    render() {
        const {
            isAssetLoading,
            image
        } = this.state;
        const {highlight} = this.props;

        return (
            <div className={style.imageEditor}>
                <PreviewScreen
                    propertyName={this.props.identifier}
                    ref={this.setPreviewScreenRef}
                    image={this.getUsedImage()}
                    isLoading={isAssetLoading}
                    afterUpload={this.afterUpload}
                    highlight={highlight}
                    onClick={this.handleThumbnailClicked}
                    />
                <Controls
                    onChooseFromMedia={this.handleChooseFromMedia}
                    onChooseFromLocalFileSystem={this.handleChooseFile}
                    isUploadEnabled={this.isFeatureEnabled('upload')}
                    isMediaBrowserEnabled={this.isFeatureEnabled('mediaBrowser')}
                    onRemove={image ? this.handleRemoveFile : null}
                    onCrop={image ? this.isFeatureEnabled('crop') && this.handleOpenImageCropper : null}
                    />
                {this.isFeatureEnabled('resize') && <ResizeControls
                    onChange={this.handleResize}
                    resizeAdjustment={$get(RESIZE_IMAGE_ADJUSTMENT, image)}
                    imageDimensions={{
                        width: $get('originalDimensions.width', image),
                        height: $get('originalDimensions.height', image)
                    }}
                    />}
            </div>
        );
    }

    getUsedImage() {
        return this.props.hooks ? this.props.hooks['Neos.UI:Hook.BeforeSave.CreateImageVariant'] : this.state.image;
    }

    setPreviewScreenRef = ref => {
        this.previewScreen = ref;
    }

    handleDrop
}
