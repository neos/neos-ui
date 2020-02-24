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
    focusedNodePath: selectors.CR.Nodes.focusedNodePathSelector
}), null, null, {forwardRef: true})
export default class AssetUpload extends PureComponent {
    static defaultProps = {
        propertyName: ''
    };

    static propTypes = {
        className: PropTypes.string,
        propertyName: PropTypes.string,
        isLoading: PropTypes.bool.isRequired,
        onAfterUpload: PropTypes.func.isRequired,
        onFileDialogCancel: PropTypes.func,
        siteNodePath: PropTypes.string.isRequired,
        focusedNodePath: PropTypes.string.isRequired,
        highlight: PropTypes.bool,
        children: PropTypes.any.isRequired,
        multiple: PropTypes.bool,
        multipleData: PropTypes.oneOfType([PropTypes.string, PropTypes.object, PropTypes.array]),
        imagesOnly: PropTypes.bool,
        accept: PropTypes.string
    };

    chooseFromLocalFileSystem = () => {
        this.dropzoneReference.open();
    }

    handleUpload = files => {
        const {uploadAsset} = backend.get().endpoints;
        const {onAfterUpload, focusedNodePath, siteNodePath} = this.props;
        return uploadAsset(files[0], this.props.propertyName, focusedNodePath, siteNodePath, this.getUploadMetaData()).then(res => {
            if (onAfterUpload) {
                onAfterUpload(res);
            }
        });
    }

    handleMultiUpload = files => {
        this.setState({
            isLoading: true
        });
        const {multipleData} = this.props;
        const values = multipleData ? multipleData.slice() : [];
        this.uploadMultipleFiles(0, values, files);
    }

    handleFileDialogCancel = () => {
        const {onFileDialogCancel} = this.props;
        if (onFileDialogCancel) {
            onFileDialogCancel();
        }
    }

    uploadMultipleFiles = (index, values, files) => {
        const {uploadAsset} = backend.get().endpoints;
        const {onAfterUpload, focusedNodePath, siteNodePath} = this.props;

        if (index === files.length) {
            if (onAfterUpload) {
                onAfterUpload(values);
            }
            this.setState({
                isLoading: false
            });
            return;
        }
        uploadAsset(files[index], this.props.propertyName, focusedNodePath, siteNodePath, this.getUploadMetaData()).then(res => {
            values.push(res.assetUuid);
            this.uploadMultipleFiles(index + 1, values, files);
        });
    }

    getUploadMetaData = () => {
        return this.props.imagesOnly ? 'Image' : 'Asset';
    }

    render() {
        const {isLoading, multiple, children, accept, className} = this.props;

        const classNames = mergeClassNames({
            [className]: true,
            [style.thumbnail]: true
        });

        return (
            <React.Fragment>
                {isLoading && (
                    <div className={classNames}>
                        {/* We should not put thumbnail__loader onto the icon, as animation would kill transform */}
                        <div className={style.thumbnail__loader}>
                            <Icon icon="spinner" spin={true} size="2x"/>
                        </div>
                    </div>
                )}
                {/* We should not remove Dropzone element when loading, as that would kill the upload */}
                <div className={className} style={{display: isLoading ? 'none' : 'block'}}>
                    <Dropzone
                        ref={this.setDropzoneReference}
                        accept={accept}
                        onDropAccepted={multiple ? this.handleMultiUpload : this.handleUpload}
                        onDropRejected={this.handleFileDialogCancel}
                        onFileDialogCancel={this.handleFileDialogCancel}
                        className={style.dropzone}
                        activeClassName={style['dropzone--isActive']}
                        rejectClassName={style['dropzone--isRejecting']}
                        disableClick={true}
                        disablePreview={true}
                        multiple={Boolean(multiple)}
                        >
                        {children}
                    </Dropzone>
                </div>
            </React.Fragment>
        );
    }

    setDropzoneReference = ref => {
        this.dropzoneReference = ref;
    }
}
