import React, {PropTypes} from 'react';

import style from './style.css';

const MediaDetailsScreen = props => {
    // TODO: Media package refactoring
    window.Typo3MediaBrowserCallbacks = {
        close() {
            props.onClose();
        }
    };

    const uri = `/neos/content/images/edit.html?asset[__identity]=${props.imageIdentity}`;

    return (
        <iframe src={uri} className={style.iframe}/>
    );
};
MediaDetailsScreen.propTypes = {
    onClose: PropTypes.func.isRequired,
    imageIdentity: PropTypes.string.isRequired
};

export default MediaDetailsScreen;
