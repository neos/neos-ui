import React from 'react';
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

export default MediaSelectionScreen;
