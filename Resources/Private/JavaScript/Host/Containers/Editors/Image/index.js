import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {$set, $transform, $get, $map, $override} from 'plow-js';
import {UI, CR} from 'Host/Selectors/index';
import style from './style.css';
import Dropzone from 'react-dropzone';
import {actions} from 'Host/Redux/index';

import {
    Icon,
    Button,
    I18n
} from 'Components/index';

import ImageCropper from './image-cropper';
import MediaSelectionScreen from './media-selection-screen';
import MediaDetailsScreen from './media-details-screen';

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

const cropScreenIdentifier = value => value + '#crop';
const mediaSelectionScreenIdentifier = value => value + '#mediaSelection';
const mediaDetailsScreenIdentifier = value => value + '#mediaDetails';

@connect($transform({
    // imageLookup: CR.Images.imageLookup // TODO: does not work
    currentImageValue: UI.Inspector.currentImageValue,
    focusedNode: CR.Nodes.focusedSelector,
    cropScreenVisible: $get(['ui', 'editors', 'image', 'cropScreenVisible'])
}), {
    openCropScreen: actions.UI.Editors.Image.openCropScreen, // TODO: toggle
    cropImage: actions.UI.Editors.Image.cropImage
})
export default class Image extends Component {
    static propTypes = {
        //value: PropTypes.object.isRequired
        // TODO: public configuration for editors??
        //imagePreviewMaximumDimensions: {width: 288, height: 216},
        // identifier

        // I18N key
        fileChooserlabel: PropTypes.string
    };

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

        // TODO: we basically would need to create a new Image adjustment probably????
        this.props.cropImage($get('contextPath', this.props.focusedNode), imageIdentity, image);
    }

    onOpenCropScreen() {
        this.props.openCropScreen(cropScreenIdentifier(this.props.identifier))
    }

    onOpenMediaSelectionScreen() {
        this.props.openCropScreen(mediaSelectionScreenIdentifier(this.props.identifier))
    }
    onRemoveFile() {
        this.props.openCropScreen(false);
        this.props.onChange($set('__identity', '', this.props.value));
    }

    onMediaSelected(assetIdentifier) {
        this.props.onChange($set('__identity', assetIdentifier, this.props.value));
        this.onOpenMediaSelectionScreen(); // Closes it again
    }

    onOpenMediaDetailsScreen() {
        this.props.openCropScreen(mediaDetailsScreenIdentifier(this.props.identifier));
    }

    onThumbnailClicked() {
        const imageIdentity = $get('__identity', this.props.value);
        let image;
        if (imageIdentity) {
            image = this.props.currentImageValue(imageIdentity);
        }
        if (image) {
            this.onOpenMediaDetailsScreen();
        } else {
            this.onChooseFile();
        }

    }

    render() {
        const imageIdentity = $get('__identity', this.props.value);
        let image;
        if (imageIdentity) {
            image = this.props.currentImageValue(imageIdentity);
        }
        const isLoadingImage = ($get('status', image) === 'LOADING');

        const imageLoaded = !!$get('previewImageResourceUri', image);

        const previewScalingFactor = calculatePreviewScalingFactor(image);
        const cropInformationRelativeToOriginalImage = extractCropInformationRelativeToOriginalDimensions(image);
        const cropInformationRelativeToPreviewImage = transformOriginalDimensionsToPreviewImageDimensions(cropInformationRelativeToOriginalImage, previewScalingFactor);

        const previewImageResourceUri = $get('previewImageResourceUri', image) || '/_Resources/Static/Packages/TYPO3.Neos/Images/dummy-image.svg'; // TODO static path

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

        const isCropperVisible = (cropScreenIdentifier(this.props.identifier) === this.props.cropScreenVisible);
        const isMediaSelectionScreenVisible = (mediaSelectionScreenIdentifier(this.props.identifier) === this.props.cropScreenVisible);
        const isMediaDetailsScreenVisible = (mediaDetailsScreenIdentifier(this.props.identifier) === this.props.cropScreenVisible);


        // Thumbnail-inner has style width and height
        return (
            <div className={style.imageEditor}>
                <Dropzone ref="dropzone" onDrop={this.onDrop} className={style['imageEditor--dropzone']} disableClick={true}>
                    <div className={style['imageEditor--thumbnail']} onClick={this.onThumbnailClicked.bind(this)}>
                        <div className={style['imageEditor--thumbnailInner']} style={containerStyles}>
                            {isLoadingImage ? <Icon icon="spinner" spin={true} size="big" /> : <img src={previewImageResourceUri} style={imageStyles}/>}
                        </div>
                    </div>
                </Dropzone>

                <div>
                    <Button isPressed={isMediaSelectionScreenVisible} onClick={this.onOpenMediaSelectionScreen.bind(this)}>Media</Button>
                    <Button onClick={this.onChooseFile.bind(this)}><I18n id={this.props.fileChooserLabel} fallback="Choose file" /></Button>
                    <Button onClick={this.onRemoveFile.bind(this)}>Remove</Button>
                    {imageLoaded ? <Button isPressed={isCropperVisible} onClick={this.onOpenCropScreen.bind(this)}>
                        Crop
                    </Button> : null}
                </div>
                <div style={{"paddingBottom": "50px"}}>TODO remove this</div>

                {isMediaSelectionScreenVisible ?
                    <MediaSelectionScreen onClose={this.onOpenMediaSelectionScreen.bind(this)} onComplete={this.onMediaSelected.bind(this)} /> : null}
                {isMediaDetailsScreenVisible ?
                    <MediaDetailsScreen onClose={this.onOpenMediaDetailsScreen.bind(this)} imageIdentity={imageIdentity} /> : null}
                {isCropperVisible ?
                    <ImageCropper sourceImage={previewImageResourceUri} onComplete={this.onCrop.bind(this)} crop={crop} onClose={this.onOpenCropScreen.bind(this)}/> : null}

            </div>
        );
    }
}
