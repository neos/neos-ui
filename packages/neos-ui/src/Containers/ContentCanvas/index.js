import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import mergeClassNames from 'classnames';
import {$transform, $get} from 'plow-js';

import {urlAppendParams} from '@neos-project/neos-ui-backend-connector/src/Endpoints/Helpers';
import {actions, selectors} from '@neos-project/neos-ui-redux-store';
import {neos} from '@neos-project/neos-ui-decorators';

import Frame from '@neos-project/react-ui-components/src/Frame/';

import style from './style.css';

@connect($transform({
    isFringeLeft: $get('ui.leftSideBar.isHidden'),
    isFringeRight: $get('ui.rightSideBar.isHidden'),
    isFullScreen: $get('ui.fullScreen.isFullScreen'),
    backgroundColor: $get('ui.contentCanvas.backgroundColor'),
    src: $get('ui.contentCanvas.src'),
    baseNodeType: $get('ui.pageTree.filterNodeType'),
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
        isFullScreen: PropTypes.bool.isRequired,
        backgroundColor: PropTypes.string,
        src: PropTypes.string,
        startLoading: PropTypes.func.isRequired,
        stopLoading: PropTypes.func.isRequired,
        requestRegainControl: PropTypes.func.isRequired,
        requestLogin: PropTypes.func.isRequired,
        currentEditPreviewMode: PropTypes.string.isRequired,
        baseNodeType: PropTypes.string,

        editPreviewModes: PropTypes.object.isRequired,
        guestFrameRegistry: PropTypes.object.isRequired
    };

    state = {
        isVisible: true,
        loadedSrc: ''
    };

    // Make sure we skip the loading bar update when triggered from inline
    // We don't need to put this into state
    skipNextLoaderStatusUpdate = false;

    componentDidUpdate(prevProps) {
        // Start loading as soon as the src has changed, but watch out for skipNextLoaderStatusUpdate
        if (this.props.src !== prevProps.src && !this.skipNextLoaderStatusUpdate) {
            this.props.startLoading();
        } else {
            this.skipNextLoaderStatusUpdate = false;
        }
    }

    render() {
        const {
            isFringeLeft,
            isFringeRight,
            isFullScreen,
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
            [style['contentCanvas--isFullScreen']]: isFullScreen,
            [style['contentCanvas--isHidden']]: !isVisible
        });
        const InlineUI = guestFrameRegistry.get('InlineUIComponent');
        const currentEditPreviewModeConfiguration = editPreviewModes[currentEditPreviewMode];

        const width = $get('width', currentEditPreviewModeConfiguration);
        const height = $get('height', currentEditPreviewModeConfiguration);

        const canvasContentStyle = {};
        const inlineStyles = {};
        const canvasContentOnlyStyle = {};

        if (width) {
            inlineStyles.width = width;
            canvasContentOnlyStyle.overflow = 'auto';
        }

        if (height) {
            inlineStyles.height = height;
            canvasContentOnlyStyle.overflow = 'auto';
        }

        if (currentEditPreviewModeConfiguration.backgroundColor) {
            canvasContentStyle.background = currentEditPreviewModeConfiguration.backgroundColor;
        } else if (backgroundColor) {
            canvasContentStyle.background = backgroundColor;
        }

        // ToDo: Is the `[data-__neos__hook]` attr used?
        return (
            <div className={classNames} style={{...canvasContentStyle, ...canvasContentOnlyStyle}}>
                <div id="centerArea"/>
                <div
                    className={style.contentCanvas__itemWrapper}
                    style={inlineStyles}
                    data-__neos__hook="contentCanvas"
                    >
                    {src && (<Frame
                        src={src}
                        frameBorder="0"
                        name="neos-content-main"
                        className={style.contentCanvas__contents}
                        style={canvasContentStyle}
                        mountTarget="#neos-backend-container"
                        contentDidUpdate={this.onFrameChange}
                        onLoad={this.handleFrameAccess}
                        onUnload={this.handelLoadStart}
                        role="region"
                        aria-live="assertive"
                        >
                        {InlineUI && <InlineUI/>}
                    </Frame>)}
                </div>
            </div>
        );
    }

    handelLoadStart = () => {
        this.props.startLoading();
    };

    onFrameChange = (iframeWindow, iframeDocument) => {
        if (iframeDocument.__isInitialized) {
            return;
        }

        const {stopLoading} = this.props;
        this.skipNextLoaderStatusUpdate = true;
        iframeDocument.__isInitialized = true;
        stopLoading();
    }

    handleFrameAccess = event => {
        const {requestRegainControl, requestLogin} = this.props;
        const iframe = event.target;

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

                // Append presetBaseNodeType param to all internal links
                const internalLinks = iframe.contentWindow.document.querySelectorAll('a[href*="@user-"]');
                internalLinks.forEach(link => {
                    link.addEventListener('click', () => {
                        if (this.props.baseNodeType) {
                            link.setAttribute(
                                'href',
                                urlAppendParams(link.href, {presetBaseNodeType: this.props.baseNodeType})
                            );
                        }
                    });
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
