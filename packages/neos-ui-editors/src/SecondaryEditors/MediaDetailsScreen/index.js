import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {neos} from '@neos-project/neos-ui-decorators';
import {$get} from 'plow-js';

import style from './style.css';

@neos()
class MediaDetailsScreen extends PureComponent {
    static propTypes = {
        onClose: PropTypes.func.isRequired,
        imageIdentity: PropTypes.string.isRequired,
        neos: PropTypes.object.isRequired
    };

    render() {
        const {onClose, imageIdentity, neos} = this.props;
        let iframe;
        const setRef = ref => {
            iframe = ref;
        };
        window.NeosMediaBrowserCallbacks = {
            close() {
                // Wait for iframe to finish saving
                iframe.contentWindow.addEventListener('unload', () => {
                    onClose();
                });
            }
        };

        const mediaBrowserUri = $get('routes.core.modules.mediaBrowser', neos);

        const uri = `${mediaBrowserUri}/images/edit.html?asset[__identity]=${imageIdentity}`;

        return (
            <iframe name="neos-media-details-screen" ref={setRef} src={uri} className={style.iframe}/>
        );
    }
}

export default MediaDetailsScreen;
