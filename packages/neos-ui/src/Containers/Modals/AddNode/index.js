import React, {Component, PropTypes} from 'react';
import shallowCompare from 'react-addons-shallow-compare';
import {connect} from 'react-redux';
import {$transform, $get} from 'plow-js';

import Icon from '@neos-project/react-ui-components/lib/Icon/';
import Button from '@neos-project/react-ui-components/lib/Button/';
import Dialog from '@neos-project/react-ui-components/lib/Dialog/';

import {neos} from '@neos-project/neos-ui-decorators';
import {actions, selectors} from '@neos-project/neos-ui-redux-store';
import * as NeosPropTypes from '@neos-project/react-proptypes';

import I18n from '@neos-project/neos-ui-i18n';

import NodeTypeGroupPanel from './nodeTypeGroupPanel';

//
// Export error messages for testing
//
export const errorMessages = {
    ERROR_INVALID_MODE: 'Provided mode is not within allowed modes list in AddNodeModal.'
};



@connect($transform({
    referenceNode: selectors.UI.AddNodeModal.referenceNodeSelector,
    referenceNodeParent: selectors.UI.AddNodeModal.referenceNodeParentSelector,
    referenceNodeGrandParent: selectors.UI.AddNodeModal.referenceNodeGrandParentSelector
    //mode: $get('ui.addNodeModal.mode')
}), {
    close: actions.UI.AddNodeModal.close
})
@neos(globalRegistry => ({
    nodeTypesRegistry: globalRegistry.get('@neos-project/neos-ui-contentrepository')
}))
export default class AddNodeModal extends Component {
    static propTypes = {
        referenceNode: NeosPropTypes.node,
        referenceNodeParent: NeosPropTypes.node,
        referenceNodeGrandParent: NeosPropTypes.node,
        groupedAllowedNodeTypes: PropTypes.array,
        //mode: PropTypes.string.isRequired,
        nodeTypesRegistry: PropTypes.object.isRequired,

        close: PropTypes.func.isRequired
    };

    shouldComponentUpdate(newProps, newState) {
        return shallowCompare(this, newProps, newState) && newProps.referenceNode !== this.props.referenceNode;
    }

    constructor(...props) {
        super(...props);

        this.handleSelectNodeType = this.handleSelectNodeType.bind(this);
    }

    calculateAllowedNodeTypesForMode(mode) {
        const allowedModes = ['insert', 'append', 'prepend'];
        if (allowedModes.indexOf(mode) === -1) {
            throw new Error(errorMessages.ERROR_INVALID_MODE);
        }

        const {
            nodeTypesRegistry,
            referenceNode,
            referenceNodeParent,
            referenceNodeGrandParent
        } = this.props;

        const baseNode = mode === 'insert' ? referenceNode : referenceNodeParent;
        const parentNode = mode === 'insert' ? referenceNodeParent : referenceNodeGrandParent;


        if (!baseNode || (baseNode.isAutoCreated && !parentNode)) {
            return [];
        }

        const allowedNodeTypes = baseNode.isAutoCreated ?
            nodeTypesRegistry.getAllowedGrandChildNodeTypes(parentNode.nodeType, baseNode.name) :
            nodeTypesRegistry.getAllowedChildNodeTypes(baseNode.nodeType);

        return allowedNodeTypes;

    }

    render() {
        const {
            nodeTypesRegistry,
            referenceNode,
            referenceNodeParent,
            referenceNodeGrandParent,
            //mode,
            close
        } = this.props;
        const actions = [];
        const baseNode = mode === 'insert' ? referenceNode : referenceNodeParent;
        const parentNode = mode === 'insert' ? referenceNodeParent : referenceNodeGrandParent;





        const groupedAllowedNodeTypes = nodeTypesRegistry.getGroupedNodeTypeList(allowedNodeTypes);

        actions.push(
            <Button
                style="lighter"
                hoverStyle="brand"
                onClick={close}
                isFocused={true}
                >
                <I18n fallback="Cancel"/>
            </Button>
        );

        let insertModeText;
        switch (mode) {
            case 'prepend':
                insertModeText = (
                    <span>
                        <I18n fallback="Create new" id="createNew"/> <I18n fallback="before" id="before"/> <Icon icon="level-up"/>
                    </span>
                );
                break;
            case 'append':
                insertModeText = (
                    <span>
                        <I18n fallback="Create new" id="createNew"/> <I18n fallback="after" id="after"/> <Icon icon="level-down"/>
                    </span>
                );
                break;
            default:
                insertModeText = (
                    <span>
                        <I18n fallback="Create new" id="createNew"/> <I18n fallback="into" id="into"/> <Icon icon="long-arrow-right"/>
                    </span>
                );
                break;
        }

        return (
            <Dialog
                actions={actions}
                title={insertModeText}
                onRequestClose={close}
                isOpen
                isWide
                >
                {groupedAllowedNodeTypes.map((group, key) => (
                    <div key={key}>
                        <NodeTypeGroupPanel
                            group={group}
                            onSelect={this.handleSelectNodeType}
                            />
                    </div>
                ))}
            </Dialog>
        );
    }

    handleSelectNodeType(nodeType) {

    }

}
