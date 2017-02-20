import React, {PureComponent, PropTypes} from 'react';
import {connect} from 'react-redux';
import mergeClassNames from 'classnames';
import {$transform, $get} from 'plow-js';

import {actions, selectors} from '@neos-project/neos-ui-redux-store';
import {neos} from '@neos-project/neos-ui-decorators';
import unescape from 'lodash.unescape';
import {i18nService} from '@neos-project/neos-ui-i18n';

import Frame from '@neos-project/react-ui-components/lib/Frame/';

import style from './style.css';
import InlineUI from './InlineUI/index';
import {calculateEnabledFormattingRulesForNodeType as _calculateEnabledFormattingRulesForNodeType, dom} from './Helpers';

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
    setActiveDimensions: actions.CR.ContentDimensions.setActive,
    formattingUnderCursor: actions.UI.ContentCanvas.formattingUnderCursor,
    setCurrentlyEditedPropertyName: actions.UI.ContentCanvas.setCurrentlyEditedPropertyName,
    addNodes: actions.CR.Nodes.add,
    focusNode: actions.CR.Nodes.focus,
    unFocusNode: actions.CR.Nodes.unFocus,
    persistChange: actions.Changes.persistChange
})
@neos(globalRegistry => ({
    formattingRulesRegistry: globalRegistry.get('@neos-project/neos-ui-ckeditor-bindings').get('formattingRules'),
    nodeTypesRegistry: globalRegistry.get('@neos-project/neos-ui-contentrepository')
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
        setActiveDimensions: PropTypes.func.isRequired,
        addNodes: PropTypes.func.isRequired,
        formattingUnderCursor: PropTypes.func.isRequired,
        setCurrentlyEditedPropertyName: PropTypes.func.isRequired,
        focusNode: PropTypes.func.isRequired,
        unFocusNode: PropTypes.func.isRequired,
        persistChange: PropTypes.func.isRequired,
        byContextPathDynamicAccess: PropTypes.func.isRequired,
        formattingRulesRegistry: PropTypes.object.isRequired,
        nodeTypesRegistry: PropTypes.object.isRequired,
        translations: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);

        this.onFrameChange = this.handleFrameChanges.bind(this);
    }

    componentWillMount() {
        const {nodeTypesRegistry, formattingRulesRegistry} = this.props;
        this.calculateEnabledFormattingRulesForNodeType = _calculateEnabledFormattingRulesForNodeType({
            nodeTypesRegistry,
            formattingRulesRegistry
        });
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
            focusNode,
            setGuestContext,
            setContextPath,
            setPreviewUrl,
            setActiveDimensions,
            addNodes,
            formattingUnderCursor,
            setCurrentlyEditedPropertyName,
            unFocusNode,
            persistChange,
            formattingRulesRegistry,
            nodeTypesRegistry,
            translations
        } = this.props;

        const translate = i18nService(translations);

        //
        // First of all, set the new version of the guest frame window object to the store.
        //
        setGuestContext(iframeWindow);

        const documentInformation = iframeWindow['@Neos.Neos.Ui:DocumentInformation'];

        // TODO: convert to single action: "guestFrameChange"

        // Add nodes before setting the new context path to prevent action ordering issues
        const nodes = iframeWindow['@Neos.Neos.Ui:Nodes'];
        addNodes(nodes);

        setContextPath(documentInformation.metaData.contextPath);
        setPreviewUrl(documentInformation.metaData.previewUrl);
        setActiveDimensions(documentInformation.metaData.contentDimensions.active);

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

            node.addEventListener('mouseenter', e => {
                const oldNode = iframeDocument.querySelector(`.${style.markHoveredNodeAsHovered}`);
                if (oldNode) {
                    oldNode.classList.remove(style.markHoveredNodeAsHovered);
                }

                node.classList.add(style.markHoveredNodeAsHovered);

                e.stopPropagation();
            });
            node.addEventListener('mouseleave', e => {
                node.classList.remove(style.markHoveredNodeAsHovered);

                e.stopPropagation();
            });
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

        // ToDo: Throws an err.
        iframeWindow.NeosCKEditorApi.initialize(editorConfig);

        //
        // Initialize inline editors
        //
        const editors = iframeDocument.querySelectorAll('.neos-inline-editable');
        Array.prototype.forEach.call(editors, domNode => {
            const contextPath = dom.closestContextPath(domNode);
            const propertyName = domNode.dataset.__neosProperty;

            const node = this.props.byContextPathDynamicAccess(contextPath);

            if (!node) {
                console.warn('No node found at path: ' + contextPath);
                return;
            }

            const nodeFormattingRules = this.calculateEnabledFormattingRulesForNodeType(node.nodeType);
            const placeholderLabel = $get(['properties', propertyName, 'ui', 'aloha', 'placeholder'], nodeTypesRegistry.get(node.nodeType));
            const placeholder = unescape(translate(placeholderLabel));

            const enabledFormattingRuleIds = nodeFormattingRules[propertyName] || [];

            // Build up editor config for each enabled formatting
            let editorOptions = Object.assign(
                {
                    extraPlugins: 'confighelper',
                    removePlugins: 'floatingspace,maximize,resize,toolbar,contextmenu,liststyle,tabletools'
                },
                placeholder ? {placeholder} : {}
            );

            enabledFormattingRuleIds.forEach(formattingRuleId => {
                const formattingDefinition = formattingRulesRegistry.get(formattingRuleId);

                if (formattingDefinition.config) {
                    editorOptions = formattingDefinition.config(editorOptions);
                }
            });

            iframeWindow.NeosCKEditorApi.createEditor(domNode, editorOptions, propertyName, contents => {
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
