import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import reactCrop from 'react-image-crop';
import {$transform, $get} from 'plow-js';
import {CR} from 'Host/Selectors/';

@connect($transform({
    // imageLookup: CR.Images.imageLookup // TODO: does not work
    imagesByUuid: $get(['cr', 'images', 'byUuid'])
}), {
})
export default class Image extends Component {
    static propTypes = {
        //value: PropTypes.object.isRequired
    };

    render() {
        const imageIdentity = $get('__identity', this.props.value);
        if (this.props.imagesByUuid && imageIdentity) {
            const image = $get([imageIdentity], this.props.imagesByUuid);
            console.log("GET image", image);
            const uuid = $get('object.__identity', image);
            return (<div>Image loaded {uuid}</div>);
        }
        return (<div>TODO image</div>);
    }
}