import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import mergeClassNames from 'classnames';
import {$transform, $get} from 'plow-js';
import {neos} from '@neos-project/neos-ui-decorators';

import {selectors} from '@neos-project/neos-ui-redux-store';

import style from './style.css';

@neos(globalRegistry => ({
    inlineEditorRegistry: globalRegistry.get('inlineEditors'),
    containerRegistry: globalRegistry.get('containers'),
    nodeTypesRegistry: globalRegistry.get('@neos-project/neos-ui-contentrepository'),
    frontendConfigurationRegistry: globalRegistry.get('frontendConfiguration')
}))
@connect($transform({
    currentlyEditedPropertyName: $get('ui.contentCanvas.currentlyEditedPropertyName'),
    isFringedLeft: $get('ui.leftSideBar.isHidden'),
    isFringedRight: $get('ui.rightSideBar.isHidden'),
    isEditModePanelHidden: $get('ui.editModePanel.isHidden'),
    isFullScreen: $get('ui.fullScreen.isFullScreen'),
    hasFocusedContentNode: selectors.CR.Nodes.hasFocusedContentNode,
    focusedNodeTypeName: selectors.CR.Nodes.focusedNodeTypeSelector
}))
export default class SecondaryToolbar extends PureComponent {
    static propTypes = {
        containerRegistry: PropTypes.object.isRequired,
        nodeTypesRegistry: PropTypes.object.isRequired,
        inlineEditorRegistry: PropTypes.object.isRequired,
        frontendConfigurationRegistry: PropTypes.object.isRequired,

        focusedNodeTypeName: PropTypes.string,
        currentlyEditedPropertyName: PropTypes.string,
        isFringedLeft: PropTypes.bool.isRequired,
        isFringedRight: PropTypes.bool.isRequired,
        isEditModePanelHidden: PropTypes.bool.isRequired,
        isFullScreen: PropTypes.bool.isRequired,
        hasFocusedContentNode: PropTypes.bool.isRequired
    };

    getToolbarComponent() {
        const {containerRegistry, currentlyEditedPropertyName, hasFocusedContentNode} = this.props;
        const DimensionSwitcher = containerRegistry.get('SecondaryToolbar/DimensionSwitcher');

        if (!hasFocusedContentNode && !currentlyEditedPropertyName) {
            return DimensionSwitcher;
        }

        const {nodeTypesRegistry, inlineEditorRegistry, focusedNodeTypeName} = this.props;
        const editorIdentifier = nodeTypesRegistry.getInlineEditorIdentifierForProperty(
            focusedNodeTypeName,
            currentlyEditedPropertyName
        );
        const {ToolbarComponent} = inlineEditorRegistry.get(editorIdentifier);

        return ToolbarComponent || DimensionSwitcher;
    }

    render() {
        const {
            containerRegistry,
            frontendConfigurationRegistry,
            isFringedLeft,
            isFringedRight,
            isEditModePanelHidden,
            isFullScreen
        } = this.props;
        const classNames = mergeClassNames({
            [style.secondaryToolbar]: true,
            [style['secondaryToolbar--isFringeLeft']]: isFringedLeft,
            [style['secondaryToolbar--isFringeRight']]: isFringedRight,
            [style['secondaryToolbar--isMovedDown']]: !isEditModePanelHidden,
            [style['secondaryToolbar--fullScreen']]: isFullScreen
        });

        const Toolbar = this.getToolbarComponent();
        const dontShowKeyboardShortcuts = frontendConfigurationRegistry._registry
            // Filter for every item which key is hotkeys and check if it's an empty object
            .filter(i => i.key === 'hotkeys' && Object.keys(i.value).length === 0)
            .length !== 0;
        const SecondaryToolbarRight = containerRegistry.getChildren('SecondaryToolbar/Right')
            // Filter every item that has not KeyboardShortcutButton in it's name if KeyboardShortcutButton
            // shouldn't be displayed
            .filter(i => dontShowKeyboardShortcuts ? i.displayName.indexOf('KeyboardShortcutButton') === -1 : true);

        return (
            <div className={classNames}>
                <Toolbar/>

                <div className={style.secondaryToolbar__rightHandedActions}>
                    {SecondaryToolbarRight.map((Item, key) => <Item key={key}/>)}
                </div>
            </div>
        );
    }
}
