import React, {PureComponent, PropTypes} from 'react';
import style from './style.css';

import Button from '@neos-project/react-ui-components/lib/Button/';
import I18n from '@neos-project/neos-ui-i18n';

export default class Controls extends PureComponent {
    static propTypes = {
        onChooseFromMedia: PropTypes.func.isRequired,
        onChooseFromLocalFileSystem: PropTypes.func.isRequired,
        onRemove: PropTypes.func.isRequired,
        onCrop: PropTypes.func
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
            onRemove
        } = this.props;

        return (
            <div>
                <Button
                    size="small"
                    style="lighter"
                    onClick={onChooseFromMedia}
                    >
                    <I18n id="Neos.Neos:Main:media" fallback="Media"/>
                </Button>
                <Button
                    size="small"
                    style="lighter"
                    onClick={onChooseFromLocalFileSystem}
                    >
                    <I18n id="Neos.Neos:Modules:media.chooseFile" fallback="Choose file"/>
                </Button>
                <Button
                    size="small"
                    style="lighter"
                    onClick={onRemove}
                    >
                    <I18n id="Neos.Neos:Main:remove" fallback="Remove"/>
                </Button>
            </div>
        );
    }

    renderisCropperVisibleButton() {
        const {onCrop} = this.props;

        if (onCrop) {
            return (
                <Button
                    size="small"
                    style="lighter"
                    className={style.cropButton}
                    onClick={onCrop}
                    >
                    <I18n id="Neos.Neos:Main:crop" fallback="Crop"/>
                </Button>
            );
        }

        return '';
    }
}
