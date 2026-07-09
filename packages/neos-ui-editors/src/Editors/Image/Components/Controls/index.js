import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import style from './style.module.css';
import IconButton from '@neos-project/react-ui-components/src/IconButton/';
import {translate} from '@neos-project/neos-ui-i18n';

export default class Controls extends PureComponent {
    static propTypes = {
        onChooseFromMedia: PropTypes.func.isRequired,
        onChooseFromLocalFileSystem: PropTypes.func.isRequired,
        onRemove: PropTypes.func,
        onCrop: PropTypes.func,
        disabled: PropTypes.bool,

        isUploadEnabled: PropTypes.bool.isRequired,
        isMediaBrowserEnabled: PropTypes.bool.isRequired
    };

    render() {
        return (
            <div>
                {this.renderIsMediaSelectionScreenVisibleButtons()}
                {this.renderisCropperVisibleButton()}
            </div>
        );
    }

    renderIsMediaSelectionScreenVisibleButtons() {
        const {
            onChooseFromMedia,
            onChooseFromLocalFileSystem,
            isUploadEnabled,
            isMediaBrowserEnabled,
            onRemove,
            disabled
        } = this.props;

        const handleChooseFromMedia = () => disabled ? null : onChooseFromMedia;
        const handleChooseFromLocalFileSystem = () => disabled ? null : onChooseFromLocalFileSystem;
        const handleRemove = () => disabled ? null : onRemove;

        return (
            <span>
                {isMediaBrowserEnabled &&
                <IconButton
                    icon="camera"
                    size="small"
                    style="lighter"
                    onClick={handleChooseFromMedia()}
                    className={style.button}
                    title={translate('Neos.Neos.Ui:Main:media')}
                    disabled={disabled}
                    />
                }
                {isUploadEnabled &&
                <IconButton
                    icon="upload"
                    size="small"
                    style="lighter"
                    onClick={handleChooseFromLocalFileSystem()}
                    className={style.button}
                    title={translate('Neos.Media.Browser:Main:chooseFile')}
                    disabled={disabled}
                    />
                }
                <IconButton
                    icon="times"
                    size="small"
                    style="lighter"
                    onClick={handleRemove()}
                    disabled={!onRemove || disabled}
                    className={style.button}
                    title={translate('Neos.Neos.Ui:Main:remove')}
                    />
            </span>
        );
    }

    renderisCropperVisibleButton() {
        const {onCrop, disabled} = this.props;

        const handleCrop = () => disabled ? null : onCrop;

        if (onCrop) {
            return (
                <IconButton
                    icon="crop"
                    size="small"
                    style="lighter"
                    className={style.cropButton}
                    onClick={handleCrop()}
                    title={translate('Neos.Neos.Ui:Main:crop')}
                    disabled={disabled}
                    />
            );
        }

        return '';
    }
}
