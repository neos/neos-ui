import React, {Component, PropTypes} from '@host/react';
import {Components, I18n} from '@host';
import {Maybe} from 'monet';

import style from './style.css';

const {Button} = Components;

export default class Controls extends Component {
    static propTypes = {
        chooseFromLocalFilesystemLabel: PropTypes.string,
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
            chooseFromLocalFilesystemLabel,
            onChooseFromMedia,
            onChooseFromLocalFileSystem,
            onRemove
        } = this.props;

        return (
            <div>
                <Button
                    style="small"
                    onClick={() => onChooseFromMedia()}
                    >
                   <I18n id="TYPO3.Neos:Main:media" fallback="Media"/>
                </Button>
                <Button
                    style="small"
                    onClick={() => onChooseFromLocalFileSystem()}
                    >
                   <I18n id={chooseFromLocalFilesystemLabel} fallback="Choose file"/>
                </Button>
                <Button
                    style="small"
                    onClick={() => onRemove()}
                    >
                   <I18n id="TYPO3.Neos:Main:remove" fallback="Remove"/>
                </Button>
            </div>
        );
    }

    renderisCropperVisibleButton() {
        const {onCrop} = this.props;

        return Maybe.fromNull(onCrop)
            .map(() => (
                <Button
                    style="small"
                    className={style.cropButton}
                    onClick={() => onCrop()}
                    >
                    <I18n id="TYPO3.Neos:Main:crop" fallback="Crop"/>
                </Button>
            )).orSome('');
    }
}
