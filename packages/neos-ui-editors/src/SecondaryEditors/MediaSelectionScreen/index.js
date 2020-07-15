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
        constraints: PropTypes.shape({
            assetSources: PropTypes.arrayOf(PropTypes.string),
            mediaTypes: PropTypes.arrayOf(PropTypes.string)
        })
    };

    render() {
        const {onComplete, neos, constraints} = this.props;
        window.NeosMediaBrowserCallbacks = {
            assetChosen: assetIdentifier => {
                onComplete(assetIdentifier);
            }
        };

        const mediaBrowserUri = $get('routes.core.modules.mediaBrowser', neos);
        return (
            <iframe name="neos-media-selection-screen" src={`${mediaBrowserUri}/assets/index.html?${this.encodeAsQueryString({constraints: constraints})}`} className={style.iframe}/>
        );
    }

    encodeAsQueryString = (obj, prefix) => {
        let str = [], p;
        for (p in obj) {
            if (!obj.hasOwnProperty(p)) {
                continue;
            }
            const k = prefix ? prefix + '[' + p + ']' : p, v = obj[p];
            if (v === null) {
                continue;
            }
            str.push((typeof v === 'object') ? this.encodeAsQueryString(v, k) : encodeURIComponent(k) + '=' + encodeURIComponent(v));
        }
        return str.join('&');
    }
}

export default MediaSelectionScreen;
