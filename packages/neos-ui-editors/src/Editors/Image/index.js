import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {$set, $drop, $get, $transform} from 'plow-js';
import {connect} from 'react-redux';

import backend from '@neos-project/neos-ui-backend-connector';
import {neos} from '@neos-project/neos-ui-decorators';

import {PreviewScreen, Controls} from './Components/index';
import {Image, CROP_IMAGE_ADJUSTMENT, RESIZE_IMAGE_ADJUSTMENT} from './Utils/index';

import style from './style.css';

const DEFAULT_FEATURES = {
    crop: true,
    resize: false
};

@neos(globalRegistry => ({
    secondaryEditorsRegistry: globalRegistry.get('inspector').get('secondaryEditors')
}))
@connect($transform({
    siteNodePath: $get('cr.nodes.siteNode')
}))
export default class ImageEditor extends Component {
    static propTypes = {
        value: PropTypes.oneOfType([
            PropTypes.shape({
                __identifier: PropTypes.string
            }),
            PropTypes.string
        ]),
        // "hooks" are the hooks specified by commit()
        hooks: PropTypes.object,

        commit: PropTypes.func.isRequired,
        renderSecondaryInspector: PropTypes.func.isRequired,
        secondaryEditorsRegistry: PropTypes.object.isRequired,

        options: PropTypes.object,
        highlight: PropTypes.bool,

        // Public API:
        // I18N key
        fileChooserLabel: PropTypes.string,

        features: PropTypes.shape({
            crop: PropTypes.bool,
            resize: PropTypes.bool
        }),

        allowedFileTypes: PropTypes.string,

        siteNode: PropTypes.string,
        siteNodePath: PropTypes.string
    };

    static defaultProps = {
        allowedFileTypes: 'jpg,jpeg,png,gif,svg'
    };

    constructor(props) {
        super(props);

        this.setPreviewScreenRef = this.setPreviewScreenRef.bind(this);
        this.handleThumbnailClicked = this.handleThumbnailClicked.bind(this);
        this.handleFilesDrop = this.upload.bind(this);
        this.handleChooseFile = this.onChooseFile.bind(this);
        this.handleRemoveFile = this.onRemoveFile.bind(this);
        this.handleMediaSelected = this.onMediaSelected.bind(this);
        this.handleMediaCrop = this.onCrop.bind(this);
        this.handleCloseSecondaryScreen = this.handleCloseSecondaryScreen.bind(this);
        this.handleChooseFromMedia = this.handleChooseFromMedia.bind(this);
        this.handleOpenImageCropper = this.handleOpenImageCropper.bind(this);
        this.state = {
            image: null,
            isImageCropperOpen: false,
            isAssetLoading: false
        };
    }

