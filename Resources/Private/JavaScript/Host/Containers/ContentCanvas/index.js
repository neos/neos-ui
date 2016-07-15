import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import mergeClassNames from 'classnames';
import {$transform, $get} from 'plow-js';
import {Frame, Button} from 'Components/index';
import style from './style.css';
import {actions} from 'Host/Redux/index';

import InlineUI from 'Guest/Containers/InlineUI/index';

@connect($transform({
    isFringeLeft: $get('ui.leftSideBar.isHidden'),
    isFringeRight: $get('ui.rightSideBar.isHidden'),
    isFullScreen: $get('ui.fullScreen.isFullScreen'),
    src: $get('ui.contentCanvas.src'),
    contextPath: $get('ui.contentCanvas.contextPath')
}), {
    setContextPath: actions.UI.ContentCanvas.setContextPath,
    setPreviewUrl: actions.UI.ContentCanvas.setPreviewUrl,
    setDocumentAndWindowReferences: actions.UI.ContentCanvas.setDocumentAndWindowReferences,
    addNode: actions.CR.Nodes.add,
    focusNode: actions.CR.Nodes.focus
})
export default class ContentCanvas extends Component {
    static propTypes = {
        isFringeLeft: PropTypes.bool.isRequired,
        isFringeRight: PropTypes.bool.isRequired,
        isFullScreen: PropTypes.bool.isRequired,
        src: PropTypes.string.isRequired,
        contextPath: PropTypes.string.isRequired,
        setContextPath: PropTypes.func.isRequired,
        setPreviewUrl: PropTypes.func.isRequired,
        addNodes: PropTypes.func.isRequired,
        setDocumentAndWindowReferences: PropTypes.func.isRequired,
        focusNode: PropTypes.func.isRequired,
    };

    render() {
        const {isFringeLeft, isFringeRight, isFullScreen, src, contextPath} = this.props;

        const classNames = mergeClassNames({
            [style.contentCanvas]: true,
            [style['contentCanvas--isFringeLeft']]: isFringeLeft,
            [style['contentCanvas--isFringeRight']]: isFringeRight,
            [style['contentCanvas--isFullScreen']]: isFullScreen
        });

        const contentChange = (iframeWindow, iframeDocument) => {
            const documentInformation = iframeWindow["@Neos.Neos.Ui:DocumentInformation"];

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
            [].slice.call(iframeDocument.querySelectorAll('[data-__neos-node-contextpath]'))
                .forEach(dom => {
                    dom.addEventListener('click', (e) => {
    	                console.log("Click", e);
                        console.log("Click on ", dom);
                        const nodeContextPath = dom.attributes["data-__neos-node-contextpath"].value;
                        const typoscriptPath = dom.attributes["data-__neos-typoscript-path"].value;
                    
                        this.props.focusNode(nodeContextPath, typoscriptPath);

                        e.stopPropagation();
                    });
                    console.log("Init node component", dom);
                    //nodeComponent(dom, ui, connection)
                });

        };

        return (
            <div className={classNames} id="neos__contentCanvas">
                <div id="centerArea" />
                <div className={style.contentCanvas__itemWrapper} data-__neos__hook="contentCanvas">
                    <Frame src={src} frameBorder="0" name="neos-content-main" className={style.contentCanvas__contents} mountTarget="#neos-new-backend-container" contentDidMount={contentChange} contentDidUpdate={contentChange}>
                        <InlineUI />
                    </Frame>
                </div>
            </div>
        );
    }
}
