import React, {PureComponent, PropTypes} from 'react';
import style from './style.css';

import IconButton from '@neos-project/react-ui-components/lib/IconButton/';

export default class Controls extends PureComponent {
    static propTypes = {
        onChooseFromMedia: PropTypes.func.isRequired,
        onChooseFromLocalFileSystem: PropTypes.func.isRequired,
        onRemove: PropTypes.func.isRequired,
        onCrop: PropTypes.func,
        translate: PropTypes.func.isRequired
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
            translate
        } = this.props;

        return (
            <span>
                <IconButton
                    icon="camera"
                    size="small"
                    style="lighter"
                    onClick={onChooseFromMedia}
                    className={style.button}
                    title={translate('Neos.Neos:Main:media')}
                    />
                <IconButton
                    icon="upload"
                    size="small"
                    style="lighter"
                    onClick={onChooseFromLocalFileSystem}
                    className={style.button}
                    title={translate('Neos.Neos:Modules:media.chooseFile')}
                    />
                <IconButton
                    icon="remove"
                    size="small"
                    style="lighter"
                    onClick={onRemove}
                    className={style.button}
                    title={translate('Neos.Neos:Main:remove')}
                    />
            </span>
        );
    }

    renderisCropperVisibleButton() {
        const {onCrop, translate} = this.props;

        if (onCrop) {
            return (
                <IconButton
                    icon="crop"
                    size="small"
                    style="lighter"
                    className={style.cropButton}
                    onClick={onCrop}
                    title={translate('Neos.Neos:Main:crop')}
                    />
            );
        }

        return '';
    }
}
