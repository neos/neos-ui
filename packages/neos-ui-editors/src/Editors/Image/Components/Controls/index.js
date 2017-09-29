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
            onRemove,
            i18nRegistry
        } = this.props;

        return (
            <span>
                <IconButton
                    icon="camera"
                    size="small"
                    style="lighter"
                    onClick={onChooseFromMedia}
                    className={style.button}
                    title={i18nRegistry.translate('Neos.Neos:Main:media')}
                    />
                <IconButton
                    icon="upload"
                    size="small"
                    style="lighter"
                    onClick={onChooseFromLocalFileSystem}
                    className={style.button}
                    title={i18nRegistry.translate('Neos.Neos:Modules:media.chooseFile')}
                    />
                <IconButton
                    icon="remove"
                    size="small"
                    style="lighter"
                    onClick={onRemove}
                    disabled={!onRemove}
                    className={style.button}
                    title={i18nRegistry.translate('Neos.Neos:Main:remove')}
                    />
            </span>
        );
    }

    renderisCropperVisibleButton() {
        const {onCrop, i18nRegistry} = this.props;

        if (onCrop) {
            return (
                <IconButton
                    icon="crop"
                    size="small"
                    style="lighter"
                    className={style.cropButton}
                    onClick={onCrop}
                    title={i18nRegistry.translate('Neos.Neos:Main:crop')}
                    />
            );
        }

        return '';
    }
}
