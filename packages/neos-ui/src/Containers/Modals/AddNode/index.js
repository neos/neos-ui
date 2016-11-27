import React, {PureComponent, PropTypes} from 'react';
import {connect} from 'react-redux';
import {$transform} from 'plow-js';

import Step1 from './step1.js';
import Step2 from './step2.js';

import {neos} from '@neos-project/neos-ui-decorators';
import {actions, selectors} from '@neos-project/neos-ui-redux-store';
import * as NeosPropTypes from '@neos-project/react-proptypes';

@connect($transform({
    referenceNode: selectors.UI.AddNodeModal.referenceNodeSelector,
    referenceNodeParent: selectors.UI.AddNodeModal.referenceNodeParentSelector,
    referenceNodeGrandParent: selectors.UI.AddNodeModal.referenceNodeGrandParentSelector,
    getAllowedNodeTypesByModeGenerator: selectors.UI.AddNodeModal.getAllowedNodeTypesByModeSelector
}), {
    handleClose: actions.UI.AddNodeModal.close,
    persistChange: actions.Changes.persistChange
})
@neos(globalRegistry => ({
    nodeTypesRegistry: globalRegistry.get('@neos-project/neos-ui-contentrepository'),
    validatorRegistry: globalRegistry.get('validators')
}))
export default class AddNodeModal extends PureComponent {
    static propTypes = {
        referenceNode: NeosPropTypes.node,
        referenceNodeParent: NeosPropTypes.node,
        referenceNodeGrandParent: NeosPropTypes.node,
        groupedAllowedNodeTypes: PropTypes.array,
        getAllowedNodeTypesByModeGenerator: PropTypes.func.isRequired,
        nodeTypesRegistry: PropTypes.object.isRequired,
        validatorRegistry: PropTypes.object.isRequired,

        handleClose: PropTypes.func.isRequired,
        persistChange: PropTypes.func.isRequired
    };

    componentWillReceiveProps(nextProps) {
        if (this.props.referenceNode !== nextProps.referenceNode) {
            this.setState({step: 1});
        }
    }

    constructor(...props) {
        super(...props);

        this.state = {
            mode: 'insert',
            step: 1,
            selectedNodeType: null,
            elementValues: {}
        };

        this.handleSelectNodeType = this.handleSelectNodeType.bind(this);
        this.handleModeChange = this.handleModeChange.bind(this);
        this.handleDialogEditorValueChange = this.handleDialogEditorValueChange.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.handleBack = this.handleBack.bind(this);
    }

    render() {
        const {validatorRegistry, referenceNode, handleClose, nodeTypesRegistry, getAllowedNodeTypesByModeGenerator} = this.props;
        if (!referenceNode) {
            return null;
        }

        if (this.state.step === 1) {
            return (
                <Step1
                    mode={this.state.mode}
                    nodeTypesRegistry={nodeTypesRegistry}
                    getAllowedNodeTypesByModeGenerator={getAllowedNodeTypesByModeGenerator}
                    onHandleClose={handleClose}
                    onHandleModeChange={this.handleModeChange}
                    onHandleSelectNodeType={this.handleSelectNodeType}
                    />
            );
        } else if (this.state.step === 2) {
            return (
                <Step2
                    selectedNodeType={this.state.selectedNodeType}
                    elementValues={this.state.elementValues}
                    validatorRegistry={validatorRegistry}
                    onHandleDialogEditorValueChange={this.handleDialogEditorValueChange}
                    onHandleSave={this.handleSave}
                    onHandleBack={this.handleBack}
                    />);
        }

        return null; // basically never called.
    }

    handleModeChange(mode) {
        this.setState({mode});
    }

    handleSelectNodeType(nodeType) {
        if (nodeType.ui.creationDialog) {
            this.setState({step: 2, selectedNodeType: nodeType, elementValues: {}});
        } else {
            // no required node properties; let's directly create the node!
            this.createNode(nodeType);
        }
    }

    handleSave() {
        this.createNode(this.state.selectedNodeType, this.state.elementValues);
    }

    handleBack() {
        this.setState({step: 1});
    }

    handleDialogEditorValueChange(elementName, value) {
        const newValues = Object.assign({}, this.state.elementValues);
        newValues[elementName] = value;
        this.setState({elementValues: newValues});
    }

    createNode(nodeType, data = {}) {
        const {
            referenceNode,
            persistChange,
            handleClose
        } = this.props;

        let changeType;

        switch (this.state.mode) {
            case 'prepend':
                changeType = 'Neos.Neos.Ui:CreateBefore';
                break;
            case 'append':
                changeType = 'Neos.Neos.Ui:CreateAfter';
                break;
            default:
                changeType = 'Neos.Neos.Ui:Create';
                break;
        }

        const change = {
            type: changeType,
            subject: referenceNode.contextPath,
            payload: {
                nodeType: nodeType.name,
                data
            }
        };
        persistChange(change);
        handleClose();
    }
}
