import React, {Component, PropTypes} from 'react';
import {Components, SecondaryInspector, api} from '@host';
import ReactCrop from 'react-image-crop';
import {Maybe} from 'monet';

import style from './style.css';
import CropConfiguration from './model.js';
import AspectRatioDropDown from './AspectRatioDropDown/index';

const {Icon, IconButton, SelectBox, TextInput} = Components;

export default class ImageCropper extends Component {
    static propTypes = {
        onClose: PropTypes.func.isRequired,
        onComplete: PropTypes.func.isRequired,
        sourceImage: PropTypes.object.isRequired,
        options: PropTypes.object
    };

    state = {
        cropConfiguration: CropConfiguration.fromNeosConfiguration(
            this.props.sourceImage,
            this.props.options.crop.aspectRatio
        )
    };

    componentWillReceiveProps(nextProps) {
        const {cropConfiguration} = this.state;

        this.setState({
            cropConfiguration: cropConfiguration.updateImage(nextProps.sourceImage)
        });
    }

    setAspectRatio(aspectRatioOption) {
        const {cropConfiguration} = this.state;

        this.setState({
            cropConfiguration: cropConfiguration.selectAspectRatioOption(aspectRatioOption)
        });
    }

    setCustomAspectRatioDimensions(width, height) {
        const {cropConfiguration} = this.state;

        this.setState({
            cropConfiguration: cropConfiguration.updateAspectRatioDimensions(width || 1, height || 1)
        });
    }

    flipAspectRatio() {
        const {cropConfiguration} = this.state;

        this.setState({
            cropConfiguration: cropConfiguration.flipAspectRatio()
        });
    }

    render() {
        const {cropConfiguration} = this.state;
        const aspectRatioLocked = false;
        const aspectRatioLockIcon = (aspectRatioLocked ? <Icon icon="lock" /> : null);
        const {sourceImage, onClose, onComplete} = this.props;
        const src = sourceImage.previewUri.orSome('/_Resources/Static/Packages/TYPO3.Neos/Images/dummy-image.svg');

        return (
            <SecondaryInspector onClose={() => onClose()}>
                <div style={{textAlign: 'center'}}>
                    <div>
                        <span>
                            <Icon icon="crop" />

                            {cropConfiguration.aspectRatioReducedLabel.map(
                                label => <span title={label}>{label}</span>
                            ).orSome('')}

                            {aspectRatioLockIcon}
                        </span>

                        <AspectRatioDropDown
                            current={cropConfiguration.aspectRatioStrategy}
                            options={cropConfiguration.aspectRatioOptions}
                            onSelect={::this.setAspectRatio}
                            />

                        {cropConfiguration.aspectRatioDimensions.map(({width, height}) => (
                            <div className={style.dimensions}>
                                <TextInput
                                    className={style.dimensionInput}
                                    type="number"
                                    value={width}
                                    onChange={width => this.setCustomAspectRatioDimensions(width, height)}
                                    />
                                <IconButton
                                    icon="exchange"
                                    onClick={::this.flipAspectRatio}
                                    />
                                <TextInput
                                    className={style.dimensionInput}
                                    type="number"
                                    value={height}
                                    onChange={height => this.setCustomAspectRatioDimensions(width, height)}
                                    />
                            </div>
                        )).orSome('')}
                    </div>

                    <ReactCrop
                        src={src}
                        crop={cropConfiguration.cropInformation}
                        onComplete={cropArea => onComplete(cropArea)}
                        />
                </div>
            </SecondaryInspector>
        );
    }
}
