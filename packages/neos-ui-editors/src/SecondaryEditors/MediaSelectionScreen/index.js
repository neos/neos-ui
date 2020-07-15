import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {neos} from '@neos-project/neos-ui-decorators';
import {$get} from 'plow-js';

import style from './style.css';

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
        const mediaBrowserUri = $get('routes.core.modules.mediaBrowser', neos);
        return (
            <iframe name="neos-media-selection-screen" src={`${mediaBrowserUri}/assets/index.html?${this.encodeAsQueryString({constraints})}`} className={style.iframe}/>
        );
    }

    encodeAsQueryString = (obj, prefix) => {
        const str = [];
        let p;
        for (p in obj) {
            if (!Object.prototype.hasOwnProperty.call(obj, p)) {
                continue;
            }
            const k = prefix ? prefix + '[' + p + ']' : p;
            const v = obj[p];
            if (v === null) {
                continue;
            }
            str.push((typeof v === 'object') ? this.encodeAsQueryString(v, k) : encodeURIComponent(k) + '=' + encodeURIComponent(v));
        }
        return str.join('&');
    }
}

export default MediaSelectionScreen;
