import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import mergeClassNames from 'classnames';
import produce from 'immer';
import {selectors} from '@neos-project/neos-ui-redux-store';

import backend from '@neos-project/neos-ui-backend-connector';
import {neos} from '@neos-project/neos-ui-decorators';

import {PreviewScreen, Controls, ResizeControls} from './Components/index';
import {Image} from './Utils/index';

import style from './style.module.css';

const DEFAULT_FEATURES = {
    crop: true,
    resize: false,
    mediaBrowser: true,
    upload: true
};

@connect(state => ({
    siteNodePath: state?.cr?.nodes?.siteNode,
    focusedNodePath: selectors.CR.Nodes.focusedNodePathSelector(state)
}), null, null, {forwardRef: true})
@neos(globalRegistry => ({secondaryEditorsRegistry: globalRegistry.get('inspector').get('secondaryEditors')}))
export default class ImageEditor extends Component {
    state = {
        image: null,
        isImageCropperOpen: false,
        requestOpenImageCropper: false,
        isAssetLoading: false
    };

    static propTypes = {
        // The propertyName this editor is used for, coming from the inspector
        identifier: PropTypes.string,

        value: PropTypes.oneOfType([
            PropTypes.shape({__identifier: PropTypes.string}),
            PropTypes.string
        ]),
        // "hooks" are the hooks specified by commit()
        hooks: PropTypes.object,

        commit: PropTypes.func.isRequired,
        renderSecondaryInspector: PropTypes.func.isRequired,
        secondaryEditorsRegistry: PropTypes.object.isRequired,

        options: PropTypes.object,

        // Public API:
        // I18N key
        fileChooserLabel: PropTypes.string,

        accept: PropTypes.string,

        siteNodePath: PropTypes.string.isRequired,
        focusedNodePath: PropTypes.string.isRequired
    };

    static defaultProps = {
        identifier: ''
    };

    componentDidMount() {
        const {loadImageMetadata} = backend.get().endpoints;

        if (this.props.value && this.props.value.__identity) {
            this.setState({
                isAssetLoading: true
            }, () => {
                this.loadImage = loadImageMetadata(this.props.value.__identity).then(image => {
                    if (this._isMounted) {
                        this.setState({image, isAssetLoading: false});
                    }
                });
            });
        }

        this._isMounted = true;
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        const {loadImageMetadata} = backend.get().endpoints;

        if (!nextProps.value || !nextProps.value.__identity) {
            if (this._isMounted) {
                this.setState({image: null});
            }
        }

        //
        // Re-Load the image metadata in case a new image was selected.
        //
        if (nextProps.value && nextProps.value.__identity && nextProps.value.__identity !== (this.props.value && this.props.value.__identity)) {
            loadImageMetadata(nextProps.value.__identity).then(image => {
                if (this._isMounted) {
                    this.setState({
                        image,
                        isAssetLoading: false
                    }, () => {
                        if (this._isMounted) {
                            // When forceCrop option is enabled and we were requested to do the force cropping...
                            if (this.state.requestOpenImageCropper && this.props.options?.crop?.aspectRatio?.forceCrop) {
                                this.handleCloseSecondaryScreen();
                                this.handleOpenImageCropper();
                                this.setState({requestOpenImageCropper: false});
                            } else if (this.state.isImageCropperOpen) {
                                this.handleCloseSecondaryScreen();
                                this.handleOpenImageCropper();
                            }
                        }
                    });
                }
            });
        }
    }

    isFeatureEnabled(featureName) {
        const features = Object.assign({}, DEFAULT_FEATURES, this.props.options.features);
        return features[featureName];
    }

    afterUpload = uploadResult => {
        this.props.commit(uploadResult.object);
        this.setState({requestOpenImageCropper: true, isAssetLoading: false});
    }

    handleFileDialogCancel = () => {
        this.setState({isAssetLoading: false});
    }

