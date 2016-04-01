import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import ReactCrop from 'react-image-crop';
import {$set, $transform, $get, $map, $override} from 'plow-js';
import {Map} from 'immutable';
import {UI, CR} from 'Host/Selectors/index';
import style from './style.css';
import Dropzone from 'react-dropzone';
import {actions} from 'Host/Redux/index';

import {
    Icon,
    Button,
    FullscreenContentOverlay
} from 'Components/index';


const extractCropInformationRelativeToOriginalDimensions = (image) => {
    const cropImageAdjustment = $get(['object', 'adjustments', 'TYPO3\\Media\\Domain\\Model\\Adjustment\\CropImageAdjustment'], image);

    if (cropImageAdjustment) {
        return cropImageAdjustment.toJS();
    } else {
        return {
            height: $get('originalDimensions.height', image),
            width: $get('originalDimensions.width', image),
            x: 0,
            y: 0
        };
    }
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

const AspectRatioControl = (props) => {
    /* {{#if view.aspectRatioAllowCustom}}
    {{input valueBinding="view.aspectRatioWidth" type="number"}}
    <button {{action "exchangeAspectRatio" target="view"}}><i class="icon-exchange"></i></button>
    {{input valueBinding="view.aspectRatioHeight" type="number"}}
    {{else}}
    <input {{bindAttr value="view.aspectRatioWidth"}} type="number" readonly="readonly" />
    <input {{bindAttr value="view.aspectRatioHeight"}} type="number" readonly="readonly" />
        {{/if}}
    {{/unless}} */

    return (<div />);
}

const ImageCropper = (props) => {
    const aspectRatioLocked = false;
    const aspectRatioReduced = "5:3";

    const aspectRatioLockIcon = (aspectRatioLocked ? <Icon icon="lock" /> : null);

    return (<FullscreenContentOverlay onClose={props.onClose}>
        <span>
            <Icon icon="crop" />
            {(aspectRatioReduced ? <span title={aspectRatioReduced}>{aspectRatioReduced}</span> : null)}
            {aspectRatioLockIcon}
        </span>
        {(!aspectRatioLocked ? <AspectRatioControl /> : null)}
        <ReactCrop src={props.sourceImage} crop={props.crop} onComplete={props.onComplete}/>
    </FullscreenContentOverlay>);
};


const MediaSelectionScreen = (props) => {
    window.Typo3MediaBrowserCallbacks = {
        assetChosen: assetIdentifier => {
            props.onComplete(assetIdentifier);
        }
    };
    return (<FullscreenContentOverlay onClose={props.onClose}>
        <iframe src="/neos/content/images.html" className={style.mediaSelectionScreen__iframe} />
    </FullscreenContentOverlay>);
}

const cropScreenIdentifier = value => value + '#crop';
const mediaSelectionScreenIdentifier = value => value + '#mediaSelection';


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

    onMediaSelected(assetIdentifier) {
        this.props.onChange($set('__identity', assetIdentifier, this.props.value));
        this.onOpenMediaSelectionScreen()
    }

    onThumbnailClicked() {
        const imageIdentity = $get('__identity', this.props.value);
        let image;
        if (imageIdentity) {
            image = this.props.currentImageValue(imageIdentity);
        }
        if (image) {
            // TODO: display media preview
            this.onChooseFile();
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
                width: previewBoundingBoxDimensions.width + 'px',
                height: previewBoundingBoxDimensions.height + 'px',
                position: 'absolute',
                left: ((imagePreviewMaximumDimensions.width - previewBoundingBoxDimensions.width) / 2 ) + 'px',
                top: ((imagePreviewMaximumDimensions.height - previewBoundingBoxDimensions.height) / 2) + 'px'
            };
            imageStyles = {
                width: Math.floor($get('previewDimensions.width', image) * thumbnailScalingFactor) + 'px',
                height: Math.floor($get('previewDimensions.height', image) * thumbnailScalingFactor) + 'px',
                marginLeft: '-' + (cropInformationRelativeToPreviewImage.x * thumbnailScalingFactor) + 'px',
                marginTop: '-' + (cropInformationRelativeToPreviewImage.y * thumbnailScalingFactor) + 'px'
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

        const isCropperVisible = (cropScreenIdentifier(this.props.identifier) == this.props.cropScreenVisible);
        const isMediaSelectionScreenVisible = (mediaSelectionScreenIdentifier(this.props.identifier) == this.props.cropScreenVisible);


        // Thumbnail-inner has style width and height
        return (
            <div className={style.imageEditor}>
                {isMediaSelectionScreenVisible ?
                    <MediaSelectionScreen onClose={this.onOpenCropScreen.bind(this)} onComplete={this.onMediaSelected.bind(this)} /> : null}
                {isCropperVisible ?
                    <ImageCropper sourceImage={previewImageResourceUri} onComplete={this.onCrop.bind(this)} crop={crop} onClose={this.onOpenCropScreen.bind(this)}/> : null}

                <Dropzone ref="dropzone" onDrop={this.onDrop} className={style['imageEditor--dropzone']} disableClick={true}>
                    <div className={style['imageEditor--thumbnail']} onClick={this.onThumbnailClicked.bind(this)}>
                        <div className={style['imageEditor--thumbnailInner']} style={containerStyles}>
                            {isLoadingImage ? <Icon icon="spinner" spin={true} size="big" /> : <img src={previewImageResourceUri} style={imageStyles}/>}
                        </div>
                    </div>
                </Dropzone>

                <div>
                    <Button isPressed={isMediaSelectionScreenVisible} onClick={this.onOpenMediaSelectionScreen.bind(this)}>Media</Button>
                    <Button onClick={this.onChooseFile.bind(this)}>Choose</Button>
                    <Button isPressed={isCropperVisible} onClick={this.onOpenCropScreen.bind(this)}>
                        Crop
                    </Button>
                </div>
                <div style={{"paddingBottom": "50px"}}>TODO remove this</div>
            </div>
        );
    }
}