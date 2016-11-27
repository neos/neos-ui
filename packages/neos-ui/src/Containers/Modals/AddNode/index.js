import React, {PureComponent, PropTypes} from 'react';
import {connect} from 'react-redux';
import {dom} from '../../ContentCanvas/Helpers/index';
import {$transform, $get} from 'plow-js';

import Step1 from './step1.js';
import Step2 from './step2.js';

import {neos} from '@neos-project/neos-ui-decorators';
import {actions, selectors} from '@neos-project/neos-ui-redux-store';
import * as NeosPropTypes from '@neos-project/react-proptypes';

const calculateActiveMode = (currentMode, allowedNodeTypesByMode) => {
    if (currentMode && allowedNodeTypesByMode[currentMode].length) {
        return currentMode;
    }

    const fallbackOrder = ['insert', 'append', 'prepend'];

    for (let i = 0; i < fallbackOrder.length; i++) {
        if (allowedNodeTypesByMode[fallbackOrder[i]].length) {
            return fallbackOrder[i];
        }
    }

    return '';
};

const calculateChangeTypeFromMode = mode => {
    switch (mode) {
        case 'prepend':
            return 'Neos.Neos.Ui:CreateBefore';

        case 'append':
            return 'Neos.Neos.Ui:CreateAfter';

        default:
            return 'Neos.Neos.Ui:Create';
    }
};

const calculateDomAddressesFromMode = (mode, contextPath, fusionPath) => {
    if (!fusionPath) {
        //
        // We're obviously creating a node in the tree. This operation needs
        // no further addressing.
        //
        return {};
    }

    switch (mode) {
        case 'prepend':
        case 'append': {
            const parentElement = dom.closestNode(
                dom.findNode(contextPath, fusionPath).parentNode
            );

            return {
                siblingDomAddress: {
                    contextPath,
                    fusionPath
                },
                parentDomAddress: {
                    contextPath: parentElement.getAttribute('data-__neos-node-contextpath'),
                    fusionPath: parentElement.getAttribute('data-__neos-typoscript-path')
                }
            };
        }

        default:
            return {
                parentDomAddress: {
                    contextPath,
                    fusionPath
                }
            };
    }
};

@connect($transform({
    fusionPath: $get('ui.addNodeModal.fusionPath'),
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
        fusionPath: PropTypes.string,
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
            mode: '',
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
            nodeTypesRegistry,
            getAllowedNodeTypesByModeGenerator,
            referenceNode,
            fusionPath,
            persistChange,
            handleClose
        } = this.props;

        const allowedNodeTypesByMode = getAllowedNodeTypesByModeGenerator(nodeTypesRegistry);
        const mode = calculateActiveMode(this.state.mode, allowedNodeTypesByMode);
        const changeType = calculateChangeTypeFromMode(mode);

        const change = {
            type: changeType,
            subject: $get('contextPath', referenceNode),
            payload: {
                ...calculateDomAddressesFromMode(
                    mode,
                    $get('contextPath', referenceNode),
                    fusionPath
                ),
                nodeType: $get('name', nodeType),
                data
            }
        };
        persistChange(change);
        handleClose();
    }
}
