import {filter, map, values, merge} from 'ramda';
import {Maybe, Some, None} from 'monet';

//
// AspectRatioStrategies
//

export class NullAspectRatioStrategy {
    constructor(label) {
        this.__label = label;
    }

    get width () {
        return null;
    }

    get height () {
        return null;
    }

    get aspectRatio () {
        return Maybe.none();
    }

    get label () {
        return this.__label;
    }

    setDimensions(width, height) {
        return new CustomAspectRatioStrategy(width, height);
    }
}

export class ConfiguredAspectRatioStrategy extends NullAspectRatioStrategy {
    constructor(width, height, label) {
        super(label);
        this.__width = width;
        this.__height = height;
    }

    get width () {
        return this.__width;
    }

    get height () {
        return this.__height;
    }

    get aspectRatio () {
        return Some(this.width / this.height);
    }

    get label () {
        return this.__label || `${this.width}:${this.height}`;
    }
}

export class CustomAspectRatioStrategy extends ConfiguredAspectRatioStrategy {
    constructor(width, height) {
        super(width, height, 'Custom');
    }
}

export class OriginalAspectRatioStrategy extends NullAspectRatioStrategy {
    constructor(image) {
        super('Original');
        this.__image = image;
    }

    get width () {
        return this.__image.dimensions.width;
    }

    get height () {
        return this.__image.dimensions.height;
    }

    get aspectRatio () {
        return Some(this.width / this.height);
    }
}

export class AspectRatioOption {
    constructor(label, aspectRatioStrategyFactory) {
        this.__label = label;
        this.__aspectRatioStrategyFactory = aspectRatioStrategyFactory;
    }

    get label () {
        return this.__label;
    }

    get value () {
        return this;
    }

    getNextAspectRatioStrategy (currentAspectRatioStrategy) {
        console.log(currentAspectRatioStrategy);
        return this.__aspectRatioStrategyFactory(currentAspectRatioStrategy);
    }
}

export class CustomAspectRatioOption extends AspectRatioOption {
    constructor() {
        super(
            'Custom',
            cropConfiguration => new CustomAspectRatioStrategy(
                cropConfiguration.aspectRatioStrategy.width,
                cropConfiguration.aspectRatioStrategy.height
            )
        );
    }
}

export class OriginalAspectRatioOption extends AspectRatioOption {
    constructor() {
        super(
            'Original',
            cropConfiguration => new OriginalAspectRatioStrategy(
                cropConfiguration.image
            )
        );
    }
}

const DEFAULT_BOUNDARIES = {
    x: 0,
    y: 0,
    width: 100,
    height: 100
};

const determineInitialAspectRatioStrategy = (image, neosConfiguration) => {
    const {options} = neosConfiguration;
    const when = condition => o => condition ? Some(o) : None();
    const whenAllowOriginal = when(neosConfiguration.allowOriginal && image.aspectRatio);
    const whenIsOriginal = o => whenAllowOriginal(o)
        .bind(image.cropAspectRatio)
        .bind(aspectRatio => aspectRatio == image.aspectRatio ? Some(o) : None());
    const whenAllowCustom = when(neosConfiguration.allowCustom);

    return image.cropAspectRatio

        //
        // First, check if the aspect ratio of the currently edited image matches with one
        // of the configured aspect ratios
        //
        .bind(aspectRatio => Maybe.fromNull(
            //
            // Read out aspect ratio options and filter them
            //
            values(options).filter(o => (o.width/o.height).toFixed(2) == aspectRatio.toFixed(2))[0]
        ))
        .map(o => new ConfiguredAspectRatioStrategy(o.width, o.height, o.label))

        //
        // If no configured aspect ratio matches, check if the image maybe is cropped with
        // its original aspect ratio
        //
        .orElse(
            whenIsOriginal(new OriginalAspectRatioStrategy(image))

        )

        //
        // If the original aspect ratio does not match, assume, that a custom aspect ratio was
        // applied
        //
        .orElse(
            image.cropAdjustment
            .bind(({width, height}) => whenAllowCustom(new CustomAspectRatioStrategy(width, height)))
        )

        //
        // As last resort, assume that no aspect ratio was applied so far
        //
        .orSome(new NullAspectRatioStrategy());
};

//
// CropConfiguration
//

export default class CropConfiguration {
    constructor(image, aspectRatioOptions, aspectRatioStrategy) {
        this.__image = image;
        this.__aspectRatioOptions = aspectRatioOptions;
        this.__aspectRatioStrategy = aspectRatioStrategy;
    }

    static fromNeosConfiguration = (image, neosConfiguration) => {
        const aspectRatioOptions = []
            .concat(neosConfiguration.allowCustom ? new CustomAspectRatioOption() : [])
            .concat(neosConfiguration.allowOriginal ? new OriginalAspectRatioOption() : [])
            .concat(
                values(neosConfiguration.options).map(
                    o => {
                        const strategy = new ConfiguredAspectRatioStrategy(o.width, o.height, o.label);
                        return new AspectRatioOption(strategy.label, () => strategy);
                    }
                )
            );

        return new CropConfiguration(
            image,
            aspectRatioOptions,
            determineInitialAspectRatioStrategy(image, neosConfiguration)
        );
    };

    get aspectRatioOptions () {
        return this.__aspectRatioOptions;
    }

    get aspectRatioStrategy () {
        return this.__aspectRatioStrategy;
    }

    get aspectRatioDimensions () {
        const {width, height} = this.aspectRatioStrategy;

        return width && height ? Some({width, height}) : None();
    }

    get aspectRatioReducedLabel () {
        return this.aspectRatioDimensions.map(({width, height}) => `${width}:${height}`);
    }

    get cropInformation () {
        const boundaries = this.__image.cropAdjustment.map(c => ({
            x: c.x / this.__image.dimensions.width * 100,
            y: c.y / this.__image.dimensions.height * 100,
            width: c.width / this.__image.dimensions.width * 100,
            height: c.height / this.__image.dimensions.height * 100
        })).orSome(DEFAULT_BOUNDARIES);
        const aspectRatio = this.aspectRatioStrategy.aspectRatio
            .map(aspect => ({aspect}))
            .orSome({});

        return merge(boundaries, aspectRatio);
    }

    selectAspectRatioOption(option) {
        return new CropConfiguration(
            this.__image,
            this.__aspectRatioOptions,
            option.getNextAspectRatioStrategy(this)
        );
    }

    updateImage(image) {
        return new CropConfiguration(
            image,
            this.__aspectRatioOptions,
            this.__aspectRatioStrategy
        );
    }

    updateAspectRatioDimensions(width, height) {
        return new CropConfiguration(
            this.__image,
            this.__aspectRatioOptions,
            this.aspectRatioStrategy.setDimensions(width, height)
        )
    }

    flipAspectRatio() {
        return this.aspectRatioDimensions
            .map(({width, height}) => this.updateAspectRatioDimensions(height, width))
            .orSome(this);
    }
}
