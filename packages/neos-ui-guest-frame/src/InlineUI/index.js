import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {$transform, $get, $contains} from 'plow-js';
import {actions, selectors} from '@neos-project/neos-ui-redux-store';
import {neos} from '@neos-project/neos-ui-decorators';
import {findNodeInGuestFrame} from '@neos-project/neos-ui-guest-frame/src/dom';
import NodeToolbar from './NodeToolbar/index';

import style from './style.css';

@neos(globalRegistry => ({
    nodeTypesRegistry: globalRegistry.get('@neos-project/neos-ui-contentrepository')
}))
@connect($transform({
    focused: $get('cr.nodes.focused'),
    focusedNode: selectors.CR.Nodes.focusedSelector,
    shouldScrollIntoView: selectors.UI.ContentCanvas.shouldScrollIntoView,
    destructiveOperationsAreDisabled: selectors.CR.Nodes.destructiveOperationsAreDisabledSelector,
    clipboardMode: $get('cr.nodes.clipboardMode'),
    clipboardNodeContextPath: selectors.CR.Nodes.clipboardNodeContextPathSelector
}), {
    requestScrollIntoView: actions.UI.ContentCanvas.requestScrollIntoView
})
export default class InlineUI extends PureComponent {
    static propTypes = {
        focused: PropTypes.object,
        focusedNode: PropTypes.object,
        nodeTypesRegistry: PropTypes.object,
        destructiveOperationsAreDisabled: PropTypes.bool.isRequired,
        requestScrollIntoView: PropTypes.func.isRequired,
        shouldScrollIntoView: PropTypes.bool.isRequired,
        clipboardMode: PropTypes.string.isRequired,
        clipboardNodeContextPath: PropTypes.string
    };

    render() {
        const focused = this.props.focused.toJS();
        const focusedNodeContextPath = focused.contextPath;
        const {nodeTypesRegistry, focusedNode, shouldScrollIntoView, requestScrollIntoView, destructiveOperationsAreDisabled, clipboardMode, clipboardNodeContextPath} = this.props;
        const isDocument = nodeTypesRegistry.hasRole($get('nodeType', focusedNode), 'document');
        // Don't render toolbar for the document nodes
        if (isDocument) {
            return null;
        }
        const isCut = focusedNodeContextPath === clipboardNodeContextPath && clipboardMode === 'Move';
        const isCopied = focusedNodeContextPath === clipboardNodeContextPath && clipboardMode === 'Copy';
        const canBeDeleted = $get('policy.canRemove', this.props.focusedNode) || false;
        const canBeEdited = $get('policy.canEdit', this.props.focusedNode) || false;
        const visibilityCanBeToggled = !$contains('_hidden', 'policy.disallowedProperties', this.props.focusedNode);
        // Check if focusedNode is in Guest frame to prevent errors (e.g. if still in store)
        const focusedNodeInGuestFrame = findNodeInGuestFrame(focusedNodeContextPath) ? focused : {};

        return (
            <div className={style.inlineUi} data-__neos__inline-ui="TRUE">
                <NodeToolbar
                    shouldScrollIntoView={shouldScrollIntoView}
                    requestScrollIntoView={requestScrollIntoView}
                    destructiveOperationsAreDisabled={destructiveOperationsAreDisabled}
                    isCut={isCut}
                    isCopied={isCopied}
                    canBeDeleted={canBeDeleted}
                    canBeEdited={canBeEdited}
                    visibilityCanBeToggled={visibilityCanBeToggled}
                    {...focusedNodeInGuestFrame}
                    />
            </div>
        );
    }
}
