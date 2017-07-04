import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import mergeClassNames from 'classnames';
import {$transform, $get} from 'plow-js';
import {neos} from '@neos-project/neos-ui-decorators';
import IconButton from '@neos-project/react-ui-components/src/IconButton/';
import Icon from '@neos-project/react-ui-components/src/Icon/';

import {actions, selectors} from '@neos-project/neos-ui-redux-store';

import style from './style.css';

@neos(globalRegistry => ({
    inlineEditorRegistry: globalRegistry.get('inlineEditors'),
    containerRegistry: globalRegistry.get('containers'),
    nodeTypesRegistry: globalRegistry.get('@neos-project/neos-ui-contentrepository')
}))
@connect($transform({
    previewUrl: $get('ui.contentCanvas.previewUrl'),
    currentlyEditedPropertyName: $get('ui.contentCanvas.currentlyEditedPropertyName'),
    isFringedLeft: $get('ui.leftSideBar.isHidden'),
    isFringedRight: $get('ui.rightSideBar.isHidden'),
    isEditModePanelHidden: $get('ui.editModePanel.isHidden'),
    isFullScreen: $get('ui.fullScreen.isFullScreen'),
    hasFocusedContentNode: selectors.CR.Nodes.hasFocusedContentNode,
    focusedNodeTypeName: selectors.CR.Nodes.focusedNodeTypeSelector
}), {
    toggleFullScreen: actions.UI.FullScreen.toggle
})
export default class SecondaryToolbar extends PureComponent {
    static propTypes = {
        containerRegistry: PropTypes.object.isRequired,
        nodeTypesRegistry: PropTypes.object.isRequired,
        inlineEditorRegistry: PropTypes.object.isRequired,

        focusedNodeTypeName: PropTypes.string,
        currentlyEditedPropertyName: PropTypes.string,
        previewUrl: PropTypes.string,
        isFringedLeft: PropTypes.bool.isRequired,
        isFringedRight: PropTypes.bool.isRequired,
        isEditModePanelHidden: PropTypes.bool.isRequired,
        isFullScreen: PropTypes.bool.isRequired,
        toggleFullScreen: PropTypes.func.isRequired,
        hasFocusedContentNode: PropTypes.bool.isRequired
    };

    handleToggleFullScreen = () => {
        const {toggleFullScreen} = this.props;

        toggleFullScreen();
    }

    getToolbarComponent() {
        const {containerRegistry, currentlyEditedPropertyName, hasFocusedContentNode} = this.props;
        const DimensionSwitcher = containerRegistry.get('SecondaryToolbar/DimensionSwitcher');

        if (!hasFocusedContentNode) {
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
            previewUrl,
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
            [style['secondaryToolbar--isHidden']]: isFullScreen
        });
        const previewButtonClassNames = mergeClassNames({
            [style.secondaryToolbar__buttonLink]: true,
            [style['secondaryToolbar__buttonLink--isDisabled']]: !previewUrl
        });

        const Toolbar = this.getToolbarComponent();
        const LoadingIndicator = containerRegistry.get('SecondaryToolbar/LoadingIndicator');

        return (
            <div className={classNames}>
                <Toolbar/>

                <div className={style.secondaryToolbar__rightHandedActions}>
                    <a
                        href={previewUrl ? previewUrl : ''}
                        target="neosPreview"
                        rel="noopener noreferrer"
                        className={previewButtonClassNames}
                        >
                        <Icon icon="external-link"/>
                    </a>
                    <IconButton icon="expand" onClick={this.handleToggleFullScreen}/>
                </div>
                <LoadingIndicator/>
            </div>
        );
    }
}
