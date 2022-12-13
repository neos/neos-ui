import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import ReactCrop from 'react-image-crop';

import Icon from '@neos-project/react-ui-components/src/Icon/';
import IconButton from '@neos-project/react-ui-components/src/IconButton/';
import TextInput from '@neos-project/react-ui-components/src/TextInput/';
import {neos} from '@neos-project/neos-ui-decorators';
import {$get} from 'plow-js';

import AspectRatioDropDown from './AspectRatioDropDown/index';
import CropConfiguration, {CustomAspectRatioOption, LockedAspectRatioStrategy} from './model.js';
import style from './style.css';

import './react_crop.vanilla-css';

/**
 * Calculates the greatest common divisor for given numbers a, b
 * @param a Number A
 * @param b Number B
 * @returns {*}
 */
const calculateGcdRecursive = (a, b) => b ? calculateGcdRecursive(b, a % b) : a;

class AspectRatioItem extends PureComponent {
    static propTypes = {
        key: PropTypes.any,
        width: PropTypes.number.isRequired,
        height: PropTypes.number.isRequired,
        onChange: PropTypes.func.isRequired,
        onFlipAspectRatio: PropTypes.func.isRequired,
        isLocked: PropTypes.bool
    };

    render() {
        const {width, height, key, isLocked} = this.props;

        return (
            <span key={key} className={style.dimensionsWrapper}>
                <TextInput
                    className={style.dimensionInput}
                    type="number"
                    value={width}
                    onChange={this.handleWidthInputChange}
                    disabled={isLocked}
                    />
                <IconButton
                    icon="exchange-alt"
                    disabled={isLocked}
                    onClick={this.props.onFlipAspectRatio}
                    />
                <TextInput
                    className={style.dimensionInput}
                    type="number"
                    value={height}
                    onChange={this.handleHeightInputChange}
                    disabled={isLocked}
                    />
            </span>
        );
    }

    handleWidthInputChange = val => this.handleInputChange('width', val);

    handleHeightInputChange = val => this.handleInputChange('height', val);

    handleInputChange(type, val) {
        const width = type === 'width' ? val : this.props.width;
        const height = type === 'height' ? val : this.props.height;

        this.props.onChange(Number(width), Number(height));
    }
}

@neos(globalRegistry => ({
    i18nRegistry: globalRegistry.get('i18n')
}))
export default class ImageCropper extends PureComponent {
    state = {
        cropConfiguration: CropConfiguration.fromNeosConfiguration(
            this.props.sourceImage,
            this.props.options.crop.aspectRatio
        )
    };

    static propTypes = {
        onComplete: PropTypes.func.isRequired,
        sourceImage: PropTypes.object.isRequired,
        options: PropTypes.object,
        i18nRegistry: PropTypes.object.isRequired
    };

    componentDidMount() {
        //
        // Calculate and set maximum height for the cropped image
        const containerHeight = this.containerNode.parentElement.clientHeight;
        const toolbarStyles = getComputedStyle(this.toolbarNode);
        const toolbarFullHeight = parseInt(toolbarStyles.height, 10) + parseInt(toolbarStyles['margin-top'], 10) + parseInt(toolbarStyles['margin-bottom'], 10);
        const spacing = 32;
        const height = (containerHeight - toolbarFullHeight - spacing) + 'px';
        const imageNode = this.containerNode.querySelector('.ReactCrop__image');
        const imageCopyNode = this.containerNode.querySelector('.ReactCrop__image-copy');
        imageNode.style.maxHeight = height;
        imageCopyNode.style.maxHeight = height;
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        const {cropConfiguration} = this.state;

        this.setState({
            cropConfiguration: cropConfiguration.updateImage(nextProps.sourceImage)
        });
    }

    handleSetAspectRatio = aspectRatioOption => {
        const {cropConfiguration} = this.state;
        this.setState({
            cropConfiguration: cropConfiguration.selectAspectRatioOption(aspectRatioOption)
        });
    }

    handleSetCustomAspectRatioDimensions = (width, height) => {
        const {cropConfiguration} = this.state;

        this.setState({
            cropConfiguration: cropConfiguration.updateAspectRatioDimensions(width || 1, height || 1)
        });
    }

