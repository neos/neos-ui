import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import ReactCrop from 'react-image-crop';
import {$transform, $get, $map} from 'plow-js';
import {CR} from 'Host/Selectors/';
import style from './style.css';
import Dropzone from 'react-dropzone';
import {actions} from 'Host/Redux/index';

import {
    Button,
    Portal
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
    $map(v => v*scalingFactor, [], coordinates);


/**
 * @return scaleFactor, where coordinates * scaleFactor = maximumDisplaySize
 */
const calculateThumbnailScalingFactorInOneDimension = (dimension, coordinates, maximumDisplaySize) =>
    $get(dimension, maximumDisplaySize) / $get(dimension, coordinates);
const calculateThumbnailScalingFactor = (coordinates, maximumDisplaySize) => {
    const xFactor = calculateThumbnailScalingFactorInOneDimension('width', coordinates, maximumDisplaySize);
    const yFactor = calculateThumbnailScalingFactorInOneDimension('height', coordinates, maximumDisplaySize);

    return Math.min(xFactor, yFactor);
}

// TODO: make publicly configurable
const imagePreviewMaximumDimensions = {
    width: 288,
    height: 216
};

const ImageCropper = (props) => {
    return (<Portal targetId="centerArea" isOpened={props.isOpened}>
        <ReactCrop src={props.sourceImage} />
    </Portal>);
}

@connect($transform({
    // imageLookup: CR.Images.imageLookup // TODO: does not work
    imagesByUuid: $get(['cr', 'images', 'byUuid']),
    cropScreenVisible: $get(['ui', 'editors', 'image', 'cropScreenVisible'])
}), {
    openCropScreen: actions.UI.Editors.Image.openCropScreen
})
export default class Image extends Component {
    static propTypes = {
        //value: PropTypes.object.isRequired
        // TODO: public configuration for editors??
        //imagePreviewMaximumDimensions: {width: 288, height: 216},
    };

    onChooseFile() {
        this.refs.dropzone.open();
    }




    render() {
        const imageIdentity = $get('__identity', this.props.value);
        let image;
        if (this.props.imagesByUuid && imageIdentity) {
            image = $get([imageIdentity], this.props.imagesByUuid);
        }

        const previewScalingFactor = calculatePreviewScalingFactor(image);
        const cropInformationRelativeToOriginalImage = extractCropInformationRelativeToOriginalDimensions(image);
        const cropInformationRelativeToPreviewImage = transformOriginalDimensionsToPreviewImageDimensions(cropInformationRelativeToOriginalImage, previewScalingFactor);

        const previewImageResourceUri = $get('previewImageResourceUri', image) || '/_Resources/Static/Packages/TYPO3.Neos/Images/dummy-image.svg'; // TODO static path

        const thumbnailScalingFactor = calculateThumbnailScalingFactor(cropInformationRelativeToPreviewImage, imagePreviewMaximumDimensions);


        const previewBoundingBoxDimensions = {
            width: Math.floor(cropInformationRelativeToPreviewImage.width * thumbnailScalingFactor),
            height: Math.floor(cropInformationRelativeToPreviewImage.height * thumbnailScalingFactor)
        };
        const containerStyles = {
            width: previewBoundingBoxDimensions.width + 'px',
            height: previewBoundingBoxDimensions.height + 'px',
            position: 'absolute',
            left: ((imagePreviewMaximumDimensions.width - previewBoundingBoxDimensions.width) / 2 ) + 'px',
            top: ((imagePreviewMaximumDimensions.height - previewBoundingBoxDimensions.height) / 2) + 'px'
        };

        const imageStyles = {
            width: Math.floor($get('previewDimensions.width', image) * thumbnailScalingFactor) + 'px',
            height: Math.floor($get('previewDimensions.height', image) * thumbnailScalingFactor) + 'px',
            marginLeft: '-' + (cropInformationRelativeToPreviewImage.x * thumbnailScalingFactor) + 'px',
            marginTop: '-' + (cropInformationRelativeToPreviewImage.y * thumbnailScalingFactor) + 'px'
        };

        // Thumbnail-inner has style width and height
        return (
            <div className={style.imageEditor}>
                <ImageCropper sourceImage={previewImageResourceUri} isOpened={this.props.cropScreenVisible} />
                <Dropzone ref="dropzone" onDrop={this.onDrop} className={style['imageEditor--dropzone']}>
                    <div className={style['imageEditor--thumbnail']}>
                        <div className={style['imageEditor--thumbnailInner']} style={containerStyles}>
                            <img src={previewImageResourceUri} style={imageStyles} />
                        </div>
                    </div>
                </Dropzone>

                <div>
                    <Button>Media</Button>
                    <Button onClick={this.onChooseFile.bind(this)}>Choose</Button>
                    <Button onClick={this.props.openCropScreen}>
                        Crop
                    </Button>
                </div>
                <div style={{"paddingBottom": "50px"}}>TODO remove this</div>
            </div>
        );
    }
}