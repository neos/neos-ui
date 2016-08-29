import React, {Component, PropTypes} from 'react';
import shallowCompare from 'react-addons-shallow-compare';
import {connect} from 'react-redux';
import {$transform, $get} from 'plow-js';
import Icon from '@neos-project/react-ui-components/lib/Icon/';
import Button from '@neos-project/react-ui-components/lib/Button/';
import Dialog from '@neos-project/react-ui-components/lib/Dialog/';

import {actions} from 'Host/Redux/index';
import NeosPropTypes from 'Shared/PropTypes/index';

import {I18n} from 'Host/Containers/index';

import {
    referenceNodeSelector,
    nodeTypesForAddNodeModalSelector
} from 'Host/Selectors/UI/AddNodeModal/index';

import NodeTypeGroupPanel from './nodeTypeGroupPanel';

@connect($transform({
    referenceNode: referenceNodeSelector,
    groupedAllowedNodeTypes: nodeTypesForAddNodeModalSelector,
    mode: $get('ui.addNodeModal.mode')
}), {
    close: actions.UI.AddNodeModal.close
})
export default class AddNodeModal extends Component {
    static propTypes = {
        referenceNode: NeosPropTypes.cr.node,
        groupedAllowedNodeTypes: PropTypes.array,
        mode: PropTypes.string.isRequired,

        close: PropTypes.func.isRequired
    };

    shouldComponentUpdate(newProps, newState) {
        return shallowCompare(this, newProps, newState) && newProps.referenceNode !== this.props.referenceNode;
    }

    render() {
        const {
            referenceNode,
            mode,
            close,
            groupedAllowedNodeTypes
        } = this.props;
        const actions = [];

        if (!referenceNode) {
            return null;
        }

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
