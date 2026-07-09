import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import style from './style.module.css';
import IconButton from '@neos-project/react-ui-components/src/IconButton/';
import {translate} from '@neos-project/neos-ui-i18n';

export default class Controls extends PureComponent {
    static propTypes = {
        onChooseFromMedia: PropTypes.func.isRequired,
        onChooseFromLocalFileSystem: PropTypes.func.isRequired,
        isUploadEnabled: PropTypes.bool.isRequired,
        isMediaBrowserEnabled: PropTypes.bool.isRequired
    };

    render() {
        const {isUploadEnabled, isMediaBrowserEnabled, disabled} = this.props;
        return (
            <div className={style.controls}>
                {isMediaBrowserEnabled && <IconButton
                    icon="camera"
                    size="small"
                    style="lighter"
                    onClick={disabled ? null : this.props.onChooseFromMedia}
                    className={style.button}
                    title={translate('Neos.Neos.Ui:Main:media')}
                    disabled={disabled}
                    />}
                {isUploadEnabled && <IconButton
                    icon="upload"
                    size="small"
                    style="lighter"
                    onClick={disabled ? null : this.props.onChooseFromLocalFileSystem}
                    className={style.button}
                    title={translate('Neos.Media.Browser:Main:chooseFile')}
                    disabled={disabled}
                    />}
            </div>
        );
    }
}
