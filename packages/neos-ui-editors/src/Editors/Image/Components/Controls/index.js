import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import style from './style.css';
import IconButton from '@neos-project/react-ui-components/src/IconButton/';
import {neos} from '@neos-project/neos-ui-decorators';

@neos(globalRegistry => ({
    i18nRegistry: globalRegistry.get('i18n')
}))
export default class Controls extends PureComponent {
    static propTypes = {
        onChooseFromMedia: PropTypes.func.isRequired,
        onChooseFromLocalFileSystem: PropTypes.func.isRequired,
        onRemove: PropTypes.func,
        onCrop: PropTypes.func,
        disabled: PropTypes.bool,

        isUploadEnabled: PropTypes.bool.isRequired,
        isMediaBrowserEnabled: PropTypes.bool.isRequired,

        i18nRegistry: PropTypes.object.isRequired
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
            i18nRegistry,
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
                    title={i18nRegistry.translate('Neos.Neos:Main:media')}
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
                    title={i18nRegistry.translate('Neos.Media.Browser:Main:chooseFile')}
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
                    title={i18nRegistry.translate('Neos.Neos:Main:remove')}
                    />
            </span>
        );
    }

    renderisCropperVisibleButton() {
        const {onCrop, i18nRegistry, disabled} = this.props;

        const handleCrop = () => disabled ? null : onCrop;

        if (onCrop) {
            return (
                <IconButton
                    icon="crop"
                    size="small"
                    style="lighter"
                    className={style.cropButton}
                    onClick={handleCrop()}
                    title={i18nRegistry.translate('Neos.Neos:Main:crop')}
                    disabled={disabled}
                    />
            );
        }

        return '';
    }
}
