import React, {Component, PropTypes} from 'react';
import Button from '@neos-project/react-ui-components/lib/Button/';
import shallowCompare from 'react-addons-shallow-compare';
import style from './style.css';

export default class Controls extends Component {
    static propTypes = {
        chooseFromLocalFilesystemLabel: PropTypes.string,
        onChooseFromMedia: PropTypes.func.isRequired,
        onChooseFromLocalFileSystem: PropTypes.func.isRequired,
        onRemove: PropTypes.func.isRequired,
        onCrop: PropTypes.func
    };

    shouldComponentUpdate(...args) {
        return shallowCompare(this, ...args);
    }

    render() {
        return (
            <div>
                {this.renderIsMediaSelectionScreenVisibleButtons()}
                {this.renderisCropperVisibleButton()}
            </div>
        );
    }

    renderIsMediaSelectionScreenVisibleButtons() {
        const {I18n} = window['@Neos:HostPluginAPI'];
        const {
            chooseFromLocalFilesystemLabel,
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
                    <I18n id="TYPO3.Neos:Main:media" fallback="Media"/>
                </Button>
                <Button
                    size="small"
                    style="lighter"
                    onClick={onChooseFromLocalFileSystem}
                    >
                    <I18n id={chooseFromLocalFilesystemLabel} fallback="Choose file"/>
                </Button>
                <Button
                    size="small"
                    style="lighter"
                    onClick={onRemove}
                    >
                    <I18n id="TYPO3.Neos:Main:remove" fallback="Remove"/>
                </Button>
            </div>
        );
    }

    renderisCropperVisibleButton() {
        const {I18n} = window['@Neos:HostPluginAPI'];
        const {onCrop} = this.props;

        if (onCrop) {
            return (
                <Button
                    size="small"
                    style="lighter"
                    className={style.cropButton}
                    onClick={onCrop}
                    >
                    <I18n id="TYPO3.Neos:Main:crop" fallback="Crop"/>
                </Button>
            );
        }

        return '';
    }
}
