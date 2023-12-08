import {Maybe} from 'monet';

const DEFAULT_OFFSET = {x: 0, y: 0};

const extractOriginalDimensions = image => ({
    width: image?.originalDimensions?.width,
    height: image?.originalDimensions?.height
});

const extractPreviewDimensions = image => ({
    width: image?.previewDimensions?.width,
    height: image?.previewDimensions?.height
});

export class Image {
    constructor(image) {
        this.image = image;
    }

    static fromImageData = imageData => new Image(imageData);

    get previewUri() {
        const {image} = this;
        return image?.previewImageResourceUri;
    }

    get previewScalingFactor() {
        const {image} = this;
        return image?.previewDimensions?.width / image?.originalDimensions?.width;
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
        return Maybe.fromNull(
            image?.object?.adjustments?.['Neos\\Media\\Domain\\Model\\Adjustment\\CropImageAdjustment'] ?? null
        );
    }

    get cropAspectRatio() {
        return this.cropAdjustment.map(c => c.width / c.height);
    }

    get previewCropAdjustment() {
        const {cropAdjustment, previewScalingFactor} = this;
        return cropAdjustment.map(cropAdjustment => Object.fromEntries(
            Object.entries(cropAdjustment).map(
                ([key, value]) => [key, value * previewScalingFactor]
            )
        ));
    }

    get resizeAdjustment() {
        const {image} = this;
        return Maybe.fromNull(
            image?.object?.adjustments?.['Neos\\Media\\Domain\\Model\\Adjustment\\ResizeImageAdjustment'] ?? null
        );
    }

    get previewResizeAdjustment() {
        const {resizeAdjustment, previewScalingFactor} = this;
        return resizeAdjustment.map(resizeAdjustment => Object.fromEntries(
            Object.entries(resizeAdjustment).map(
                ([key, value]) => [key, value * previewScalingFactor]
            )
        ));
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
