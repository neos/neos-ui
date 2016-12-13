import React, {PropTypes} from 'react';

import style from './style.css';

const MediaSelectionScreen = props => {
    // TODO: Media package refactoring
    window.Typo3MediaBrowserCallbacks = {
        assetChosen: assetIdentifier => {
            props.onComplete(assetIdentifier);
        }
    };

    // TODO: hard-coded url
    return (
        <iframe src="/neos/module/media/browser/image.html" className={style.iframe}/>
    );
};
MediaSelectionScreen.propTypes = {
    onComplete: PropTypes.func.isRequired
};

export default MediaSelectionScreen;
