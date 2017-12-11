import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {neos} from '@neos-project/neos-ui-decorators';
import {$get} from 'plow-js';

import style from './style.css';

@neos()
class MediaSelectionScreen extends PureComponent {
    static propTypes = {
        onComplete: PropTypes.func.isRequired,
        neos: PropTypes.object.isRequired
    };

    render() {
        const {onComplete, neos} = this.props;
        window.NeosMediaBrowserCallbacks = {
            assetChosen: assetIdentifier => {
                onComplete(assetIdentifier);
            }
        };

        const mediaBrowserUri = $get('routes.core.modules.mediaBrowser', neos);

        // TODO: hard-coded url
        return (
            <iframe src={mediaBrowserUri + '/assets.html'} className={style.iframe}/>
        );
    }
}

export default MediaSelectionScreen;
