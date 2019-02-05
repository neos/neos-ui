import {$get, $map, $transform} from 'plow-js';
import {Maybe} from 'monet';

export const CROP_IMAGE_ADJUSTMENT = [
    'object',
    'adjustments',
    'Neos\\Media\\Domain\\Model\\Adjustment\\CropImageAdjustment'
];
export const RESIZE_IMAGE_ADJUSTMENT = [
    'object',
    'adjustments',
    'Neos\\Media\\Domain\\Model\\Adjustment\\ResizeImageAdjustment'
];

const DEFAULT_OFFSET = {x: 0, y: 0};

const extractOriginalDimensions = $transform({
    width: $get('originalDimensions.width'),
    height: $get('originalDimensions.height')
});

const extractPreviewDimensions = $transform({
    width: $get('previewDimensions.width'),
    height: $get('previewDimensions.height')
});

export class Image {
    constructor(image) {
        this.image = image;
    }

    static fromImageData = imageData => new Image(imageData);

    get previewUri() {
        const {image} = this;
        return $get('previewImageResourceUri', image);
    }

    get previewScalingFactor() {
        const {image} = this;
        return $get('previewDimensions.width', image) / $get('originalDimensions.width', image);
    }

    get dimensions() {
        const {image} = this;
        return extractOriginalDimensions(image);
    }

    get aspectRatio() {
        const {width, height} = this.dimensions;
        return width / height;
    }

    get previewDimensions() {
        const {image} = this;
        return extractPreviewDimensions(image);
    }

    get cropAdjustment() {
        const {image} = this;
        return Maybe.fromNull($get(CROP_IMAGE_ADJUSTMENT, image));
    }

    get cropAspectRatio() {
        return this.cropAdjustment.map(c => c.width / c.height);
    }

    get previewCropAdjustment() {
        const {cropAdjustment, previewScalingFactor} = this;
        return cropAdjustment.map($map(v => v * previewScalingFactor, []));
    }

    get resizeAdjustment() {
        const {image} = this;
        return Maybe.fromNull($get(RESIZE_IMAGE_ADJUSTMENT, image));
    }

    get previewResizeAdjustment() {
        const {resizeAdjustment, previewScalingFactor} = this;
        return resizeAdjustment.map($map(v => v * previewScalingFactor, []));
    }
}

export class Thumbnail {
    constructor(image, width, height) {
        this.image = new Image(image);
        this.width = width;
        this.height = height;
    }

    static fromImageData = (imageData, width, height) => new Thumbnail(imageData, width, height);

    get uri() {
        const {previewUri} = this.image;
        return previewUri;
    }

    get scalingFactor() {
        const {image} = this;
        const {width, height} = image.previewCropAdjustment.orSome(image.previewDimensions);
        const byWidth = this.width / width;
        const byHeight = this.height / height;

        return Math.min(byWidth, byHeight);
    }

    get dimensions() {
        const {image, scalingFactor} = this;
        const {width, height} = image.previewDimensions;

        return {
            width: width * scalingFactor,
            height: height * scalingFactor
        };
    }

    get cropDimensions() {
        const {image, scalingFactor} = this;
        const {width, height} = image.previewCropAdjustment.orSome(image.previewDimensions);

        return {
            width: width * scalingFactor,
            height: height * scalingFactor
        };
    }

    get styles() {
        const {dimensions, cropDimensions, scalingFactor} = this;
        const {x, y} = this.image.previewCropAdjustment.orSome(DEFAULT_OFFSET);

        return {
            thumbnail: {
                width: `${dimensions.width}px`,
                height: `${dimensions.height}px`,
                left: `-${x * scalingFactor}px`,
                top: `-${y * scalingFactor}px`
            },
            cropArea: {
                width: `${cropDimensions.width}px`,
                height: `${cropDimensions.height}px`
            }
        };
    }
}
