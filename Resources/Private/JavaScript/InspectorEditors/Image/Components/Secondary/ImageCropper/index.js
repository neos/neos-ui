import React, {Component, PropTypes} from 'react';
import {Components, SecondaryInspector, api} from '@host';
import ReactCrop from 'react-image-crop';

const {Icon, SelectBox} = Components;

const createCropInformationFromImage = image => image.cropAdjustment.map(c => ({
    x: c.x / image.dimensions.width * 100,
    y: c.y / image.dimensions.height * 100,
    width: c.width / image.dimensions.width * 100,
    height: c.height / image.dimensions.height * 100
})).orSome({
    x: 0,
    y: 0,
    width: 100,
    height: 100
});

export default class ImageCropper extends Component {
    static propTypes = {
        onClose: PropTypes.func.isRequired,
        onComplete: PropTypes.func.isRequired,
        sourceImage: PropTypes.object.isRequired,
        options: PropTypes.object
    };

    render() {
        const aspectRatioLocked = false;
        const aspectRatioReduced = '5:3';
        const aspectRatioLockIcon = (aspectRatioLocked ? <Icon icon="lock" /> : null);
        const {sourceImage, onComplete, options, onClose} = this.props;
        const src = sourceImage.previewUri.orSome('/_Resources/Static/Packages/TYPO3.Neos/Images/dummy-image.svg');
        const crop = createCropInformationFromImage(sourceImage);

        console.log(options);

        return (
            <SecondaryInspector onClose={() => onClose()}>
                <div style={{textAlign: 'center'}}>
                    <div>
                        <span>
                            <Icon icon="crop" />
                            {(aspectRatioReduced ? <span title={aspectRatioReduced}>{aspectRatioReduced}</span> : null)}
                            {aspectRatioLockIcon}
                        </span>
                        <SelectBox
                            placeholder="Aspect Ratio"
                            options={[
                                {value: '4-3', label: '4:3'},
                                {value: '16-9', label: '16:9'},
                                {value: '1-1', label: '1:1'}
                            ]}
                            />
                    </div>
                    <ReactCrop src={src} crop={crop} onComplete={cropArea => onComplete(cropArea)} />
                </div>
            </SecondaryInspector>
        );
    }
}
