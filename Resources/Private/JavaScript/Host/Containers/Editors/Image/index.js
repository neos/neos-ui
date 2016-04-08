import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {$set, $drop, $transform, $get, $map, $override} from 'plow-js';
import {UI, CR} from 'Host/Selectors/index';
import style from './style.css';
import Dropzone from 'react-dropzone';
import {actions} from 'Host/Redux/index';
import mime from 'mime-types';

import {
    Icon,
    Button,
    I18n
} from 'Components/index';

import ImageCropper from './image-cropper';
import MediaSelectionScreen from './media-selection-screen';
import MediaDetailsScreen from './media-details-screen';
import ResizeControls from './resize-controls';

const extractCropInformationRelativeToOriginalDimensions = (image) => {
    const cropImageAdjustment = $get(['object', 'adjustments', 'TYPO3\\Media\\Domain\\Model\\Adjustment\\CropImageAdjustment'], image);

    if (cropImageAdjustment) {
        return cropImageAdjustment.toJS();
    }
    return {
        height: $get('originalDimensions.height', image),
        width: $get('originalDimensions.width', image),
        x: 0,
        y: 0
    };
};

const extractResizeImageAdjustment = (image) => {
    const resizeImageAdjustment = $get(['object', 'adjustments', 'TYPO3\\Media\\Domain\\Model\\Adjustment\\ResizeImageAdjustment'], image);

    if (resizeImageAdjustment) {
        return resizeImageAdjustment.toJS();
    }
    return null;
};

/**
 * @return scaleFactor, where originalImage * scaleFactor = previewImage
 */
const calculatePreviewScalingFactor = image =>
    $get('previewDimensions.width', image) / $get('originalDimensions.width', image);

const transformOriginalDimensionsToPreviewImageDimensions = (coordinates, scalingFactor) =>
    $map(v => v * scalingFactor, [], coordinates);

/**
 * @return scaleFactor, where coordinates * scaleFactor = maximumDisplaySize
 */
const calculateThumbnailScalingFactorInOneDimension = (dimension, coordinates, maximumDisplaySize) =>
    $get(dimension, maximumDisplaySize) / $get(dimension, coordinates);
const calculateThumbnailScalingFactor = (coordinates, maximumDisplaySize) => {
    const xFactor = calculateThumbnailScalingFactorInOneDimension('width', coordinates, maximumDisplaySize);
    const yFactor = calculateThumbnailScalingFactorInOneDimension('height', coordinates, maximumDisplaySize);

    return Math.min(xFactor, yFactor);
};

// TODO: make publicly configurable
const imagePreviewMaximumDimensions = {
    width: 288,
    height: 216
};

const DEFAULT_FEATURES = {
    crop: true,
    resize: false
};

const cropScreenIdentifier = value => `${value}#crop`;
const mediaSelectionScreenIdentifier = value => `${value}#mediaSelection`;
const mediaDetailsScreenIdentifier = value => `${value}#mediaDetails`;

const RESIZE_IMAGE_ADJUSTMENT = ['object', 'adjustments', 'TYPO3\\Media\\Domain\\Model\\Adjustment\\ResizeImageAdjustment'];

