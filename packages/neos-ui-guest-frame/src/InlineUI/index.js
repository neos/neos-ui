import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import {actions, selectors} from '@neos-project/neos-ui-redux-store';
import {neos} from '@neos-project/neos-ui-decorators';

import NodeToolbar from './NodeToolbar/index';

import style from './style.module.css';
import InlineValidationErrors from './InlineValidationErrors/index';
import {isEqualSet} from '@neos-project/utils-helpers';

@neos(globalRegistry => ({
    nodeTypesRegistry: globalRegistry.get('@neos-project/neos-ui-contentrepository')
}))
@connect(state => ({
    focused: state?.cr?.nodes?.focused,
    focusedNode: selectors.CR.Nodes.focusedSelector(state),
    focusedNodesContextPaths: selectors.CR.Nodes.focusedNodePathsSelector(state),
    shouldScrollIntoView: selectors.UI.ContentCanvas.shouldScrollIntoView(state),
    destructiveOperationsAreDisabled: selectors.CR.Nodes.destructiveOperationsAreDisabledSelector(state),
    clipboardMode: state?.cr?.nodes?.clipboardMode,
    clipboardNodesContextPaths: selectors.CR.Nodes.clipboardNodesContextPathsSelector(state),
    isWorkspaceReadOnly: selectors.CR.Workspaces.isWorkspaceReadOnlySelector(state)
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
        clipboardNodesContextPaths: PropTypes.array,
        isWorkspaceReadOnly: PropTypes.bool
    };

    render() {
        const {focused} = this.props;
        const {
            nodeTypesRegistry,
            focusedNode,
            focusedNodesContextPaths,
            clipboardNodesContextPaths,
            shouldScrollIntoView,
            requestScrollIntoView,
            destructiveOperationsAreDisabled,
            clipboardMode,
            isWorkspaceReadOnly
        } = this.props;

        // If there's no focused node, we won't render the Inline UI
        if (!focusedNode) {
            return null;
        }

        const focusedNodeContextPath = focusedNode.contextPath;
        const isDocument = nodeTypesRegistry.hasRole(focusedNode?.nodeType, 'document');
        const allFocusedNodesAreInClipboard = isEqualSet(focusedNodesContextPaths, clipboardNodesContextPaths);
        const isCut = allFocusedNodesAreInClipboard && clipboardMode === 'Move';
        const isCopied = allFocusedNodesAreInClipboard && clipboardMode === 'Copy';
        const canBeDeleted = this.props.focusedNode?.policy?.canRemove || false;
        const canBeEdited = this.props.focusedNode?.policy?.canEdit || false;
        const visibilityCanBeToggled = !this.props.focusedNode?.policy?.disallowedProperties?.includes('_hidden');

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
                    visible={!isWorkspaceReadOnly}
                    {...focused}
                    />}
                <InlineValidationErrors />
            </div>
        );
    }
}
