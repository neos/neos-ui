import {$get, $map, $transform} from 'plow-js';
import {Maybe} from 'monet';
import {memoize as rmemoize} from 'ramda';

export const CROP_IMAGE_ADJUSTMENT = [
    'object',
    'adjustments',
    'TYPO3\\Media\\Domain\\Model\\Adjustment\\CropImageAdjustment'
];
export const RESIZE_IMAGE_ADJUSTMENT = [
    'object',
    'adjustments',
    'TYPO3\\Media\\Domain\\Model\\Adjustment\\ResizeImageAdjustment'
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

const memoize = (obj, prop, conf) => rmemoize(conf.get.bind(obj));

export class Image {
    constructor(image) {
        this.image = image.toJS ? image.toJS() : image;
    }

    static fromImageData = imageData => new Image(imageData);

    get previewUri() {
        const {image} = this;
        return Maybe.fromNull($get('previewImageResourceUri', image));
    }

    @memoize
    get previewScalingFactor() {
        const {image} = this;
        return $get('previewDimensions.width', image) / $get('originalDimensions.width', image);
    }

    @memoize
    get dimensions() {
        const {image} = this;
        return extractOriginalDimensions(image);
    }

    @memoize
    get aspectRatio() {
        const {width, height} = this.dimensions;
        return width / height;
    }

    @memoize
    get previewDimensions() {
        const {image} = this;
        return extractPreviewDimensions(image);
    }

    @memoize
    get cropAdjustment() {
        const {image} = this;
        return Maybe.fromNull($get(CROP_IMAGE_ADJUSTMENT, image));
    }

    @memoize
    get cropAspectRatio() {
        return this.cropAdjustment.map(c => c.width / c.height);
    }

    @memoize
    get previewCropAdjustment() {
        const {cropAdjustment, previewScalingFactor} = this;
        return cropAdjustment.map($map(v => v * previewScalingFactor, []));
    }

    @memoize
    get resizeAdjustment() {
        const {image} = this;
        return Maybe.fromNull($get(RESIZE_IMAGE_ADJUSTMENT, image));
    }

    @memoize
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

    @memoize
    get scalingFactor() {
        const {image} = this;
        const {width, height} = image.previewCropAdjustment.orSome(image.previewDimensions);
        const byWidth = this.width / width;
        const byHeight = this.height / height;

        return Math.min(byWidth, byHeight);
    }

    @memoize
    get dimensions() {
        const {image, scalingFactor} = this;
        const {width, height} = image.previewDimensions;

        return {
            width: width * scalingFactor,
            height: height * scalingFactor
        };
    }

    @memoize
    get cropDimensions() {
        const {image, scalingFactor} = this;
        const {width, height} = image.previewCropAdjustment.orSome(image.previewDimensions);

        return {
            width: width * scalingFactor,
            height: height * scalingFactor
        };
    }

    @memoize
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
