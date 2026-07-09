import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import IconButton from '@neos-project/react-ui-components/src/IconButton/';
import {actions} from '@neos-project/neos-ui-redux-store';
import style from './style.module.css';
import {translate} from '@neos-project/neos-ui-i18n';

@connect(state => ({
    isFullScreen: state?.ui?.fullScreen?.isFullScreen
}), {
    toggleFullScreen: actions.UI.FullScreen.toggle
})
export default class FullScreenButton extends PureComponent {
    static propTypes = {
        toggleFullScreen: PropTypes.func,
        isFullScreen: PropTypes.bool.isRequired
    };

    render() {
        const {toggleFullScreen, isFullScreen} = this.props;

        return isFullScreen ? (
            <IconButton
                icon="expand"
                className={style.fullScreenClose}
                onClick={toggleFullScreen}
                aria-label={translate('Neos.Neos.Ui:Main:deactivateFullscreen', 'Deactivate Fullscreen edit mode')}
                title={translate('Neos.Neos.Ui:Main:deactivateFullscreen', 'Deactivate Fullscreen edit mode')}
                />
            ) : (
                <IconButton
                    id="neos-FullScreenButton"
                    icon="expand"
                    onClick={toggleFullScreen}
                    aria-label={translate('Neos.Neos.Ui:Main:activateFullscreen', 'Activate Fullscreen edit mode')}
                    title={translate('Neos.Neos.Ui:Main:activateFullscreen', 'Activate Fullscreen edit mode')}
                    />
            );
    }
}
