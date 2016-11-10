import React, {Component, PropTypes} from 'react';
import shallowCompare from 'react-addons-shallow-compare';
import {connect} from 'react-redux';
import {$transform, $get} from 'plow-js';

import Icon from '@neos-project/react-ui-components/lib/Icon/';
import Button from '@neos-project/react-ui-components/lib/Button/';
import Dialog from '@neos-project/react-ui-components/lib/Dialog/';
import SelectBox from '@neos-project/react-ui-components/lib/SelectBox/';

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
    referenceNodeGrandParent: selectors.UI.AddNodeModal.referenceNodeGrandParentSelector,
    allowedNodeTypesByModeGeneratorFn: selectors.UI.AddNodeModal.allowedNodeTypesByModeSelector
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
        allowedNodeTypesByModeGeneratorFn: PropTypes.func.isRequired,
        nodeTypesRegistry: PropTypes.object.isRequired,

        close: PropTypes.func.isRequired
    };

    shouldComponentUpdate(...args) {
        return shallowCompare(this, ...args);
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.referenceNode !== nextProps.referenceNode) {
            this.setState({step: 1});
        }
    }

    constructor(...props) {
        super(...props);

        this.state = {
            mode: 'insert',
            step: 1
        };

        this.handleSelectNodeType = this.handleSelectNodeType.bind(this);
        this.handleModeChange = this.handleModeChange.bind(this);
    }
    calculateVisibleMode(allowedNodeTypesByMode) {
        if (allowedNodeTypesByMode[this.state.mode].length) {
            return this.state.mode;
        }

        const fallbackOrder = ['insert', 'append', 'prepend'];

        for (let i = 0; i < fallbackOrder.length; i++) {
            if (allowedNodeTypesByMode[fallbackOrder[i]].length) {
                return fallbackOrder[i];
            }
        }

        return '';
    }

    render() {
        const {
            nodeTypesRegistry,
            referenceNode,
            allowedNodeTypesByModeGeneratorFn,
            close
        } = this.props;

        if (!referenceNode) {
            return null;
        }

        const allowedNodeTypesByMode = allowedNodeTypesByModeGeneratorFn(nodeTypesRegistry);
        const mode = this.calculateVisibleMode(allowedNodeTypesByMode);

        const actions = [];


        const groupedAllowedNodeTypes = nodeTypesRegistry.getGroupedNodeTypeList(allowedNodeTypesByMode[mode]);

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

        const options = [];

        if (allowedNodeTypesByMode.prepend.length) {
            options.push({
                value: 'prepend',
                label: (<span>
                    <I18n fallback="Create new" id="createNew"/> <I18n fallback="before" id="before"/> <Icon icon="level-up"/>
                </span>)
            });
        }

        if (allowedNodeTypesByMode.append.length) {
            options.push({
                value: 'append',
                label: (<span>
                    <I18n fallback="Create new" id="createNew"/> <I18n fallback="after" id="after"/> <Icon icon="level-down"/>
                </span>)
            });
        }

        if (allowedNodeTypesByMode.insert.length) {
            options.push({
                value: 'insert',
                label: (<span>
                    <I18n fallback="Create new" id="createNew"/> <I18n fallback="into" id="into"/> <Icon icon="long-arrow-right"/>
                </span>)
            });
        }

        const insertModeText = (<SelectBox
            options={options}
            value={mode}
            onSelect={this.handleModeChange}
            />);


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

    handleModeChange(mode) {
        this.setState({mode});
    }

    handleSelectNodeType(nodeType) {
        console.log("HANDLE SELECT", nodeType);
    }

}
