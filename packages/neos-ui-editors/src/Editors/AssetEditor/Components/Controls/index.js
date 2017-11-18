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
        i18nRegistry: PropTypes.object.isRequired
    };

    render() {
        return (
            <div>
                <IconButton
                    icon="camera"
                    size="small"
                    style="lighter"
                    onClick={this.props.onChooseFromMedia}
                    className={style.button}
                    title={this.props.i18nRegistry.translate('Neos.Neos:Main:media')}
                    />
                <IconButton
                    icon="upload"
                    size="small"
                    style="lighter"
                    onClick={this.props.onChooseFromLocalFileSystem}
                    className={style.button}
                    title={this.props.i18nRegistry.translate('Neos.Media.Browser:Main:chooseFile')}
                    />
            </div>
        );
    }
}
