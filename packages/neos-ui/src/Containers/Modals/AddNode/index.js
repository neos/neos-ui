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

const {
    referenceNodeSelector,
    nodeTypesForAddNodeModalSelector
} = selectors.UI.AddNodeModal;

import NodeTypeGroupPanel from './nodeTypeGroupPanel';


@connect($transform({
    referenceNode: selectors.UI.AddNodeModal.referenceNodeSelector,
    // groupedAllowedNodeTypes: nodeTypesForAddNodeModalSelector,
    mode: $get('ui.addNodeModal.mode')
}), {
    close: actions.UI.AddNodeModal.close
})
@neos(globalRegistry => ({
    nodeTypesRegistry: globalRegistry.get('@neos-project/neos-ui-contentrepository')
}))
export default class AddNodeModal extends Component {
    static propTypes = {
        referenceNode: NeosPropTypes.node,
        groupedAllowedNodeTypes: PropTypes.array,
        mode: PropTypes.string.isRequired,
        nodeTypesRegistry: PropTypes.object.isRequired,

        close: PropTypes.func.isRequired
    };

    shouldComponentUpdate(newProps, newState) {
        return shallowCompare(this, newProps, newState) && newProps.referenceNode !== this.props.referenceNode;
    }

    render() {
        const {
            nodeTypesRegistry,
            referenceNode,
            mode,
            close
        } = this.props;
        const actions = [];

        if (!referenceNode) {
            return null;
        }

        const groupedAllowedNodeTypes = nodeTypesRegistry.getGroupedNodeTypeList(
            nodeTypesRegistry.getAllowedNodeTypes(referenceNode.nodeType)
        );

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
                            />
                    </div>
                ))}
            </Dialog>
        );
    }
}
