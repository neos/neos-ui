import React, {PropTypes} from 'react';
import {SecondaryInspector} from '@host';

import style from './style.css';

const MediaDetailsScreen = (props) => {
    // TODO: Media package refactoring
    window.Typo3MediaBrowserCallbacks = {
        close() {
            props.onClose();
        }
    };

    const uri = `/neos/content/images/edit.html?asset[__identity]=${props.imageIdentity}`;

    return (
        <SecondaryInspector onClose={() => props.onClose()}>
            <iframe src={uri} className={style.iframe} />
        </SecondaryInspector>
    );
};

MediaDetailsScreen.propTypes = {
    onClose: PropTypes.func.isRequired,
    imageIdentity: PropTypes.string.isRequired
};

export default MediaDetailsScreen;
