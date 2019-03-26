import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {$transform, $get} from 'plow-js';
import IconButton from '@neos-project/react-ui-components/src/IconButton/';
import {actions} from '@neos-project/neos-ui-redux-store';
import {neos} from '@neos-project/neos-ui-decorators';
import style from './style.css';

@neos(globalRegistry => ({
    i18nRegistry: globalRegistry.get('i18n')
}))
@connect($transform({
    isFullScreen: $get('ui.fullScreen.isFullScreen')
}), {
    toggleFullScreen: actions.UI.FullScreen.toggle
})
export default class FullScreenButton extends PureComponent {
    static propTypes = {
        toggleFullScreen: PropTypes.func,
        i18nRegistry: PropTypes.object.isRequired,
        isFullScreen: PropTypes.bool.isRequired
    };

    render() {
        const {toggleFullScreen, i18nRegistry, isFullScreen} = this.props;

        return isFullScreen ? (
            <IconButton
                icon="expand"
                className={style.fullScreenClose}
                onClick={toggleFullScreen}
                aria-label={i18nRegistry.translate('Neos.Neos:Main:deactivateFullscreen', 'Deactivate Fullscreen edit mode')}
                title={i18nRegistry.translate('Neos.Neos:Main:deactivateFullscreen', 'Deactivate Fullscreen edit mode')}
                />
            ) : (
                <IconButton
                    id="neos-FullScreenButton"
                    icon="expand"
                    onClick={toggleFullScreen}
                    aria-label={i18nRegistry.translate('Neos.Neos:Main:activateFullscreen', 'Activate Fullscreen edit mode')}
                    title={i18nRegistry.translate('Neos.Neos:Main:activateFullscreen', 'Activate Fullscreen edit mode')}
                    />
            );
    }
}
