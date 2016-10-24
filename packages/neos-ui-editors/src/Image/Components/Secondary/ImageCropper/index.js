import React, {Component, PropTypes} from 'react';
import shallowCompare from 'react-addons-shallow-compare';
import ReactCrop from 'react-image-crop';

import Icon from '@neos-project/react-ui-components/lib/Icon/';
import IconButton from '@neos-project/react-ui-components/lib/IconButton/';
import TextInput from '@neos-project/react-ui-components/lib/TextInput/';
import {SecondaryInspector} from '@neos-project/neos-ui-inspector';

import AspectRatioDropDown from './AspectRatioDropDown/index';
import CropConfiguration from './model.js';
import style from './style.css';

class AspectRatioItem extends Component {
    static propTypes = {
        key: PropTypes.any,
        width: PropTypes.number.isRequired,
        height: PropTypes.number.isRequired,
        changeHandler: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);

        this.handleWidthInputChange = this.handleInputChange.bind(this, 'width');
        this.handleHeightInputChange = this.handleInputChange.bind(this, 'height');
    }

    shouldComponentUpdate(...args) {
        return shallowCompare(this, ...args);
    }

    render() {
        const {width, height, key} = this.props;

        return (
            <span key={key}>
                <TextInput
                    className={style.dimensionInput}
                    type="number"
                    value={width}
                    onChange={this.handleWidthInputChange}
                    />
                <IconButton
                    icon="exchange"
                    onClick={this.handleFlipAspectRatio}
                    />
                <TextInput
                    className={style.dimensionInput}
                    type="number"
                    value={height}
                    onChange={this.handleHeightInputChange}
                    />
            </span>
        );
    }

    handleInputChange(type, val) {
        const {width, height, changeHandler} = this.props;

        changeHandler({
            width,
            height,
            [type]: val
        });
    }
}

export default class ImageCropper extends Component {
    static propTypes = {
        onClose: PropTypes.func.isRequired,
        onComplete: PropTypes.func.isRequired,
        sourceImage: PropTypes.object.isRequired,
        options: PropTypes.object
    };

    constructor(props) {
        super(props);

        this.state = {
            cropConfiguration: CropConfiguration.fromNeosConfiguration(
                this.props.sourceImage,
                this.props.options.crop.aspectRatio
            )
        };
        this.handleSetAspectRatio = this.setAspectRatio.bind(this);
        this.handleClearAspectRatio = this.clearAspectRatio.bind(this);
        this.handleFlipAspectRatio = this.flipAspectRatio.bind(this);
    }

    shouldComponentUpdate(...args) {
        return shallowCompare(this, ...args);
    }

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

    clearAspectRatio() {
        const {cropConfiguration} = this.state;

        this.setState({
            cropConfiguration: cropConfiguration.clearAspectRatio()
        });
    }

    render() {
        const {cropConfiguration} = this.state;
        const aspectRatioLocked = false;
        const aspectRatioLockIcon = (aspectRatioLocked ? <Icon icon="lock"/> : null);
        const {sourceImage, onClose, onComplete} = this.props;
        const src = sourceImage.previewUri || '/_Resources/Static/Packages/TYPO3.Neos/Images/dummy-image.svg';

        return (
            <SecondaryInspector onClose={onClose}>
                <div style={{textAlign: 'center'}}>
                    <div className={style.tools}>
                        <div className={style.aspectRatioIndicator}>
                            {cropConfiguration.aspectRatioReducedLabel.map((label, index) => [
                                <Icon key={index} icon="crop"/>,
                                <span key={index} title={label}>{label}</span>,
                                <span key={index}>{aspectRatioLockIcon}</span>
                            ]).orSome('')}
                        </div>

                        <AspectRatioDropDown
                            placeholder="Aspect Ratio"
                            current={cropConfiguration.aspectRatioStrategy}
                            options={cropConfiguration.aspectRatioOptions}
                            onSelect={this.handleSetAspectRatio}
                            onClear={this.handleClearAspectRatio}
                            />

                        <div className={style.dimensions}>
                            {cropConfiguration.aspectRatioDimensions.map((props, index) => (
                                <AspectRatioItem {...props} key={index}/>
                            )).orSome('')}
                        </div>
                    </div>

                    <ReactCrop
                        src={src}
                        crop={cropConfiguration.cropInformation}
                        onComplete={onComplete}
                        />
                </div>
            </SecondaryInspector>
        );
    }
}
