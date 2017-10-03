import React from 'react';
import PropTypes from 'prop-types';

import style from './style.css';

const MediaDetailsScreen = props => {
    // TODO: Media package refactoring
    window.NeosMediaBrowserCallbacks = {
        close() {
            props.onClose();
        }
    };

    const uri = `/neos/media/browser/images/edit.html?asset[__identity]=${props.imageIdentity}`;

    return (
        <iframe src={uri} className={style.iframe}/>
    );
};
MediaDetailsScreen.propTypes = {
    onClose: PropTypes.func.isRequired,
    imageIdentity: PropTypes.string.isRequired
};

export default MediaDetailsScreen;
