import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import mergeClassNames from 'classnames';
import {$transform, $get} from 'plow-js';

import {actions, selectors} from '@neos-project/neos-ui-redux-store';
import {neos} from '@neos-project/neos-ui-decorators';

import Frame from '@neos-project/react-ui-components/src/Frame/';

import style from './style.css';

@connect($transform({
    isFringeLeft: $get('ui.leftSideBar.isHidden'),
    isFringeRight: $get('ui.rightSideBar.isHidden'),
    isFullScreen: $get('ui.fullScreen.isFullScreen'),
    isEditModePanelHidden: $get('ui.editModePanel.isHidden'),
    backgroundColor: $get('ui.contentCanvas.backgroundColor'),
    src: $get('ui.contentCanvas.src'),
    currentEditPreviewMode: selectors.UI.EditPreviewMode.currentEditPreviewMode
}), {
    startLoading: actions.UI.ContentCanvas.startLoading,
    stopLoading: actions.UI.ContentCanvas.stopLoading,
    requestRegainControl: actions.UI.ContentCanvas.requestRegainControl,
    requestLogin: actions.UI.ContentCanvas.requestLogin
})
@neos(globalRegistry => ({
    editPreviewModes: globalRegistry.get('frontendConfiguration').get('editPreviewModes'),
    guestFrameRegistry: globalRegistry.get('@neos-project/neos-ui-guest-frame')
}))
export default class ContentCanvas extends PureComponent {
    static propTypes = {
        isFringeLeft: PropTypes.bool.isRequired,
        isFringeRight: PropTypes.bool.isRequired,
        isEditModePanelHidden: PropTypes.bool.isRequired,
        isFullScreen: PropTypes.bool.isRequired,
        backgroundColor: PropTypes.string,
        src: PropTypes.string,
        startLoading: PropTypes.func.isRequired,
        stopLoading: PropTypes.func.isRequired,
        requestRegainControl: PropTypes.func.isRequired,
        requestLogin: PropTypes.func.isRequired,
        currentEditPreviewMode: PropTypes.string.isRequired,

        editPreviewModes: PropTypes.object.isRequired,
        guestFrameRegistry: PropTypes.object.isRequired
    };

    state = {
        isVisible: true,
        loadedSrc: ''
    };

    render() {
        const {
            isFringeLeft,
            isFringeRight,
            isFullScreen,
            isEditModePanelHidden,
            src,
            currentEditPreviewMode,
            editPreviewModes,
            guestFrameRegistry,
            backgroundColor
        } = this.props;
        const {isVisible} = this.state;
        const classNames = mergeClassNames({
            [style.contentCanvas]: true,
            [style['contentCanvas--isFringeLeft']]: isFringeLeft,
            [style['contentCanvas--isFringeRight']]: isFringeRight,
            [style['contentCanvas--isMovedDown']]: !isEditModePanelHidden,
            [style['contentCanvas--isFullScreen']]: isFullScreen,
            [style['contentCanvas--isHidden']]: !isVisible
        });
        const InlineUI = guestFrameRegistry.get('InlineUIComponent');
        const currentEditPreviewModeConfiguration = editPreviewModes[currentEditPreviewMode];

        const inlineStyles = {};
        const width = $get('width', currentEditPreviewModeConfiguration);
        const height = $get('height', currentEditPreviewModeConfiguration);
        if (width) {
            inlineStyles.width = width;
        }
        if (height) {
            inlineStyles.height = height;
        }

        const canvasContentStyle = {};
        if (backgroundColor) {
            canvasContentStyle.background = backgroundColor;
        }

        // ToDo: Is the `[data-__neos__hook]` attr used?
        return (
            <div className={classNames} style={canvasContentStyle}>
                <div id="centerArea"/>
                <div
                    className={style.contentCanvas__itemWrapper}
                    style={inlineStyles}
                    data-__neos__hook="contentCanvas"
                    >
                    (src && <Frame
                        src={src}
                        frameBorder="0"
                        name="neos-content-main"
                        className={style.contentCanvas__contents}
                        style={canvasContentStyle}
                        mountTarget="#neos-new-backend-container"
                        contentDidUpdate={this.onFrameChange}
                        onLoad={this.handleFrameAccess}
                        role="region"
                        aria-live="assertive"
                        >
                        {InlineUI && <InlineUI/>}
                    </Frame>)
                </div>
            </div>
        );
    }

    onFrameChange = (iframeWindow, iframeDocument) => {
        if (iframeDocument.__isInitialized) {
            return;
        }

        const {stopLoading} = this.props;

        iframeDocument.__isInitialized = true;

        stopLoading();
    }

    handleFrameAccess = iframe => {
        const {startLoading, requestRegainControl, requestLogin} = this.props;

        try {
            if (iframe) {
                // TODO: Find a more reliable way to determine login page
                if (iframe.contentWindow.document.querySelector('.neos-login-main')) {
                    //
                    // We're on the login page:
                    // Request login dialog and prevent loop
                    //
                    requestLogin();
                    return;
                }

                iframe.contentWindow.addEventListener('beforeunload', event => {
                    //
                    // If we cannot guess the link that is responsible for
                    // the unload, we should better hide the frame, until we're
                    // sure that it ends up in a consistent state.
                    //
                    if (!event.target.activeElement.getAttribute('href')) {
                        this.setState({isVisible: false});
                    }

                    startLoading();
                });

                this.setState({
                    isVisible: true,
                    loadedSrc: iframe.contentWindow.location.href
                });
            }
        } catch (err) {
            //
            // We lost access to the frame. Now we should inform the user about that
            // and take measures to restore a consistent state.
            //
            console.error(`Lost access to iframe: ${err}`);
            this.setState({isVisible: false});
            requestRegainControl(this.state.loadedSrc, err.toString());
        }
    }
}
