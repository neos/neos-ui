import React, {PureComponent, PropTypes} from 'react';
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
    src: $get('ui.contentCanvas.src'),
    currentEditPreviewMode: selectors.UI.EditPreviewMode.currentEditPreviewMode
}), {
    documentInitialized: actions.UI.ContentCanvas.documentInitialized
})
@neos(globalRegistry => ({
    editPreviewModesRegistry: globalRegistry.get('editPreviewModes'),
    guestFrameRegistry: globalRegistry.get('@neos-project/neos-ui-guest-frame')
}))
export default class ContentCanvas extends PureComponent {
    static propTypes = {
        isFringeLeft: PropTypes.bool.isRequired,
        isFringeRight: PropTypes.bool.isRequired,
        isEditModePanelHidden: PropTypes.bool.isRequired,
        isFullScreen: PropTypes.bool.isRequired,
        src: PropTypes.string.isRequired,
        documentInitialized: PropTypes.func.isRequired,
        currentEditPreviewMode: PropTypes.string.isRequired,

        editPreviewModesRegistry: PropTypes.object.isRequired,
        guestFrameRegistry: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);

        this.onFrameChange = this.handleFrameChanges.bind(this);
    }

    render() {
        const {
            isFringeLeft,
            isFringeRight,
            isFullScreen,
            isEditModePanelHidden,
            src,
            currentEditPreviewMode,
            editPreviewModesRegistry,
            guestFrameRegistry
        } = this.props;
        const classNames = mergeClassNames({
            [style.contentCanvas]: true,
            [style['contentCanvas--isFringeLeft']]: isFringeLeft,
            [style['contentCanvas--isFringeRight']]: isFringeRight,
            [style['contentCanvas--isMovedDown']]: !isEditModePanelHidden,
            [style['contentCanvas--isFullScreen']]: isFullScreen
        });
        const InlineUI = guestFrameRegistry.get('InlineUIComponent');
        const currentEditPreviewModeConfiguration = editPreviewModesRegistry.get(currentEditPreviewMode);

        const inlineStyles = {};
        const width = $get('width', currentEditPreviewModeConfiguration);
        const height = $get('height', currentEditPreviewModeConfiguration);
        if (width) {
            inlineStyles.width = width;
        }
        if (height) {
            inlineStyles.height = height;
        }

        // ToDo: Is the `[data-__neos__hook]` attr used?
        return (
            <div className={classNames}>
                <div id="centerArea"/>
                <div className={style.contentCanvas__itemWrapper} style={inlineStyles} data-__neos__hook="contentCanvas">
                    <Frame
                        src={src}
                        frameBorder="0"
                        name="neos-content-main"
                        className={style.contentCanvas__contents}
                        mountTarget="#neos-new-backend-container"
                        contentDidUpdate={this.onFrameChange}
                        >
                        {InlineUI && <InlineUI/>}
                    </Frame>
                </div>
            </div>
        );
    }

    handleFrameChanges(iframeWindow, iframeDocument) {
        if (iframeDocument.__isInitialized) {
            return;
        }

        const {documentInitialized} = this.props;

        iframeDocument.__isInitialized = true;

        documentInitialized();
    }
}
