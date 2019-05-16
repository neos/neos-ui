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
    nodeTypesRegistry: globalRegistry.get('@neos-project/neos-ui-contentrepository')
}))
@connect($transform({
    currentlyEditedPropertyName: $get('ui.contentCanvas.currentlyEditedPropertyName'),
    isFringedLeft: $get('ui.leftSideBar.isHidden'),
    isFringedRight: $get('ui.rightSideBar.isHidden'),
    isFullScreen: $get('ui.fullScreen.isFullScreen'),
    hasFocusedContentNode: selectors.CR.Nodes.hasFocusedContentNode,
    focusedNodeTypeName: selectors.CR.Nodes.focusedNodeTypeSelector
}))
export default class SecondaryToolbar extends PureComponent {
    static propTypes = {
        containerRegistry: PropTypes.object.isRequired,
        nodeTypesRegistry: PropTypes.object.isRequired,
        inlineEditorRegistry: PropTypes.object.isRequired,

        focusedNodeTypeName: PropTypes.string,
        currentlyEditedPropertyName: PropTypes.string,
        isFringedLeft: PropTypes.bool.isRequired,
        isFringedRight: PropTypes.bool.isRequired,
        isFullScreen: PropTypes.bool.isRequired,
        hasFocusedContentNode: PropTypes.bool.isRequired
    };

    getToolbarComponent() {
        const {currentlyEditedPropertyName, hasFocusedContentNode, nodeTypesRegistry, inlineEditorRegistry, focusedNodeTypeName} = this.props;

        // Focused node is not yet in state, we need to wait a bit
        if (!focusedNodeTypeName) {
            return () => null;
        }

        if (!hasFocusedContentNode && !currentlyEditedPropertyName) {
            return null;
        }

        const editorIdentifier = nodeTypesRegistry.getInlineEditorIdentifierForProperty(
            focusedNodeTypeName,
            currentlyEditedPropertyName
        );
        const {ToolbarComponent} = inlineEditorRegistry.get(editorIdentifier);

        return ToolbarComponent || null;
    }

    render() {
        const {
            containerRegistry,
            isFringedLeft,
            isFringedRight,
            isFullScreen
        } = this.props;
        const classNames = mergeClassNames({
            [style.secondaryToolbar]: true,
            [style['secondaryToolbar--isFringeLeft']]: isFringedLeft,
            [style['secondaryToolbar--isFringeRight']]: isFringedRight,
            [style['secondaryToolbar--fullScreen']]: isFullScreen
        });

        const Toolbar = this.getToolbarComponent();
        const SecondaryToolbarRight = containerRegistry.getChildren('SecondaryToolbar/Right');

        return (
            <div className={classNames}>
                { Toolbar === null ? null : <Toolbar/> }

                <div className={style.secondaryToolbar__rightHandedActions}>
                    {SecondaryToolbarRight.map((Item, key) => <Item key={key}/>)}
                </div>
            </div>
        );
    }
}