    handleMediaCrop = cropArea => {
        const {commit, value} = this.props;
        const {image} = this.state;

        const imageWidth = image?.originalDimensions?.width;
        const imageHeight = image?.originalDimensions?.height;
        const currentCropAdjustments = image?.object?.adjustments?.['Neos\\Media\\Domain\\Model\\Adjustment\\CropImageAdjustment'];
        const nextCropAdjustments = {
            x: Math.round(cropArea.x / 100 * imageWidth),
            y: Math.round(cropArea.y / 100 * imageHeight),
            width: Math.round(cropArea.width / 100 * imageWidth),
            height: Math.round(cropArea.height / 100 * imageHeight)
        };
        const cropAdjustmentsHaveChanged = !currentCropAdjustments ||
            currentCropAdjustments.x !== nextCropAdjustments.x ||
            currentCropAdjustments.y !== nextCropAdjustments.y ||
            currentCropAdjustments.width !== nextCropAdjustments.width ||
            currentCropAdjustments.height !== nextCropAdjustments.height;

        if (cropAdjustmentsHaveChanged) {
            const nextimage = produce(image, draft => {
                if (draft.object === undefined) {
                    draft.object = {};
                }
                if (draft.object.adjustments === undefined) {
                    draft.object.adjustments = {};
                }

                draft.object.adjustments['Neos\\Media\\Domain\\Model\\Adjustment\\CropImageAdjustment'] = nextCropAdjustments;
            });

            commit(value, {'Neos.UI:Hook.BeforeSave.CreateImageVariant': nextimage});
        }

        this.setState({isImageCropperOpen: false});
    }

    handleResize = resizeAdjustment => {
        const {commit, value} = this.props;
        const {image} = this.state;
        const nextimage = produce(image, draft => {
            if (resizeAdjustment) {
                if (draft.object === undefined) {
                    draft.object = {};
                }
                if (draft.object.adjustments === undefined) {
                    draft.object.adjustments = {};
                }

                draft.object.adjustments['Neos\\Media\\Domain\\Model\\Adjustment\\ResizeImageAdjustment'] = resizeAdjustment;
            } else {
                if (draft.object === undefined) {
                    return;
                }
                if (draft.object.adjustments === undefined) {
                    return;
                }

                delete draft.object.adjustments['Neos\\Media\\Domain\\Model\\Adjustment\\ResizeImageAdjustment'];
            }
        });
        this.setState({image: nextimage});
        commit(value, {'Neos.UI:Hook.BeforeSave.CreateImageVariant': nextimage});
    }

    handleCloseSecondaryScreen = () => {
        this.props.renderSecondaryInspector(undefined, undefined);
    }

    getValue() {
        return this.props.value ?
            this.props.value :
            {};
    }

    handleRemoveFile = () => {
        const {commit} = this.props;

        this.handleCloseSecondaryScreen();
        this.setState({
            image: null
        }, () => {
            commit('');
        });
    }

    handleMediaSelected = assetIdentifier => {
        const {commit, value} = this.props;
        const newAsset = {
            __identity: assetIdentifier
        };

        // Same image selected as before?
        if (value && value.__identity === assetIdentifier) {
            this.handleCloseSecondaryScreen();
            return;
        }

        this.setState({
            image: null,
            isAssetLoading: true
        }, () => {
            commit(newAsset);
            this.handleCloseSecondaryScreen();
            this.setState({requestOpenImageCropper: true});
        });
    }

    handleThumbnailClicked = () => {
        const {secondaryEditorsRegistry} = this.props;
        const {component: MediaDetailsScreen} = secondaryEditorsRegistry.get('Neos.Neos/Inspector/Secondary/Editors/MediaDetailsScreen');
        const imageIdentity = this.props.value?.originalAsset?.__identity || this.props.value?.__identity;

        if (imageIdentity) {
            this.props.renderSecondaryInspector('IMAGE_MEDIA_DETAILS', () => <MediaDetailsScreen onClose={this.handleCloseSecondaryScreen} imageIdentity={imageIdentity}/>);
        } else {
            this.handleChooseFile();
        }
    }

