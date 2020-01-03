import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import mergeClassNames from 'classnames';
import {AssetUpload} from '../../../../Library/index';

import {Thumbnail} from '../../Utils/index';
import {Icon} from '@neos-project/react-ui-components';
import style from './style.css';

export default class PreviewScreen extends PureComponent {
    static propTypes = {
        className: PropTypes.string,
        propertyName: PropTypes.string,
        image: PropTypes.object,
        afterUpload: PropTypes.func.isRequired,
        onFileDialogCancel: PropTypes.func.isRequired,
        onClick: PropTypes.func.isRequired,
        isLoading: PropTypes.bool.isRequired,
        isUploadEnabled: PropTypes.bool.isRequired,
        disabled: PropTypes.bool,
        accept: PropTypes.string
    };

    chooseFromLocalFileSystem() {
        this.assetUpload.chooseFromLocalFileSystem();
    }

    renderPreview() {
        const {image, onClick, disabled, className, propertyName} = this.props;

        const classNames = mergeClassNames({
            [className]: true,
            [style.thumbnail]: true,
            [style['thumbnail--disabled']]: disabled
        });

        const thumbnail = image ? Thumbnail.fromImageData(image, 273, 216) : null;
        const handleClick = () => disabled ? null : onClick;

        return (
            <div className={classNames}
                onClick={handleClick()}
                role="button"
                >
                <div className={style.thumbnail__overlay}>
                    <div className={style.cropArea} style={(thumbnail ? thumbnail.styles.cropArea : {})}>
                        <div className={style.thumbnail__overlay__icon}>
                            {thumbnail ?
                                <Icon icon="camera" size="5x" mask={['fas', 'circle']} transform="shrink-8" /> :
                                this.props.isUploadEnabled && <Icon icon="upload" size="5x" mask={['fas', 'circle']} transform="shrink-8" />
                            }
                        </div>
                        <img
                            className={(thumbnail ? style.cropArea__image : style['cropArea__image--placeholder'])}
                            src={thumbnail ? thumbnail.uri : '/_Resources/Static/Packages/Neos.Neos/Images/dummy-image.svg'}
                            style={thumbnail ? thumbnail.styles.thumbnail : {}}
                            alt={propertyName}
                            />
                    </div>
                </div>
            </div>
        );
    }

    render() {
        const {afterUpload, onFileDialogCancel, isLoading, propertyName, isUploadEnabled, accept} = this.props;

        if (isUploadEnabled) {
            return (
                <AssetUpload
                    onAfterUpload={afterUpload}
                    onFileDialogCancel={onFileDialogCancel}
                    isLoading={isLoading}
                    propertyName={propertyName}
                    ref={this.setAssetUploadReference}
                    imagesOnly={true}
                    accept={accept || 'image/*'}
                    >
                    {this.renderPreview()}
                </AssetUpload>
            );
        }

        return this.renderPreview();
    }

    setAssetUploadReference = ref => {
        this.assetUpload = ref;
    }
}