@connect($transform({
    // TODO: the next line does not work
    imageLookup: CR.Images.imageLookup,

    currentImageValue: UI.Inspector.currentImageValue,
    focusedNode: CR.Nodes.focusedSelector,
    visibleDetailsScreen: $get('ui.editors.image.visibleDetailsScreen'),
    currentlyUploadingScreen: $get('ui.editors.image.currentlyUploadingScreen')
}), {
    toggleImageDetailsScreen: actions.UI.Editors.Image.toggleImageDetailsScreen,
    updateImage: actions.UI.Editors.Image.updateImage,
    uploadImage: actions.UI.Editors.Image.uploadImage
})
export default class Image extends Component {
    static propTypes = {

        value: PropTypes.oneOfType([
            PropTypes.shape({
                __identifier: PropTypes.string
            }),
            PropTypes.string
        ]),
        onChange: PropTypes.func.isRequired,
        identifier: PropTypes.string.isRequired,
        visibleDetailsScreen: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.bool
        ]),
        currentlyUploadingScreen: PropTypes.string.isRequired,

        currentImageValue: PropTypes.func.isRequired,
        focusedNode: PropTypes.object.isRequired,
        updateImage: PropTypes.func.isRequired,
        uploadImage: PropTypes.func.isRequired,
        toggleImageDetailsScreen: PropTypes.func.isRequired,

        // Public API:
        // I18N key
        fileChooserLabel: PropTypes.string,

        features: PropTypes.shape({
            crop: PropTypes.bool,
            resize: PropTypes.bool
        }),

        allowedFileTypes: PropTypes.string
    };

    static defaultProps = {
        allowedFileTypes: 'jpg,jpeg,png,gif,svg'
    };

    isFeatureEnabled(featureName) {
        const features = Object.assign({}, DEFAULT_FEATURES, this.props.features);
        return features[featureName];
    }

    onChooseFile() {
        this.refs.dropzone.open();
    }

    onCrop(cropArea) {
        const imageIdentity = $get('__identity', this.props.value);

        let image;
        if (imageIdentity) {
            image = this.props.currentImageValue(imageIdentity);
        }
        const imageWidth = $get('originalDimensions.width', image);
        const imageHeight = $get('originalDimensions.height', image);
        const cropAdjustments = {
            x: Math.round(cropArea.x / 100 * imageWidth),
            y: Math.round(cropArea.y / 100 * imageHeight),
            width: Math.round(cropArea.width / 100 * imageWidth),
            height: Math.round(cropArea.height / 100 * imageHeight)
        };
        image = $override(['object', 'adjustments', 'TYPO3\\Media\\Domain\\Model\\Adjustment\\CropImageAdjustment'], cropAdjustments, image);

        this.props.updateImage($get('contextPath', this.props.focusedNode), imageIdentity, image);
        this.props.onChange($set('__modified', true, this.props.value));
    }

    onResize(resizeAdjustment) {
        const imageIdentity = $get('__identity', this.props.value);

        let image;
        if (imageIdentity) {
            image = this.props.currentImageValue(imageIdentity);
        }

        if (resizeAdjustment) {
            this.props.updateImage($get('contextPath', this.props.focusedNode), imageIdentity, $set(RESIZE_IMAGE_ADJUSTMENT, resizeAdjustment, image));
        } else {
            this.props.updateImage($get('contextPath', this.props.focusedNode), imageIdentity, $drop(RESIZE_IMAGE_ADJUSTMENT, image));
        }
        // TODO: next line should maybe be included in above action?
        this.props.onChange($set('__modified', true, this.props.value));
    }

    onToggleCropScreen() {
        this.props.toggleImageDetailsScreen(cropScreenIdentifier(this.props.identifier));
    }

    onToggleMediaSelectionScreen() {
        this.props.toggleImageDetailsScreen(mediaSelectionScreenIdentifier(this.props.identifier));
    }
    onRemoveFile() {
        this.props.toggleImageDetailsScreen(false);
        this.props.onChange($set('__identity', '', this.props.value));
    }

    onMediaSelected(assetIdentifier) {
        this.props.onChange($set('__identity', assetIdentifier, this.props.value));
        this.onToggleMediaSelectionScreen(false);
    }

    onToggleMediaDetailsScreen() {
        this.props.toggleImageDetailsScreen(mediaDetailsScreenIdentifier(this.props.identifier));
    }

    onThumbnailClicked() {
        const imageIdentity = $get('__identity', this.props.value);
        let image;
        if (imageIdentity) {
            image = this.props.currentImageValue(imageIdentity);
        }
        if (image) {
            this.onToggleMediaDetailsScreen();
        } else {
            this.onChooseFile();
        }
    }

    onDrop(files) {
        const file = files[0];
        this.props.uploadImage(file, this.props.onChange, this.props.identifier);
    }

    render() {
        const imageIdentity = $get('__identity', this.props.value);
        let image;
        if (imageIdentity) {
            image = this.props.currentImageValue(imageIdentity);
        }
        const isLoadingImage = ($get('status', image) === 'LOADING' || this.props.currentlyUploadingScreen === this.props.identifier);

        const imageLoaded = Boolean($get('previewImageResourceUri', image));

        const previewScalingFactor = calculatePreviewScalingFactor(image);
        const cropInformationRelativeToOriginalImage = extractCropInformationRelativeToOriginalDimensions(image);
        const cropInformationRelativeToPreviewImage = transformOriginalDimensionsToPreviewImageDimensions(cropInformationRelativeToOriginalImage, previewScalingFactor);

        // TODO: static path!
        const previewImageResourceUri = $get('previewImageResourceUri', image) || '/_Resources/Static/Packages/TYPO3.Neos/Images/dummy-image.svg';

        const thumbnailScalingFactor = calculateThumbnailScalingFactor(cropInformationRelativeToPreviewImage, imagePreviewMaximumDimensions);

        const previewBoundingBoxDimensions = {
            width: Math.floor(cropInformationRelativeToPreviewImage.width * thumbnailScalingFactor),
            height: Math.floor(cropInformationRelativeToPreviewImage.height * thumbnailScalingFactor)
        };

        let containerStyles = {};
        let imageStyles = {};
        if (imageLoaded) {
            containerStyles = {
                width: `${previewBoundingBoxDimensions.width}px`,
                height: `${previewBoundingBoxDimensions.height}px`,
                position: 'absolute',
                left: `${(imagePreviewMaximumDimensions.width - previewBoundingBoxDimensions.width) / 2 }px`,
                top: `${(imagePreviewMaximumDimensions.height - previewBoundingBoxDimensions.height) / 2}px`
            };
            imageStyles = {
                width: `${Math.floor($get('previewDimensions.width', image) * thumbnailScalingFactor)}px`,
                height: `${Math.floor($get('previewDimensions.height', image) * thumbnailScalingFactor)}px`,
                marginLeft: `-${(cropInformationRelativeToPreviewImage.x * thumbnailScalingFactor)}px`,
                marginTop: `-${(cropInformationRelativeToPreviewImage.y * thumbnailScalingFactor)}px`
            };
        }

        const imageWidth = $get('originalDimensions.width', image);
        const imageHeight = $get('originalDimensions.height', image);
        const crop = {
            x: cropInformationRelativeToOriginalImage.x / imageWidth * 100,
            y: cropInformationRelativeToOriginalImage.y / imageHeight * 100,
            width: cropInformationRelativeToOriginalImage.width / imageWidth * 100,
            height: cropInformationRelativeToOriginalImage.height / imageHeight * 100
        };

        const isCropperVisible = (cropScreenIdentifier(this.props.identifier) === this.props.visibleDetailsScreen);
        const isMediaSelectionScreenVisible = (mediaSelectionScreenIdentifier(this.props.identifier) === this.props.visibleDetailsScreen);
        const isMediaDetailsScreenVisible = (mediaDetailsScreenIdentifier(this.props.identifier) === this.props.visibleDetailsScreen);

        const allowedMimeTypes = this.props.allowedFileTypes.split(',').map(fileType => mime.lookup(fileType)).join(',');

        // Thumbnail-inner has style width and height
        return (
            <div className={style.imageEditor}>
                <Dropzone ref="dropzone" onDropAccepted={this.onDrop.bind(this)} className={style['imageEditor--dropzone']} activeClassName={style['imageEditor--dropzone--isActive']} rejectClassName={style['imageEditor--dropzone--isRejecting']} accept={allowedMimeTypes} disableClick={true} multiple={false}>
                    <div className={style['imageEditor--thumbnail']} onClick={this.onThumbnailClicked.bind(this)}>
                        <div className={style['imageEditor--thumbnailInner']} style={containerStyles}>
                            {isLoadingImage ? <Icon icon="spinner" spin={true} size="big" /> : <img src={previewImageResourceUri} style={imageStyles}/>}
                        </div>
                    </div>
                </Dropzone>

                <div>
                    <Button style="small" isPressed={isMediaSelectionScreenVisible} onClick={this.onToggleMediaSelectionScreen.bind(this)}><I18n id="TYPO3.Neos:Main:media" fallback="Media" /></Button>
                    <Button style="small" onClick={this.onChooseFile.bind(this)}><I18n id={this.props.fileChooserLabel} fallback="Choose file" /></Button>
                    <Button style="small" onClick={this.onRemoveFile.bind(this)}><I18n id="TYPO3.Neos:Main:remove" fallback="Remove" /></Button>
                    {imageLoaded && this.isFeatureEnabled('crop') ? <Button style="small" className={style['imageEditor--cropButton']} isPressed={isCropperVisible} onClick={this.onToggleCropScreen.bind(this)}>
                        <I18n id="TYPO3.Neos:Main:crop" fallback="Crop" />
                    </Button> : null}
                </div>

                {imageLoaded && this.isFeatureEnabled('resize') ? <ResizeControls imageDimensions={cropInformationRelativeToOriginalImage} resizeAdjustment={extractResizeImageAdjustment(image)} onChange={this.onResize.bind(this)} /> : null}

                {isMediaSelectionScreenVisible ?
                    <MediaSelectionScreen onClose={this.onToggleMediaSelectionScreen.bind(this)} onComplete={this.onMediaSelected.bind(this)} /> : null}
                {isMediaDetailsScreenVisible ?
                    <MediaDetailsScreen onClose={this.onToggleMediaDetailsScreen.bind(this)} imageIdentity={imageIdentity} /> : null}
                {isCropperVisible ?
                    <ImageCropper sourceImage={previewImageResourceUri} onComplete={this.onCrop.bind(this)} crop={crop} onClose={this.onToggleCropScreen.bind(this)}/> : null}

            </div>
        );
    }
}