    handleChooseFile = () => {
        const {secondaryEditorsRegistry, options} = this.props;
        if (secondaryEditorsRegistry.get('Neos.Neos/Inspector/Secondary/Editors/AssetUploadScreen')) {
            // set media type constraint to "image/*" if it is not explicitly specified via options.constraints.mediaTypes
            const constraints = {...options.constraints, mediaTypes: (options.constraints && options.constraints.mediaTypes) || ['image/*']};
            const {component: AssetUploadScreen} = secondaryEditorsRegistry.get('Neos.Neos/Inspector/Secondary/Editors/AssetUploadScreen');
            const additionalData = {
                propertyName: this.props.identifier,
                focusedNodePath: this.props.focusedNodePath,
                siteNodePath: this.props.siteNodePath,
                metaData: 'Image'
            };
            this.props.renderSecondaryInspector('IMAGE_UPLOAD_MEDIA', () => <AssetUploadScreen type="images" constraints={constraints} onComplete={this.afterUpload} additionalData={additionalData}/>);
        } else {
            this.previewScreen.chooseFromLocalFileSystem();
            this.setState({isAssetLoading: true});
        }
    }

    handleChooseFromMedia = () => {
        const {secondaryEditorsRegistry, options} = this.props;
        const {component: MediaSelectionScreen} = secondaryEditorsRegistry.get('Neos.Neos/Inspector/Secondary/Editors/MediaSelectionScreen');

        // set media type constraint to "image/*" if it is not explicitly specified via options.constraints.mediaTypes
        const constraints = {...options.constraints, mediaTypes: (options.constraints && options.constraints.mediaTypes) || ['image/*']};

        this.props.renderSecondaryInspector('IMAGE_SELECT_MEDIA', () => <MediaSelectionScreen type="images" constraints={constraints || {}} onComplete={this.handleMediaSelected}/>);
    }

    handleOpenImageCropper = () => {
        const {secondaryEditorsRegistry} = this.props;
        const {component: ImageCropper} = secondaryEditorsRegistry.get('Neos.Neos/Inspector/Secondary/Editors/ImageCropper');

        this.setState({
            isImageCropperOpen: true
        }, () => {
            this.props.renderSecondaryInspector('IMAGE_CROP', () => <ImageCropper sourceImage={Image.fromImageData(this.getUsedImage())} options={this.props.options} onComplete={this.handleMediaCrop}/>);
        });
    }

    isCroppable = () => {
        const {image} = this.state;
        const mediaType = image?.mediaType;
        return this.isFeatureEnabled('crop') && image && !mediaType.includes('svg');
    }

    render() {
        const {isAssetLoading, image} = this.state;
        const {className} = this.props;
        const disabled = this.props?.options?.disabled;
        const mediaTypeConstraint = this.props?.options?.constraints?.mediaTypes;
        const accept = this.props?.options?.accept || (mediaTypeConstraint && mediaTypeConstraint.join(','));

        const classNames = mergeClassNames({
            [style.imageEditor]: true
        });

        return (<div className={classNames}>
            <PreviewScreen className={className} propertyName={this.props.identifier} ref={this.setPreviewScreenRef} image={this.getUsedImage()} isLoading={isAssetLoading} afterUpload={this.afterUpload} onFileDialogCancel={this.handleFileDialogCancel} onClick={this.handleThumbnailClicked} isUploadEnabled={this.isFeatureEnabled('upload')} disabled={disabled} accept={accept}/>
            <Controls onChooseFromMedia={this.handleChooseFromMedia} onChooseFromLocalFileSystem={this.handleChooseFile} isUploadEnabled={this.isFeatureEnabled('upload')} isMediaBrowserEnabled={this.isFeatureEnabled('mediaBrowser')} onRemove={image ?
                    this.handleRemoveFile :
                    null} onCrop={this.isCroppable() ?
                    this.handleOpenImageCropper :
                    null} disabled={disabled}/>
            {this.isFeatureEnabled('resize') ? (
                <ResizeControls
                    onChange={this.handleResize}
                    resizeAdjustment={image?.object?.adjustments?.['Neos\\Media\\Domain\\Model\\Adjustment\\ResizeImageAdjustment']}
                    imageDimensions={{
                        width: image?.originalDimensions?.width,
                        height: image?.originalDimensions?.height
                    }}
                    disabled={disabled}
                />
            ) : null}
        </div>);
    }

    getUsedImage() {
        return this.props.hooks ?
            this.props.hooks['Neos.UI:Hook.BeforeSave.CreateImageVariant'] :
            this.state.image;
    }

    setPreviewScreenRef = ref => {
        this.previewScreen = ref;
    }
}
