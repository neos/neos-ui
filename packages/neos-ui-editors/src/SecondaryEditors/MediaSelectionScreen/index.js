import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {neos} from '@neos-project/neos-ui-decorators';
import {urlWithParams} from '@neos-project/utils-helpers/src/urlWithParams';

import style from './style.module.css';

@neos()
class MediaSelectionScreen extends PureComponent {
    static propTypes = {
        onComplete: PropTypes.func.isRequired,
        neos: PropTypes.object.isRequired,
        type: PropTypes.oneOf(['assets', 'images']), // deprecated in favor of constraints.mediaTypes
        constraints: PropTypes.shape({
            assetSources: PropTypes.arrayOf(PropTypes.string),
            mediaTypes: PropTypes.arrayOf(PropTypes.string)
        })
    };

    render() {
        const {onComplete, neos, type} = this.props;
        window.NeosMediaBrowserCallbacks = {
            assetChosen: assetIdentifier => {
                onComplete(assetIdentifier);
            }
        };
        let {constraints} = this.props;
        // Add media type constraint if (deprecated) "type" prop is set and media type constraint is not explicitly set already
        if (type === 'images' && !constraints.mediaTypes) {
            constraints = {...constraints, mediaTypes: ['image/*']};
        }
        const mediaBrowserUri = neos?.routes?.core?.modules?.mediaBrowser;
        return (
            <iframe name="neos-media-selection-screen" src={urlWithParams(mediaBrowserUri + '/assets/index.html', {constraints})} className={style.iframe}/>
        );
    }
}

export default MediaSelectionScreen;
