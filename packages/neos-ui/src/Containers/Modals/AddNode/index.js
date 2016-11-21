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
import {InternalEditorEnvelope} from '../../RightSideBar/Inspector/EditorEnvelope/index';

//
// Export error messages for testing
//
export const errorMessages = {
    ERROR_INVALID_MODE: 'Provided mode is not within allowed modes list in AddNodeModal.'
};

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

const getRequiredPropertiesForNodeType = nodeType => {
    const nodePropertyNames = Object.keys(nodeType.properties);
    const requiredNodeProperties = nodePropertyNames.filter(nodePropertyName =>
        $get(['properties', nodePropertyName, 'validation', 'TYPO3.Neos/Validation/NotEmptyValidator'], nodeType)
    );

    return requiredNodeProperties;
};

@connect($transform({
    referenceNode: selectors.UI.AddNodeModal.referenceNodeSelector,
    referenceNodeParent: selectors.UI.AddNodeModal.referenceNodeParentSelector,
    referenceNodeGrandParent: selectors.UI.AddNodeModal.referenceNodeGrandParentSelector,
    allowedNodeTypesByModeGeneratorFn: selectors.UI.AddNodeModal.allowedNodeTypesByModeSelector
}), {
    handleClose: actions.UI.AddNodeModal.close,
    persistChange: actions.Changes.persistChange
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

        handleClose: PropTypes.func.isRequired,
        persistChange: PropTypes.func.isRequired
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
            step: 1,
            selectedNodeType: null,
            propertiesOfToBeCreatedNode: {}
        };

        this.handleSelectNodeType = this.handleSelectNodeType.bind(this);
        this.handleModeChange = this.handleModeChange.bind(this);
        this.handleDialogEditorValueChange = this.handleDialogEditorValueChange.bind(this);
        this.handleSave = this.handleSave.bind(this);
    }

    render() {
        if (!this.props.referenceNode) {
            return null;
        }

        if (this.state.step === 1) {
            return this.renderStep1();
        } else if (this.state.step === 2) {
            return this.renderStep2();
        }

        return null; // basically never called.
    }

    renderStep1() {
        const {
            nodeTypesRegistry,
            allowedNodeTypesByModeGeneratorFn
        } = this.props;

        const allowedNodeTypesByMode = allowedNodeTypesByModeGeneratorFn(nodeTypesRegistry);
        const activeMode = calculateActiveMode(this.state.mode, allowedNodeTypesByMode);

        const groupedAllowedNodeTypes = nodeTypesRegistry.getGroupedNodeTypeList(allowedNodeTypesByMode[activeMode]);

        return (
            <Dialog
                actions={[this.renderCancelAction()]}
                title={this.renderInsertModeSelector(activeMode, allowedNodeTypesByMode)}
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

    renderStep2() {
        const requiredProperties = getRequiredPropertiesForNodeType(this.state.selectedNodeType);

        const vNode = {
            properties: this.state.propertiesOfToBeCreatedNode
        };

        return (
            <Dialog
                actions={[this.renderCancelAction(), this.renderSaveAction()]}
                title={'... TODO ...'}
                onRequestClose={close}
                isOpen
                isWide
                >
                {requiredProperties.map(propertyName => {
                    const property = this.state.selectedNodeType.properties[propertyName];

                    return (<InternalEditorEnvelope
                        key={propertyName}
                        id={propertyName}
                        label={$get('ui.label', property)}
                        editor={$get('ui.inspector.editor', property)}
                        options={$get('ui.inspector.editorOptions', property)}
                        node={vNode}
                        onValueChange={this.handleDialogEditorValueChange}
                        />);
                })}
            </Dialog>
        );
    }

    handleDialogEditorValueChange(propertyName, value) {
        const newProperties = Object.assign({}, this.state.propertiesOfToBeCreatedNode);
        newProperties[propertyName] = value;
        this.setState({propertiesOfToBeCreatedNode: newProperties});
    }

    renderInsertModeSelector(activeMode, allowedNodeTypesByMode) {
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

        return (<SelectBox
            options={options}
            value={activeMode}
            onSelect={this.handleModeChange}
            />);
    }

    renderCancelAction() {
        return (
            <Button
                key="cancel"
                style="lighter"
                hoverStyle="brand"
                onClick={this.props.handleClose}
                isFocused={true}
                >
                <I18n fallback="Cancel"/>
            </Button>
        );
    }

    renderSaveAction() {
        return (
            <Button
                key="save"
                style="lighter"
                hoverStyle="brand"
                onClick={this.handleSave}
                isFocused={true}
                >
                <I18n fallback="Save"/>
            </Button>
        );
    }

    handleModeChange(mode) {
        this.setState({mode});
    }

    handleSelectNodeType(nodeType) {
        if (getRequiredPropertiesForNodeType(nodeType).length) {
            this.setState({step: 2, selectedNodeType: nodeType, propertiesOfToBeCreatedNode: {}});
        } else {
            // no required node properties; let's directly create the node!
            this.createNode(nodeType);
        }
    }
    handleSave() {
        this.createNode(this.state.selectedNodeType, this.state.propertiesOfToBeCreatedNode);
    }

    createNode(nodeType, initialProperties = {}) {
        // TODO: check that createNode works!
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
                initialProperties
            }
        };
        persistChange(change);
        handleClose();
    }

}
