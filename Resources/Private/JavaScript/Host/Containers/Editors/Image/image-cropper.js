import React, {PropTypes} from 'react';
import ReactCrop from 'react-image-crop';
import {
    Icon,
    FullscreenContentOverlay
} from 'Components/index';

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

const ImageCropper = (props) => {
    const aspectRatioLocked = false;
    const aspectRatioReduced = '5:3';

    const aspectRatioLockIcon = (aspectRatioLocked ? <Icon icon="lock" /> : null);

    return (<FullscreenContentOverlay onClose={props.onClose}>
        <span>
            <Icon icon="crop" />
            {(aspectRatioReduced ? <span title={aspectRatioReduced}>{aspectRatioReduced}</span> : null)}
            {aspectRatioLockIcon}
        </span>
        {aspectRatioLocked ? null : <AspectRatioControl />}
        <ReactCrop src={props.sourceImage} crop={props.crop} onComplete={props.onComplete}/>
    </FullscreenContentOverlay>);
};

ImageCropper.propTypes = {
    onClose: PropTypes.func.isRequired,
    onComplete: PropTypes.func.isRequired,
    crop: PropTypes.shape({
        x: PropTypes.number.isRequired,
        y: PropTypes.number.isRequired,
        width: PropTypes.number.isRequired,
        height: PropTypes.number.isRequired
    }),
    sourceImage: PropTypes.string.isRequired
};

export default ImageCropper;
