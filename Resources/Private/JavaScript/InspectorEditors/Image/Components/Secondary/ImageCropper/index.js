import React, {Component, PropTypes} from 'react';
import {Components, SecondaryInspector} from '@host';
import ReactCrop from 'react-image-crop';

const {Icon} = Components;

const AspectRatioControl = () => {
    /* {{#if view.aspectRatioAllowCustom}}
     {{input valueBinding="view.aspectRatioWidth" type="number"}}
     <button {{action "exchangeAspectRatio" target="view"}}><i class="icon-exchange"></i></button>
     {{input valueBinding="view.aspectRatioHeight" type="number"}}
     {{else}}
     <input {{bindAttr value="view.aspectRatioWidth"}} type="number" readonly="readonly" />
     <input {{bindAttr value="view.aspectRatioHeight"}} type="number" readonly="readonly" />
     {{/if}}
     {{/unless}} */

    return (<div />);
};

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

// <ReactCrop src={src} crop={crop} onComplete={() => onComplete()} />

export default class ImageCropper extends Component {
    static propTypes = {
        onClose: PropTypes.func.isRequired,
        onComplete: PropTypes.func.isRequired,
        sourceImage: PropTypes.object.isRequired
    };

    render() {
        const aspectRatioLocked = false;
        const aspectRatioReduced = '5:3';
        const aspectRatioLockIcon = (aspectRatioLocked ? <Icon icon="lock" /> : null);
        const {sourceImage, onComplete, onClose} = this.props;
        const src = sourceImage.previewUri.orSome('/_Resources/Static/Packages/TYPO3.Neos/Images/dummy-image.svg');
        const crop = createCropInformationFromImage(sourceImage);

        return (
            <SecondaryInspector onClose={() => onClose()}>
                <span>
                    <Icon icon="crop" />
                    {(aspectRatioReduced ? <span title={aspectRatioReduced}>{aspectRatioReduced}</span> : null)}
                    {aspectRatioLockIcon}
                </span>
                {aspectRatioLocked ? null : <AspectRatioControl />}
                <ReactCrop src={src} crop={crop} onComplete={cropArea => onComplete(cropArea)} />
            </SecondaryInspector>
        );
    }
}
