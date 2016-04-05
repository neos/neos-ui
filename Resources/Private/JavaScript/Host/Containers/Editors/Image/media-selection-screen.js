import React, {PropTypes} from 'react';
import {
    FullscreenContentOverlay
} from 'Components/index';
import style from './style.css';

const MediaSelectionScreen = (props) => {
    window.Typo3MediaBrowserCallbacks = {
        assetChosen: assetIdentifier => {
            props.onComplete(assetIdentifier);
        }
    };
    return (<FullscreenContentOverlay onClose={props.onClose}>
        <iframe src="/neos/content/images.html" className={style.mediaSelectionScreen__iframe} />
    </FullscreenContentOverlay>);
};

MediaSelectionScreen.propTypes = {
    onClose: PropTypes.func.isRequired,
    onComplete: PropTypes.func.isRequired
};

export default MediaSelectionScreen;