    componentDidMount() {
        const {loadImageMetadata} = backend.get().endpoints;

        if (this.props.value && this.props.value.__identity) {
            this.setState({
                isAssetLoading: true
            }, () => {
                this.loadImage = loadImageMetadata(this.props.value.__identity)
                    .then(image => {
                        this.setState({
                            image,
                            isAssetLoading: false
                        });
                    });
            });
        }

        this._isMounted = true;
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    componentWillReceiveProps(nextProps) {
        const {loadImageMetadata} = backend.get().endpoints;

        if (!nextProps.value || !nextProps.value.__identity) {
            this.setState({image: null});
        }

        //
        // Re-Load the image metadata in case a new image was selected.
        //
        if (
            nextProps.value &&
            nextProps.value.__identity &&
            nextProps.value.__identity !== (this.props.value && this.props.value.__identity)
        ) {
            loadImageMetadata(nextProps.value.__identity)
                .then(image => {
                    if (this._isMounted) {
                        this.setState({
                            image,
                            isAssetLoading: false
                        });
                    }
                });
        }
    }

    isFeatureEnabled(featureName) {
        const features = Object.assign({}, DEFAULT_FEATURES, this.props.features);
        return features[featureName];
    }

    onCrop(cropArea) {
        const {commit, value} = this.props;
        const {image} = this.state;

        const imageWidth = $get('originalDimensions.width', image);
        const imageHeight = $get('originalDimensions.height', image);
        const cropAdjustments = {
            x: Math.round(cropArea.x / 100 * imageWidth),
            y: Math.round(cropArea.y / 100 * imageHeight),
            width: Math.round(cropArea.width / 100 * imageWidth),
            height: Math.round(cropArea.height / 100 * imageHeight)
        };
        const nextimage = $set(CROP_IMAGE_ADJUSTMENT, cropAdjustments, image);

        commit(value, {
            'Neos.UI:Hook.BeforeSave.CreateImageVariant': nextimage
        });
    }

    onResize(resizeAdjustment) {
        const {commit, value} = this.props;
        const {image} = this.state;
        const nextimage = resizeAdjustment ?
            $set(RESIZE_IMAGE_ADJUSTMENT, resizeAdjustment, image) : $drop(RESIZE_IMAGE_ADJUSTMENT, image);

        commit(value, {
            'Neos.UI:Hook.BeforeSave.CreateImageVariant': nextimage
        });
    }

    handleCloseSecondaryScreen() {
        this.props.renderSecondaryInspector(undefined, undefined);
    }

    getValue() {
        return this.props.value ? this.props.value : {};
    }

    onRemoveFile() {
        const {commit} = this.props;

        this.handleCloseSecondaryScreen();
        this.setState({
            image: null
        }, () => {
            commit('');
        });
    }

    onMediaSelected(assetIdentifier) {
        const {commit} = this.props;
        const value = this.getValue();
        const newAsset = $set('__identity', assetIdentifier, value);

        this.setState({
            image: null,
            isAssetLoading: true
        }, () => {
            commit(newAsset);
            this.handleCloseSecondaryScreen();
        });
    }

    handleThumbnailClicked() {
        const {secondaryEditorsRegistry} = this.props;
        const {component: MediaDetailsScreen} = secondaryEditorsRegistry.get('Neos.Neos/Inspector/Secondary/Editors/MediaDetailsScreen');
        const imageIdentity = $get('__identity', this.props.value);

        if (imageIdentity) {
            this.props.renderSecondaryInspector('IMAGE_MEDIA_DETAILS', () =>
                <MediaDetailsScreen
                    onClose={this.handleCloseSecondaryScreen}
                    imageIdentity={imageIdentity}
                    />
            );
        } else {
            this.onChooseFile();
        }
    }

    onChooseFile() {
        this.previewScreen.chooseFromLocalFileSystem();
    }

    upload(files) {
        const {commit} = this.props;
        const {isImageCropperOpen} = this.state;

            this.setState({isAssetLoading: false, image: res}, () => {
            commit(res.object);

            if (isImageCropperOpen) {
                this.handleCloseSecondaryScreen();
                this.handleOpenImageCropper();
            }
        });
    }

    handleChooseFromMedia() {
        const {secondaryEditorsRegistry} = this.props;
        const {component: MediaSelectionScreen} = secondaryEditorsRegistry.get('Neos.Neos/Inspector/Secondary/Editors/MediaSelectionScreen');

        this.props.renderSecondaryInspector('IMAGE_SELECT_MEDIA', () =>
            <MediaSelectionScreen onComplete={this.handleMediaSelected}/>
        );
    }

    handleOpenImageCropper() {
        const {secondaryEditorsRegistry} = this.props;
        const {component: ImageCropper} = secondaryEditorsRegistry.get('Neos.Neos/Inspector/Secondary/Editors/ImageCropper');

        this.setState({isImageCropperOpen: true}, () => {
            this.props.renderSecondaryInspector('IMAGE_CROP', () => <ImageCropper
                sourceImage={Image.fromImageData(this.getUsedImage())}
                options={this.props.options}
                onComplete={this.handleMediaCrop}
                />);
        });
    }

    render() {
        const {
            isAssetLoading,
            image
        } = this.state;
        const {highlight} = this.props;

        return (
            <div className={style.imageEditor}>
                <PreviewScreen
                    ref={this.setPreviewScreenRef}
                    image={this.getUsedImage()}
                    isLoading={isAssetLoading}
                    onDrop={this.handleFilesDrop}
                    highlight={highlight}
                    onClick={this.handleThumbnailClicked}
                    />
                <Controls
                    onChooseFromMedia={this.handleChooseFromMedia}
                    onChooseFromLocalFileSystem={this.handleChooseFile}
                    onRemove={image ? this.handleRemoveFile : null}
                    onCrop={image ? this.isFeatureEnabled('crop') && this.handleOpenImageCropper : null}
                    />
            </div>
        );
    }

    getUsedImage() {
        return this.props.hooks ? this.props.hooks['Neos.UI:Hook.BeforeSave.CreateImageVariant'] : this.state.image;
    }

    setPreviewScreenRef(ref) {
        this.previewScreen = ref;
    }

    handleDrop
}
