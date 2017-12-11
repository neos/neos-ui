import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {$get, $transform} from 'plow-js';
import {connect} from 'react-redux';
import mergeClassNames from 'classnames';
import Dropzone from 'react-dropzone';
import Icon from '@neos-project/react-ui-components/src/Icon/';
import backend from '@neos-project/neos-ui-backend-connector';
import style from './style.css';
import {selectors} from '@neos-project/neos-ui-redux-store';

@connect($transform({
    siteNodePath: $get('cr.nodes.siteNode'),
    focusedNode: selectors.CR.Nodes.focusedNodePathSelector
}), null, null, {withRef: true})
export default class AssetUpload extends PureComponent {
    static defaultProps = {
        propertyName: ''
    };

    static propTypes = {
        propertyName: PropTypes.string,
        isLoading: PropTypes.bool.isRequired,
        onAfterUpload: PropTypes.func.isRequired,
        siteNodePath: PropTypes.string.isRequired,
        focusedNode: PropTypes.string.isRequired,
        highlight: PropTypes.bool,
        children: PropTypes.any.isRequired
    };

    chooseFromLocalFileSystem = () => {
        this.dropzoneReference.open();
    }

    handleUpload = files => {
        const {uploadAsset} = backend.get().endpoints;
        const {onAfterUpload, focusedNode, siteNodePath} = this.props;

        return uploadAsset(files[0], this.props.propertyName, focusedNode, siteNodePath).then(res => {
            if (onAfterUpload) {
                onAfterUpload(res);
            }
        });
    }

    render() {
        const {isLoading, highlight} = this.props;

        const classNames = mergeClassNames({
            [style.thumbnail]: true,
            [style['thumbnail--highlight']]: highlight
        });

        if (isLoading) {
            return (
                <div className={classNames}>
                    <Icon icon="spinner" spin={true} size="big" className={style.thumbnail__loader}/>
                </div>
            );
        }

        return (
            <Dropzone
                ref={this.setDropzoneReference}
                onDropAccepted={this.handleUpload}
                className={style.dropzone}
                activeClassName={style['dropzone--isActive']}
                rejectClassName={style['dropzone--isRejecting']}
                disableClick={true}
                multiple={false}
                >
                {this.props.children}
            </Dropzone>
        );
    }

    setDropzoneReference = ref => {
        this.dropzoneReference = ref;
    }
}
