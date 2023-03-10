import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import mergeClassNames from 'classnames';

import {neos} from '@neos-project/neos-ui-decorators';

import {selectors} from '@neos-project/neos-ui-redux-store';

import style from './style.module.css';

@neos(globalRegistry => ({
    inlineEditorRegistry: globalRegistry.get('inlineEditors'),
    containerRegistry: globalRegistry.get('containers')
}))
@connect(state => ({
    currentlyEditedPropertyName: state?.ui?.contentCanvas?.currentlyEditedPropertyName,
    isFringedLeft: state?.ui?.leftSideBar?.isHidden,
    isFringedRight: state?.ui?.rightSideBar?.isHidden,
    isFullScreen: state?.ui?.fullScreen?.isFullScreen,
    hasFocusedContentNode: selectors.CR.Nodes.hasFocusedContentNode(state),
    focusedNodeTypeName: selectors.CR.Nodes.focusedNodeTypeSelector(state)
}))
export default class SecondaryToolbar extends PureComponent {
    static propTypes = {
        containerRegistry: PropTypes.object.isRequired,
        inlineEditorRegistry: PropTypes.object.isRequired,

        focusedNodeTypeName: PropTypes.string,
        currentlyEditedPropertyName: PropTypes.string,
        isFringedLeft: PropTypes.bool.isRequired,
        isFringedRight: PropTypes.bool.isRequired,
        isFullScreen: PropTypes.bool.isRequired,
        hasFocusedContentNode: PropTypes.bool.isRequired
    };

    getToolbarComponent() {
        const {currentlyEditedPropertyName, hasFocusedContentNode, inlineEditorRegistry, focusedNodeTypeName} = this.props;

        // Focused node is not yet in state, we need to wait a bit
        if (!focusedNodeTypeName) {
            return () => null;
        }

        if (!hasFocusedContentNode && !currentlyEditedPropertyName) {
            return null;
        }

        const {ToolbarComponent} = inlineEditorRegistry.get('ckeditor5');

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
            [style['secondaryToolbar--isFringeLeft']]: !isFullScreen && isFringedLeft,
            [style['secondaryToolbar--isFringeRight']]: !isFullScreen && isFringedRight
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
