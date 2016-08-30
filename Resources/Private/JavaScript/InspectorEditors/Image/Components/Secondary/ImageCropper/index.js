import React, {Component, PropTypes} from 'react';
import ReactCrop from 'react-image-crop';
import Icon from '@neos-project/react-ui-components/lib/Icon/';
import IconButton from '@neos-project/react-ui-components/lib/IconButton/';
import TextInput from '@neos-project/react-ui-components/lib/TextInput/';
import AspectRatioDropDown from './AspectRatioDropDown/index';
import CropConfiguration from './model.js';
import style from './style.css';

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

    clearAspectRatio() {
        const {cropConfiguration} = this.state;

        this.setState({
            cropConfiguration: cropConfiguration.clearAspectRatio()
        });
    }

    render() {
        const {SecondaryInspector} = window['@Neos:HostPluginAPI'];
        const {cropConfiguration} = this.state;
        const aspectRatioLocked = false;
        const aspectRatioLockIcon = (aspectRatioLocked ? <Icon icon="lock"/> : null);
        const {sourceImage, onClose, onComplete} = this.props;
        const src = sourceImage.previewUri || '/_Resources/Static/Packages/TYPO3.Neos/Images/dummy-image.svg';

        return (
            <SecondaryInspector onClose={() => onClose()}>
                <div style={{textAlign: 'center'}}>
                    <div className={style.tools}>
                        <div className={style.aspectRatioIndicator}>
                            {cropConfiguration.aspectRatioReducedLabel.map(label => [
                                <Icon icon="crop"/>,
                                <span title={label}>{label}</span>,
                                <span>{aspectRatioLockIcon}</span>
                            ]).orSome('')}
                        </div>

                        <AspectRatioDropDown
                            placeholder="Aspect Ratio"
                            current={cropConfiguration.aspectRatioStrategy}
                            options={cropConfiguration.aspectRatioOptions}
                            onSelect={::this.setAspectRatio}
                            onClear={::this.clearAspectRatio}
                           />

                        <div className={style.dimensions}>
                            {cropConfiguration.aspectRatioDimensions.map(({width, height}) => [
                                <TextInput
                                    className={style.dimensionInput}
                                    type="number"
                                    value={width}
                                    onChange={width => this.setCustomAspectRatioDimensions(width, height)}
                                   />,
                                <IconButton
                                    icon="exchange"
                                    onClick={::this.flipAspectRatio}
                                   />,
                                <TextInput
                                    className={style.dimensionInput}
                                    type="number"
                                    value={height}
                                    onChange={height => this.setCustomAspectRatioDimensions(width, height)}
                                   />
                            ]).orSome('')}
                        </div>
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
