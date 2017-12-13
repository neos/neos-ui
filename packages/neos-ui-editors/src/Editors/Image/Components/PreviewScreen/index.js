import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import Icon from '@neos-project/react-ui-components/src/Icon/';
import mergeClassNames from 'classnames';
import {AssetUpload} from '../../../../Library/index';

import {Thumbnail} from '../../Utils/index';
import style from './style.css';

export default class PreviewScreen extends PureComponent {
    static propTypes = {
        propertyName: PropTypes.string,
        image: PropTypes.object,
        afterUpload: PropTypes.func.isRequired,
        onClick: PropTypes.func.isRequired,
        isLoading: PropTypes.bool.isRequired,
        highlight: PropTypes.bool,
        isUploadEnabled: PropTypes.bool.isRequired
    };

    chooseFromLocalFileSystem() {
        this.assetUpload.chooseFromLocalFileSystem();
    }

    renderPreview() {
        const {image, onClick, highlight} = this.props;

        const classNames = mergeClassNames({
            [style.thumbnail]: true,
            [style['thumbnail--highlight']]: highlight
        });

        const thumbnail = image ? Thumbnail.fromImageData(image, 273, 216) : null;

        return (
            <div
                className={classNames}
                onClick={onClick}
                role="button"
                >
                <div className={style.cropArea} style={(thumbnail ? thumbnail.styles.cropArea : {})}>
                    <img
                        className={(thumbnail ? style.cropArea__image : style['cropArea__image--placeholder'])}
                        src={thumbnail ? thumbnail.uri : '/_Resources/Static/Packages/Neos.Neos/Images/dummy-image.svg'}
                        style={thumbnail ? thumbnail.styles.thumbnail : {}}
                        role="presentation"
                        />
                </div>
            </div>
        );
    }

    render() {
        const {afterUpload, isLoading, highlight, propertyName, isUploadEnabled} = this.props;

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

        if (isUploadEnabled) {
            return (
                <AssetUpload onAfterUpload={afterUpload} isLoading={isLoading} propertyName={propertyName} highlight={highlight} ref={this.setAssetUploadReference}>
                    {this.renderPreview()}
                </AssetUpload>
            );
        }

        return this.renderPreview();
    }

    setAssetUploadReference = ref => {
        if (ref === null) {
            this.assetUpload = null;
            return;
        }
        this.assetUpload = ref.getWrappedInstance();
    }
}
