import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {$get} from 'plow-js';

import {neos} from '@neos-project/neos-ui-decorators';
import {actions, selectors} from '@neos-project/neos-ui-redux-store';

import Button from '@neos-project/react-ui-components/src/Button/';
import Dialog from '@neos-project/react-ui-components/src/Dialog/';
import I18n from '@neos-project/neos-ui-i18n';

import {InsertModeSelector} from '@neos-project/neos-ui-containers';
import NodeTypeGroupPanel from './nodeTypeGroupPanel';

const calculateInitialMode = (allowedSiblingNodeTypes, allowedChildNodeTypes) => {
    if (allowedSiblingNodeTypes.length) {
        return 'after';
    }

    if (allowedChildNodeTypes.length) {
        return 'into';
    }

    return '';
};

@neos(globalRegistry => ({
    nodeTypesRegistry: globalRegistry.get('@neos-project/neos-ui-contentrepository')
}))
@connect((state, {nodeTypesRegistry}) => {
    const getAllowedSiblingNodeTypesSelector = selectors.CR.Nodes.makeGetAllowedSiblingNodeTypesSelector(nodeTypesRegistry);
    const getAllowedChildNodeTypesSelector = selectors.CR.Nodes.makeGetAllowedChildNodeTypesSelector(nodeTypesRegistry);

    return state => {
        const reference = $get('ui.selectNodeTypeModal.referenceNodeContextPath', state);
        const referenceNodeType = selectors.CR.Nodes.getPathInNode(state, reference, 'nodeType');
        const role = nodeTypesRegistry.hasRole(referenceNodeType, 'document') ? 'document' : 'content';
        const allowedSiblingNodeTypes = nodeTypesRegistry.getGroupedNodeTypeList(getAllowedSiblingNodeTypesSelector(state, {reference, role}));
        const allowedChildNodeTypes = nodeTypesRegistry.getGroupedNodeTypeList(getAllowedChildNodeTypesSelector(state, {reference, role}));

        return {
            isOpen: $get('ui.selectNodeTypeModal.isOpen', state),
            allowedSiblingNodeTypes,
            allowedChildNodeTypes
        };
    };
}, {
    cancel: actions.UI.SelectNodeTypeModal.cancel,
    apply: actions.UI.SelectNodeTypeModal.apply
})
export default class SelectNodeType extends PureComponent {
    static propTypes = {
        isOpen: PropTypes.bool.isRequired,
        nodeTypesRegistry: PropTypes.object.isRequired,
        allowedSiblingNodeTypes: PropTypes.array,
        allowedChildNodeTypes: PropTypes.array,
        cancel: PropTypes.func.isRequired,
        apply: PropTypes.func.isRequired
    };

    componentDidMount() {
        this.setState({
            insertMode: calculateInitialMode(
                this.props.allowedSiblingNodeTypes,
                this.props.allowedChildNodeTypes
            )
        });
    }

    componentDidUpdate(prevProps) {
        if (prevProps.allowedSiblingNodeTypes !== this.props.allowedSiblingNodeTypes ||
            prevProps.allowedChildNodeTypes !== this.props.allowedChildNodeTypes) {
            this.componentDidMount();
        }
    }

    handleModeChange = insertMode => this.setState({insertMode});

    handleCancel = () => {
        const {cancel} = this.props;

        cancel();
    }

    handleApply = nodeType => {
        const {apply} = this.props;
        const {insertMode} = this.state;

        apply(insertMode, nodeType);
    };

    getAllowedNodeTypesByCurrentInsertMode() {
        const {insertMode} = this.state;
        const {allowedSiblingNodeTypes, allowedChildNodeTypes} = this.props;

        switch (insertMode) {
            case 'into':
                return allowedChildNodeTypes;

            case 'before':
            case 'after':
                return allowedSiblingNodeTypes;

            default:
                return [];
        }
    }

    renderInsertModeSelector() {
        const {insertMode} = this.state;
        const {allowedSiblingNodeTypes, allowedChildNodeTypes} = this.props;

        return (
            <InsertModeSelector
                mode={insertMode}
                onSelect={this.handleModeChange}
                enableAlongsideModes={Boolean(allowedSiblingNodeTypes.length)}
                enableIntoMode={Boolean(allowedChildNodeTypes.length)}
                />
        );
    }

    renderCancelAction() {
        return (
            <Button
                key="cancel"
                style="lighter"
                hoverStyle="brand"
                onClick={this.handleCancel}
                >
                <I18n id="Neos.Neos:Main:cancel" fallback="Cancel"/>
            </Button>
        );
    }

    render() {
        const {isOpen} = this.props;

        if (!isOpen) {
            return null;
        }

        return (
            <Dialog
                actions={[this.renderCancelAction()]}
                title={this.renderInsertModeSelector()}
                onRequestClose={this.handleCancel}
                isOpen
                style="wide"
                >
                {this.getAllowedNodeTypesByCurrentInsertMode().map((group, key) => (
                    <div key={key}>
                        <NodeTypeGroupPanel
                            group={group}
                            onSelect={this.handleApply}
                            />
                    </div>
                ))}
            </Dialog>
        );
    }
}
