import React, {Component, PropTypes} from 'react';
import {$set, $drop, $get, $transform} from 'plow-js';
import {connect} from 'react-redux';

import backend from '@neos-project/neos-ui-backend-connector';

import {PreviewScreen, Controls, Secondary} from './Components/index';
import {Image, CROP_IMAGE_ADJUSTMENT, RESIZE_IMAGE_ADJUSTMENT} from './Utils/index';

import style from './style.css';

const DEFAULT_FEATURES = {
    crop: true,
    resize: false
};

const SECONDARY_NONE = 1;
const SECONDARY_DETAILS = 2;
const SECONDARY_MEDIA = 3;
const SECONDARY_CROPPER = 4;

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
        commit: PropTypes.func.isRequired,

        options: PropTypes.object,

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
        this.handleChooseMedia = this.toggleSecondaryScreen.bind(this, SECONDARY_MEDIA);
        this.handleChooseSecondaryNone = this.toggleSecondaryScreen.bind(this, SECONDARY_NONE);
        this.handleChooseFile = this.onChooseFile.bind(this);
        this.handleRemoveFile = this.onRemoveFile.bind(this);
        this.handleMediaSelected = this.onMediaSelected.bind(this);
        this.handleMediaCrop = this.onCrop.bind(this);
        this.state = {
            secondaryScreenMode: SECONDARY_NONE,
            image: null,
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
            this.props.value &&
            nextProps.value &&
            nextProps.value.__identity &&
            nextProps.value.__identity !== this.props.value.__identity
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

        this.setState({image: nextimage});

        commit(value, {
            'Neos.UI:Hook.BeforeSave.CreateImageVariant': nextimage
        });
    }

    onResize(resizeAdjustment) {
        const {commit, value} = this.props;
        const {image} = this.state;
        const nextimage = resizeAdjustment ?
            $set(RESIZE_IMAGE_ADJUSTMENT, resizeAdjustment, image) : $drop(RESIZE_IMAGE_ADJUSTMENT, image);

        this.setState({image: nextimage});

        commit(value, {
            'Neos.UI:Hook.BeforeSave.CreateImageVariant': nextimage
        });
    }

    closeSecondaryScreen() {
        this.setState({secondaryScreenMode: SECONDARY_NONE});
    }

    toggleSecondaryScreen(mode) {
        const {secondaryScreenMode} = this.state;

        if (secondaryScreenMode === mode) {
            this.closeSecondaryScreen();
        } else {
            this.setState({secondaryScreenMode: mode});
        }
    }

    onRemoveFile() {
        const {commit, value} = this.props;

        this.closeSecondaryScreen();
        this.setState({
            image: null
        }, () => {
            commit($set('__identity', '', value));
        });
    }

    onMediaSelected(assetIdentifier) {
        const {commit, value} = this.props;
        const newAsset = $set('__identity', assetIdentifier, value);

        this.setState({
            image: null,
            isAssetLoading: true
        }, () => {
            commit(newAsset);
            this.closeSecondaryScreen();
        });
    }

    handleThumbnailClicked() {
        const imageIdentity = $get('__identity', this.props.value);

        if (imageIdentity) {
            this.toggleSecondaryScreen(SECONDARY_DETAILS);
        } else {
            this.onChooseFile();
        }
    }

    onChooseFile() {
        this.previewScreen.chooseFromLocalFileSystem();
    }

    upload(files) {
        const {uploadAsset} = backend.get().endpoints;
        const {commit, siteNodePath} = this.props;

        const siteNodeName = siteNodePath.match(/\/sites\/([^/@]*)/)[1];

        return uploadAsset(files[0], siteNodeName).then(res => {
            this.setState({image: res});
            commit(res.object);
        });
    }

    render() {
        const {
            image,
            secondaryScreenMode,
            isAssetLoading
        } = this.state;

        return (
            <div className={style.imageEditor}>
                <PreviewScreen
                    ref={this.setPreviewScreenRef}
                    image={image}
                    isLoading={isAssetLoading}
                    onDrop={this.handleFilesDrop}
                    onClick={this.handleThumbnailClicked}
                    />
                <Controls
                    onChooseFromMedia={this.handleChooseMedia}
                    onChooseFromLocalFileSystem={this.handleChooseFile}
                    onRemove={this.handleRemoveFile}
                    onCrop={this.isFeatureEnabled('crop') && (() => this.toggleSecondaryScreen(SECONDARY_CROPPER))}
                    />
                {secondaryScreenMode === SECONDARY_NONE ? '' : this.renderSecondaryScreen()}
            </div>
        );
    }

    renderSecondaryScreen() {
        const {secondaryScreenMode, image} = this.state;
        const {options} = this.props;
        const {__identity} = this.props.value;

        switch (secondaryScreenMode) {
            case SECONDARY_MEDIA:
                return (
                    <Secondary.MediaSelectionScreen
                        onClose={this.handleChooseSecondaryNone}
                        onComplete={this.handleMediaSelected}
                        />
                );

            case SECONDARY_DETAILS:
                return (
                    <Secondary.MediaDetailsScreen
                        onClose={this.handleChooseSecondaryNone}
                        imageIdentity={__identity}
                        />
                );

            case SECONDARY_CROPPER:
                return (
                    <Secondary.ImageCropper
                        sourceImage={Image.fromImageData(image)}
                        options={options}
                        onClose={this.handleChooseSecondaryNone}
                        onComplete={this.handleMediaCrop}
                        />
                );

            case SECONDARY_NONE:
            default:
                return '';
        }
    }

    setPreviewScreenRef(ref) {
        this.previewScreen = ref;
    }

    handleDrop
}
