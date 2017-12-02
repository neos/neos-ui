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
        children: PropTypes.any.isRequired,
        multiple: PropTypes.bool,
        multipleData: PropTypes.oneOfType([PropTypes.string, PropTypes.object, PropTypes.array])
    };

    chooseFromLocalFileSystem = () => {
        this.dropzoneReference.open();
    }

    handleUpload = files => {
        const {uploadAsset} = backend.get().endpoints;
        const {onAfterUpload, focusedNode, siteNodePath} = this.props;
        // TODO: watch out, this will only handle image uploads!
        return uploadAsset(files[0], this.props.propertyName, focusedNode, siteNodePath).then(res => {
            if (onAfterUpload) {
                onAfterUpload(res);
            }
        });
    }

    handleMultiUpload = files => {
        this.setState({
            isLoading: true
        });
        const index = files.length;
        const {multipleData} = this.props;
        const values = multipleData ? multipleData.slice() : [];
        this.uploadMultipleFiles(index, values, files);
    }

    uploadMultipleFiles(index, values, files) {
        index--;
        const {uploadAsset} = backend.get().endpoints;
        const {onAfterUpload, siteNodePath} = this.props;
        const siteNodeName = siteNodePath.match(/\/sites\/([^/@]*)/)[1];

        if (index < 0) {
            if (onAfterUpload) {
                onAfterUpload(values);
            }
            this.setState({
                isLoading: false
            });
            return;
        }
        uploadAsset(files[index], siteNodeName, 'Asset').then(res => {
            values.push(res.assetUuid);
            this.uploadMultipleFiles(index, values, files);
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
                onDropAccepted={this.props.multiple ? this.handleMultiUpload : this.handleUpload}
                className={style.dropzone}
                activeClassName={style['dropzone--isActive']}
                rejectClassName={style['dropzone--isRejecting']}
                disableClick={true}
                multiple={!!this.props.multiple}
                >
                {this.props.children}
            </Dropzone>
        );
    }

    setDropzoneReference = ref => {
        this.dropzoneReference = ref;
    }
}
