import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {$transform, $get, $contains} from 'plow-js';
import {actions, selectors} from '@neos-project/neos-ui-redux-store';
import {neos} from '@neos-project/neos-ui-decorators';

import NodeToolbar from './NodeToolbar/index';

import style from './style.css';
import InlineValidationErrors from './InlineValidationErrors/index';
import {isEqualSet} from '@neos-project/utils-helpers';

@neos(globalRegistry => ({
    nodeTypesRegistry: globalRegistry.get('@neos-project/neos-ui-contentrepository')
}))
@connect($transform({
    focused: $get('cr.nodes.focused'),
    focusedNode: selectors.CR.Nodes.focusedSelector,
    focusedNodesContextPaths: selectors.CR.Nodes.focusedNodePathsSelector,
    shouldScrollIntoView: selectors.UI.ContentCanvas.shouldScrollIntoView,
    destructiveOperationsAreDisabled: selectors.CR.Nodes.destructiveOperationsAreDisabledSelector,
    clipboardMode: $get('cr.nodes.clipboardMode'),
    clipboardNodesContextPaths: selectors.CR.Nodes.clipboardNodesContextPathsSelector
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
        clipboardMode: PropTypes.string,
        clipboardNodesContextPaths: PropTypes.array
    };

    render() {
        const {focused} = this.props;
        const {nodeTypesRegistry, focusedNode, focusedNodesContextPaths, clipboardNodesContextPaths, shouldScrollIntoView, requestScrollIntoView, destructiveOperationsAreDisabled, clipboardMode} = this.props;
        const focusedNodeContextPath = focusedNode.contextPath;
        const isDocument = nodeTypesRegistry.hasRole($get('nodeType', focusedNode), 'document');
        const allFocusedNodesAreInClipboard = isEqualSet(focusedNodesContextPaths, clipboardNodesContextPaths);
        const isCut = allFocusedNodesAreInClipboard && clipboardMode === 'Move';
        const isCopied = allFocusedNodesAreInClipboard && clipboardMode === 'Copy';
        const canBeDeleted = $get('policy.canRemove', this.props.focusedNode) || false;
        const canBeEdited = $get('policy.canEdit', this.props.focusedNode) || false;
        const visibilityCanBeToggled = !$contains('_hidden', 'policy.disallowedProperties', this.props.focusedNode);

        return (
            <div className={style.inlineUi} data-__neos__inline-ui="TRUE">
                {!isDocument && <NodeToolbar
                    shouldScrollIntoView={shouldScrollIntoView}
                    requestScrollIntoView={requestScrollIntoView}
                    destructiveOperationsAreDisabled={destructiveOperationsAreDisabled}
                    isCut={isCut}
                    isCopied={isCopied}
                    canBeDeleted={canBeDeleted}
                    canBeEdited={canBeEdited}
                    visibilityCanBeToggled={visibilityCanBeToggled}
                    contextPath={focusedNodeContextPath}
                    {...focused}
                    />}
                <InlineValidationErrors />
            </div>
        );
    }
}
