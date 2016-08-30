import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import shallowCompare from 'react-addons-shallow-compare';
import mergeClassNames from 'classnames';
import {$transform, $get} from 'plow-js';
import Frame from '@neos-project/react-ui-components/lib/Frame/';
import style from './style.css';
import {actions} from 'Host/Redux/index';

import InlineUI from './InlineUI/index';
import registry from 'Host/Extensibility/Registry/index';

const closestContextPath = el => {
    if (!el) {
        return null;
    }

    return el.dataset.__neosNodeContextpath || closestContextPath(el.parentNode);
};

@connect($transform({
    isFringeLeft: $get('ui.leftSideBar.isHidden'),
    isFringeRight: $get('ui.rightSideBar.isHidden'),
    isFullScreen: $get('ui.fullScreen.isFullScreen'),
    src: $get('ui.contentCanvas.src')
}), {
    setGuestContext: actions.Guest.setContext,
    setContextPath: actions.UI.ContentCanvas.setContextPath,
    setPreviewUrl: actions.UI.ContentCanvas.setPreviewUrl,
    setActiveFormatting: actions.UI.ContentCanvas.setActiveFormatting,
    addNode: actions.CR.Nodes.add,
    focusNode: actions.CR.Nodes.focus,
    unFocusNode: actions.CR.Nodes.unFocus,
    hoverNode: actions.CR.Nodes.hover,
    unHoverNode: actions.CR.Nodes.unhover,
    persistChange: actions.Changes.persistChange
})
export default class ContentCanvas extends Component {
    static propTypes = {
        isFringeLeft: PropTypes.bool.isRequired,
        isFringeRight: PropTypes.bool.isRequired,
        isFullScreen: PropTypes.bool.isRequired,
        src: PropTypes.string.isRequired,
        setGuestContext: PropTypes.func.isRequired,
        setContextPath: PropTypes.func.isRequired,
        setPreviewUrl: PropTypes.func.isRequired,
        addNode: PropTypes.func.isRequired,
        setActiveFormatting: PropTypes.func.isRequired,
        focusNode: PropTypes.func.isRequired,
        unFocusNode: PropTypes.func.isRequired,
        hoverNode: PropTypes.func.isRequired,
        unHoverNode: PropTypes.func.isRequired,
        persistChange: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);

        this.onFrameChange = this.handleFrameChanges.bind(this);
    }

    shouldComponentUpdate(...args) {
        return shallowCompare(this, ...args);
    }

    render() {
        const {isFringeLeft, isFringeRight, isFullScreen, src} = this.props;
        const classNames = mergeClassNames({
            [style.contentCanvas]: true,
            [style['contentCanvas--isFringeLeft']]: isFringeLeft,
            [style['contentCanvas--isFringeRight']]: isFringeRight,
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
            focusNode,
            setGuestContext,
            setContextPath,
            setPreviewUrl,
            addNode,
            hoverNode,
            unHoverNode,
            setActiveFormatting,
            unFocusNode,
            persistChange
        } = this.props;

        //
        // First of all, set the new version of the guest frame window object to the store.
        //
        setGuestContext(iframeWindow);

        const documentInformation = iframeWindow['@Neos.Neos.Ui:DocumentInformation'];

        // TODO: convert to single action: "guestFrameChange"
        setContextPath(documentInformation.metaData.contextPath);
        setPreviewUrl(documentInformation.metaData.previewUrl);

        Object.keys(documentInformation.nodes).forEach(contextPath => {
            const node = documentInformation.nodes[contextPath];
            addNode(contextPath, node);
        });

        //
        // Initialize node components
        //
        const components = iframeDocument.querySelectorAll('[data-__neos-node-contextpath]');
        Array.prototype.forEach.call(components, node => {
            node.addEventListener('click', e => {
                const nodeContextPath = node.getAttribute('data-__neos-node-contextpath');
                const typoscriptPath = node.getAttribute('data-__neos-typoscript-path');

                focusNode(nodeContextPath, typoscriptPath);

                e.stopPropagation();
            });

            node.addEventListener('mouseenter', e => {
                const nodeContextPath = node.getAttribute('data-__neos-node-contextpath');
                const typoscriptPath = node.getAttribute('data-__neos-typoscript-path');

                hoverNode(nodeContextPath, typoscriptPath);

                e.stopPropagation();
            });
            node.addEventListener('mouseleave', e => {
                const nodeContextPath = node.getAttribute('data-__neos-node-contextpath');

                unHoverNode(nodeContextPath);

                e.stopPropagation();
            });
        });

        //
        // Initialize click outside handler
        //
        iframeDocument.body.addEventListener('click', e => {
            const clickPath = Array.prototype.slice.call(e.path);
            const isNotInsideInlineUi = clickPath.filter(node =>
                node &&
                node.getAttribute &&
                node.getAttribute('data-__neos__inlineUI')
            ).length === 0;

            if (isNotInsideInlineUi) {
                unFocusNode();
            }
        });

        const editorConfig = {
            formattingAndStyling: registry.ckEditor.formattingAndStyling.getAllAsObject(),
            onActiveFormattingChange: activeFormatting => {
                setActiveFormatting(activeFormatting);
            }
        };

        // ToDo: Throws an err.
        iframeWindow.NeosCKEditorApi.initialize(editorConfig);

        //
        // Initialize inline editors
        //
        const editors = iframeDocument.querySelectorAll('.neos-inline-editable');
        Array.prototype.forEach.call(editors, node => {
            const contextPath = closestContextPath(node);
            const propertyName = node.dataset.__neosProperty;

            // TODO: from state, read node types & configure CKeditor based on node type!

            iframeWindow.NeosCKEditorApi.createEditor(node, contents => {
                persistChange({
                    type: 'Neos.Neos.Ui:Property',
                    subject: contextPath,
                    payload: {
                        propertyName,
                        value: contents
                    }
                });
            });
        });
    }
}
