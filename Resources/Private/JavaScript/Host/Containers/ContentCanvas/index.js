import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
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

export let iframeWindow = null;

@connect($transform({
    isFringeLeft: $get('ui.leftSideBar.isHidden'),
    isFringeRight: $get('ui.rightSideBar.isHidden'),
    isFullScreen: $get('ui.fullScreen.isFullScreen'),
    src: $get('ui.contentCanvas.src')
}), {
    setContextPath: actions.UI.ContentCanvas.setContextPath,
    setPreviewUrl: actions.UI.ContentCanvas.setPreviewUrl,
    setActiveFormatting: actions.UI.ContentCanvas.setActiveFormatting,
    addNode: actions.CR.Nodes.add,
    focusNode: actions.CR.Nodes.focus,
    hoverNode: actions.CR.Nodes.hover,
    unhoverNode: actions.CR.Nodes.unhover
})
export default class ContentCanvas extends Component {
    static propTypes = {
        isFringeLeft: PropTypes.bool.isRequired,
        isFringeRight: PropTypes.bool.isRequired,
        isFullScreen: PropTypes.bool.isRequired,
        src: PropTypes.string.isRequired,
        setContextPath: PropTypes.func.isRequired,
        setPreviewUrl: PropTypes.func.isRequired,
        addNode: PropTypes.func.isRequired,
        setActiveFormatting: PropTypes.func.isRequired,
        focusNode: PropTypes.func.isRequired,
        hoverNode: PropTypes.func.isRequired,
        unhoverNode: PropTypes.func.isRequired
    };

    render() {
        const {isFringeLeft, isFringeRight, isFullScreen, src} = this.props;

        const classNames = mergeClassNames({
            [style.contentCanvas]: true,
            [style['contentCanvas--isFringeLeft']]: isFringeLeft,
            [style['contentCanvas--isFringeRight']]: isFringeRight,
            [style['contentCanvas--isFullScreen']]: isFullScreen
        });

        const contentChange = (_iframeWindow, iframeDocument) => {
            iframeWindow = _iframeWindow;
            const documentInformation = _iframeWindow['@Neos.Neos.Ui:DocumentInformation'];

            // TODO: convert to single action: "guestFrameChange"

            this.props.setContextPath(documentInformation.metaData.contextPath);
            this.props.setPreviewUrl(documentInformation.metaData.previewUrl);

            Object.keys(documentInformation.nodes).forEach(contextPath => {
                const node = documentInformation.nodes[contextPath];
                this.props.addNode(contextPath, node);
            });

            //
            // Initialize node components
            //
            Array.prototype.forEach.call(iframeDocument.querySelectorAll('[data-__neos-node-contextpath]'),
                dom => {
                    dom.addEventListener('click', e => {
                        const nodeContextPath = dom.attributes['data-__neos-node-contextpath'].value;
                        const typoscriptPath = dom.attributes['data-__neos-typoscript-path'].value;

                        this.props.focusNode(nodeContextPath, typoscriptPath);

                        e.stopPropagation();
                    });

                    dom.addEventListener('mouseenter', e => {
                        const nodeContextPath = dom.attributes['data-__neos-node-contextpath'].value;
                        const typoscriptPath = dom.attributes['data-__neos-typoscript-path'].value;

                        this.props.hoverNode(nodeContextPath, typoscriptPath);

                        e.stopPropagation();
                    });
                    dom.addEventListener('mouseleave', e => {
                        const nodeContextPath = dom.attributes['data-__neos-node-contextpath'].value;

                        this.props.unhoverNode(nodeContextPath);

                        e.stopPropagation();
                    });
                }
            );

            const editorConfig = {
                formattingAndStyling: registry.ckEditor.formattingAndStyling.getAllAsObject(),
                onActiveFormattingChange: activeFormatting => {
                    this.props.setActiveFormatting(activeFormatting);
                }
            };

            _iframeWindow.NeosCKEditorApi.initialize(editorConfig);

            //
            // Initialize inline editors
            //
            Array.prototype.forEach.call(iframeDocument.querySelectorAll('.neos-inline-editable'),
                dom => {
                    // const contextPath = closestContextPath(dom);
                    // const propertyName = dom.dataset.__neosProperty;

                    // TODO: from state, read node types & configure CKeditor based on node type!

                    _iframeWindow.NeosCKEditorApi.createEditor(dom, contents => {
                        console.log('Change of content:', contents);
                    });
                }
            );
        };

        return (
            <div className={classNames}>
                <div id="centerArea"/>
                <div className={style.contentCanvas__itemWrapper} data-__neos__hook="contentCanvas">
                    <Frame src={src} frameBorder="0" name="neos-content-main" className={style.contentCanvas__contents} mountTarget="#neos-new-backend-container" contentDidMount={contentChange} contentDidUpdate={contentChange}>
                        <InlineUI/>
                    </Frame>
                </div>
            </div>
        );
    }
}
