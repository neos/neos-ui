import React, {Component, PropTypes} from 'react';
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
        const {
            chooseFromLocalFilesystemLabel,
            onChooseFromMedia,
            onChooseFromLocalFileSystem,
            onRemove,
            onCrop
        } = this.props;

        return (
            <div>
                   {/*isPressed={isMediaSelectionScreenVisible}*/}
                <Button
                   style="small"
                   onClick={() => onChooseFromMedia()}
                   >
                   <I18n id="TYPO3.Neos:Main:media" fallback="Media" />
                </Button>
                <Button
                   style="small"
                   onClick={() => onChooseFromLocalFileSystem()}
                   >
                   <I18n id={chooseFromLocalFilesystemLabel} fallback="Choose file" />
                </Button>
                <Button
                   style="small"
                   onClick={() => onRemove()}
                   >
                   <I18n id="TYPO3.Neos:Main:remove" fallback="Remove" />
                </Button>
                                {/*isPressed={isCropperVisible}*/}
                {
                    Maybe.fromNull(onCrop)
                        .map(onCropImage => (
                            <Button
                                style="small"
                                className={style.cropButton}
                                onClick={() => onCrop()}
                                >
                                <I18n id="TYPO3.Neos:Main:crop" fallback="Crop" />
                            </Button>
                        )).orSome('')
                }
            </div>
        );
    }
}
