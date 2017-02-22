import React, {PureComponent, PropTypes} from 'react';
import {connect} from 'react-redux';
import mergeClassNames from 'classnames';
import {$transform, $get} from 'plow-js';

import {actions, selectors} from '@neos-project/neos-ui-redux-store';
import {neos} from '@neos-project/neos-ui-decorators';

import Frame from '@neos-project/react-ui-components/lib/Frame/';

import style from './style.css';
import InlineUI from './InlineUI/index';
import {initializeHoverHandlersInIFrame, initializeCkEditorForDomNode} from './Helpers/index';

@connect($transform({
    isFringeLeft: $get('ui.leftSideBar.isHidden'),
    isFringeRight: $get('ui.rightSideBar.isHidden'),
    isFullScreen: $get('ui.fullScreen.isFullScreen'),
    isEditModePanelHidden: $get('ui.editModePanel.isHidden'),
    src: $get('ui.contentCanvas.src'),
    byContextPathDynamicAccess: state => contextPath => selectors.CR.Nodes.byContextPathSelector(contextPath)(state)
}), {
    setGuestContext: actions.Guest.setContext,
    setContextPath: actions.UI.ContentCanvas.setContextPath,
    setPreviewUrl: actions.UI.ContentCanvas.setPreviewUrl,
    stopLoading: actions.UI.ContentCanvas.stopLoading,
    setActiveDimensions: actions.CR.ContentDimensions.setActive,
    formattingUnderCursor: actions.UI.ContentCanvas.formattingUnderCursor,
    setCurrentlyEditedPropertyName: actions.UI.ContentCanvas.setCurrentlyEditedPropertyName,
    addNodes: actions.CR.Nodes.add,
    focusNode: actions.CR.Nodes.focus,
    unFocusNode: actions.CR.Nodes.unFocus,
    persistChange: actions.Changes.persistChange
})
@neos(globalRegistry => ({
    globalRegistry,
    formattingRulesRegistry: globalRegistry.get('ckEditor').get('formattingRules')
}))
export default class ContentCanvas extends PureComponent {
    static propTypes = {
        isFringeLeft: PropTypes.bool.isRequired,
        isFringeRight: PropTypes.bool.isRequired,
        isEditModePanelHidden: PropTypes.bool.isRequired,
        isFullScreen: PropTypes.bool.isRequired,
        src: PropTypes.string.isRequired,
        setGuestContext: PropTypes.func.isRequired,
        setContextPath: PropTypes.func.isRequired,
        setPreviewUrl: PropTypes.func.isRequired,
        stopLoading: PropTypes.func.isRequired,
        setActiveDimensions: PropTypes.func.isRequired,
        addNodes: PropTypes.func.isRequired,
        formattingUnderCursor: PropTypes.func.isRequired,
        setCurrentlyEditedPropertyName: PropTypes.func.isRequired,
        focusNode: PropTypes.func.isRequired,
        unFocusNode: PropTypes.func.isRequired,
        persistChange: PropTypes.func.isRequired,
        byContextPathDynamicAccess: PropTypes.func.isRequired,

        globalRegistry: PropTypes.object.isRequired,
        formattingRulesRegistry: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);

