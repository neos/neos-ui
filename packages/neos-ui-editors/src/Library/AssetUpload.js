import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {$get, $transform} from 'plow-js';
import {connect} from 'react-redux';
import mergeClassNames from 'classnames';
import Dropzone from 'react-dropzone';
import Icon from '@neos-project/react-ui-components/src/Icon/';
import backend from '@neos-project/neos-ui-backend-connector';
import style from './style.css';

@connect($transform({
    siteNodePath: $get('cr.nodes.siteNode')
}), null, null, {withRef: true})
export default class AssetUpload extends PureComponent {
    static propTypes = {
        isLoading: PropTypes.bool.isRequired,
        onAfterUpload: PropTypes.func.isRequired,
        siteNodePath: PropTypes.string.isRequired,
        highlight: PropTypes.bool,
        children: PropTypes.any.isRequired
    };

    constructor(props) {
        super(props);

        this.upload = this.upload.bind(this);
        this.chooseFromLocalFileSystem = this.chooseFromLocalFileSystem.bind(this);
        this.setDropzoneReference = this.setDropzoneReference.bind(this);
    }

    chooseFromLocalFileSystem() {
        this.dropzoneReference.open();
    }

    upload(files) {
        const {uploadAsset} = backend.get().endpoints;
        const {onAfterUpload, siteNodePath} = this.props;

        const siteNodeName = siteNodePath.match(/\/sites\/([^/@]*)/)[1];

        return uploadAsset(files[0], siteNodeName).then(res => {
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
                onDropAccepted={this.upload}
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

    setDropzoneReference(ref) {
        this.dropzoneReference = ref;
    }
}