    handleFlipAspectRatio = () => {
        const {cropConfiguration} = this.state;

        this.setState({
            cropConfiguration: cropConfiguration.flipAspectRatio()
        });
    }

    handleClearAspectRatio = () => {
        const {cropConfiguration} = this.state;

        this.setState({
            cropConfiguration: cropConfiguration.clearAspectRatio()
        });
    }

    handleCropComplete = (cropArea, cropAreaAbsolute) => {
        const {onComplete, sourceImage, options} = this.props;
        const {cropConfiguration} = this.state;
        const currentAspectRatioStrategy = cropConfiguration.aspectRatioStrategy;
        const pixelSnapping = $get('crop.aspectRatio.pixelSnapping', options);

        if (pixelSnapping && currentAspectRatioStrategy && currentAspectRatioStrategy.width && currentAspectRatioStrategy.height) {
            const imageWidth = $get('image.originalDimensions.width', sourceImage);
            const imageHeight = $get('image.originalDimensions.height', sourceImage);

            // normalize aspect ratio values by dividing by gcd
            const aspectRatioGcd = calculateGcdRecursive(currentAspectRatioStrategy.width, currentAspectRatioStrategy.height);
            const normalizedAspectRatioWidth = currentAspectRatioStrategy.width / aspectRatioGcd;
            const normalizedAspectRatioHeight = currentAspectRatioStrategy.height / aspectRatioGcd;

            // pixel perfect calculations
            const naturalCropWidth = Math.floor(imageWidth * (cropArea.width / 100) / normalizedAspectRatioWidth) * normalizedAspectRatioWidth;
            const naturalCropHeight = naturalCropWidth / normalizedAspectRatioWidth * normalizedAspectRatioHeight;

            // modify cropArea with pixel snapping values
            cropArea.width = (naturalCropWidth / imageWidth) * 100;
            cropArea.height = (naturalCropHeight / imageHeight) * 100;
        }

        onComplete(cropArea, cropAreaAbsolute);
    }

    render() {
        const {cropConfiguration} = this.state;
        const aspectRatioLocked = cropConfiguration.aspectRatioStrategy instanceof LockedAspectRatioStrategy;
        const allowCustomRatios = cropConfiguration.aspectRatioOptions.some(option => option instanceof CustomAspectRatioOption);
        const {sourceImage, i18nRegistry} = this.props;
        const src = sourceImage.previewUri || '/_Resources/Static/Packages/Neos.Neos/Images/dummy-image.svg';

        const toolbarRef = el => {
            this.toolbarNode = el;
        };
        const containerRef = el => {
            this.containerNode = el;
        };

        return (
            <div style={{textAlign: 'center'}} ref={containerRef}>
                <div ref={toolbarRef} className={style.tools}>
                    <div className={style.aspectRatioIndicator}>
                        {
                            cropConfiguration.aspectRatioReducedLabel.map((label, index) => (
                                <div key={index}>
                                    <Icon key={index} icon="crop"/>
                                    <span key={index} title={label}>{label}</span>
                                    <span key={index}> {aspectRatioLocked ? <Icon icon="lock"/> : null}</span>
                                </div>
                            )).orSome('')
                        }
                    </div>

                    {!aspectRatioLocked && <AspectRatioDropDown
                        placeholder={`${i18nRegistry.translate('Neos.Neos:Main:imageCropper__aspect-ratio-placeholder')}`}
                        current={cropConfiguration.aspectRatioStrategy}
                        options={cropConfiguration.aspectRatioOptions}
                        onSelect={this.handleSetAspectRatio}
                        onClear={this.handleClearAspectRatio}
                        />}

                    {!aspectRatioLocked && <div className={style.dimensions}>
                        {cropConfiguration.aspectRatioDimensions.map((props, index) => (
                            <AspectRatioItem
                                isLocked={!allowCustomRatios}
                                {...props}
                                onFlipAspectRatio={this.handleFlipAspectRatio}
                                onChange={this.handleSetCustomAspectRatioDimensions}
                                key={index}
                                />
                        )).orSome('')}
                    </div>}
                </div>

                <ReactCrop
                    src={src}
                    crop={cropConfiguration.cropInformation}
                    onComplete={this.handleCropComplete}
                    onAspectRatioChange={this.handleCropComplete}
                    onImageLoaded={this.handleCropComplete}
                    />
            </div>
        );
    }
}
