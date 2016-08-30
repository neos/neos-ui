import React, {PropTypes} from 'react';
import style from './style.css';

const MediaSelectionScreen = (props) => {
    const {SecondaryInspector} = window['@Neos:HostPluginAPI'];

    // TODO: Media package refactoring
    window.Typo3MediaBrowserCallbacks = {
        assetChosen: assetIdentifier => {
            props.onComplete(assetIdentifier);
        }
    };
    // TODO: hard-coded url
    return (
        <SecondaryInspector onClose={() => props.onClose()}>
            <iframe src="/neos/content/images.html" className={style.iframe}/>
        </SecondaryInspector>
    );
};

MediaSelectionScreen.propTypes = {
    onClose: PropTypes.func.isRequired,
    onComplete: PropTypes.func.isRequired
};

export default MediaSelectionScreen;