        this.onFrameChange = this.handleFrameChanges.bind(this);
    }

    render() {
        const {isFringeLeft, isFringeRight, isFullScreen, isEditModePanelHidden, src} = this.props;
        const classNames = mergeClassNames({
            [style.contentCanvas]: true,
            [style['contentCanvas--isFringeLeft']]: isFringeLeft,
            [style['contentCanvas--isFringeRight']]: isFringeRight,
            [style['contentCanvas--isMovedDown']]: !isEditModePanelHidden,
            [style['contentCanvas--isFullScreen']]: isFullScreen
        });

        // ToDo: Is the `[data-__neos__hook]` attr used?
        return (
            <div className={classNames}>
                <div id="centerArea"/>
                <div className={style.contentCanvas__itemWrapper} data-__neos__hook="contentCanvas">
                    <Frame
                        src={src}
                        frameBorder="0"
                        name="neos-content-main"
                        className={style.contentCanvas__contents}
                        mountTarget="#neos-new-backend-container"
                        contentDidMount={this.onFrameChange}
                        contentDidUpdate={this.onFrameChange}
                        >
                        <InlineUI/>
                    </Frame>
                </div>
            </div>
        );
    }

    handleFrameChanges(iframeWindow, iframeDocument) {
        if (iframeDocument.__isInitialized) {
            return;
        }

        iframeDocument.__isInitialized = true;

        const {
            setGuestContext,
            setContextPath,
            setPreviewUrl,
            setActiveDimensions,
            addNodes,
            stopLoading
        } = this.props;

        stopLoading();

        //
        // First of all, set the new version of the guest frame window object to the store.
        //
        setGuestContext(iframeWindow);

        const documentInformation = iframeWindow['@Neos.Neos.Ui:DocumentInformation'];

        // TODO: convert to single action: "guestFrameChange"

        // Add nodes before setting the new context path to prevent action ordering issues -> THIS WILL UPDATE OUR OWN PROPS!!!
        const nodes = iframeWindow['@Neos.Neos.Ui:Nodes'];
        nodes[documentInformation.metaData.contextPath] = documentInformation.metaData.documentNodeSerialization;
        addNodes(nodes);

        setContextPath(documentInformation.metaData.contextPath, documentInformation.metaData.siteNode);
        setPreviewUrl(documentInformation.metaData.previewUrl);
        setActiveDimensions(documentInformation.metaData.contentDimensions.active);

        // WARNING: we need to initialize byContextPathDynamicAccess AFTER addNodes from above; otherwise the access function
        // will be based on the OLD state, and thus NOT return the new nodes...
        const {
            focusNode,
            formattingUnderCursor,
            setCurrentlyEditedPropertyName,
            unFocusNode,
            byContextPathDynamicAccess,
            persistChange,
            formattingRulesRegistry,
            globalRegistry
        } = this.props;

        //
        // Initialize node components
        //
        const components = iframeDocument.querySelectorAll('[data-__neos-node-contextpath]');
        Array.prototype.forEach.call(components, node => {
            const contextPath = node.getAttribute('data-__neos-node-contextpath');
            const isHidden = $get([contextPath, 'properties', '_hidden'], nodes);

            if (isHidden) {
                node.classList.add(style.markHiddenNodeAsHidden);
            }

            initializeHoverHandlersInIFrame(node, iframeDocument);
        });

        //
        // Initialize click outside handler
        //
        iframeDocument.body.addEventListener('click', e => {
            const clickPath = Array.prototype.slice.call(e.path);
            const isInsideInlineUi = clickPath.filter(domNode =>
                domNode &&
                domNode.getAttribute &&
                domNode.getAttribute('data-__neos__inlineUI')
            ).length > 0;

            const selectedDomNode = clickPath.find(domNode => domNode && domNode.getAttribute && domNode.getAttribute('data-__neos-node-contextpath'));

            if (isInsideInlineUi) {
                // Do nothing, everything OK!
            } else if (selectedDomNode) {
                const contextPath = selectedDomNode.getAttribute('data-__neos-node-contextpath');
                const fusionPath = selectedDomNode.getAttribute('data-__neos-fusion-path');

                focusNode(contextPath, fusionPath);
            } else {
                unFocusNode();
            }
        });

        const editorConfig = {
            formattingRules: formattingRulesRegistry.getAllAsObject(),
            setFormattingUnderCursor: formattingUnderCursor,
            setCurrentlyEditedPropertyName
        };

        iframeWindow.NeosCKEditorApi.initialize(editorConfig);

        //
        // Initialize inline editors
        //
        initializeCkEditorForDomNode(iframeDocument, {
            byContextPathDynamicAccess,
            globalRegistry,
            persistChange
        });
    }
}
