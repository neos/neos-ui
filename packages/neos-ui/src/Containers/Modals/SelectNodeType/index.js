import React, {PureComponent, PropTypes} from 'react';
import {connect} from 'react-redux';
import {$get} from 'plow-js';

import {neos} from '@neos-project/neos-ui-decorators';
import {actions, selectors} from '@neos-project/neos-ui-redux-store';

import Button from '@neos-project/react-ui-components/lib/Button/';
import Dialog from '@neos-project/react-ui-components/lib/Dialog/';
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
        const allowedSiblingNodeTypes = getAllowedSiblingNodeTypesSelector(state, {reference});
        const allowedChildNodeTypes = getAllowedChildNodeTypesSelector(state, {reference});

        return {
            isOpen: $get('ui.selectNodeTypeModal.isOpen', state),
            allowedSiblingNodeTypes,
            allowedChildNodeTypes
        };
    };
}, {
    onHandleClose: actions.UI.SelectNodeTypeModal.cancel,
    onHandleSelect: actions.UI.SelectNodeTypeModal.apply
})
export default class SelectNodeType extends PureComponent {
    static propTypes = {
        isOpen: PropTypes.bool.isRequired,
        nodeTypesRegistry: PropTypes.object.isRequired,
        allowedSiblingNodeTypes: PropTypes.array,
        allowedChildNodeTypes: PropTypes.array,
        onHandleClose: PropTypes.func.isRequired,
        onHandleSelect: PropTypes.func.isRequired
    };

    state = {
        insertMode: calculateInitialMode(
            this.props.allowedSiblingNodeTypes,
            this.props.allowedChildNodeTypes
        )
    };

    handleModeChange = insertMode => this.setState({insertMode});

    handleSelectNodeType = nodeType => {
        const {onHandleSelect} = this.props;
        const {insertMode} = this.state;

        onHandleSelect(insertMode, nodeType);
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
                onClick={this.props.onHandleClose}
                >
                <I18n id="Neos.Neos:Main:cancel" fallback="Cancel"/>
            </Button>
        );
    }

    render() {
        const {isOpen, nodeTypesRegistry, onHandleClose} = this.props;

        if (!isOpen) {
            return null;
        }

        const groupedAllowedNodeTypes = nodeTypesRegistry.getGroupedNodeTypeList(
            this.getAllowedNodeTypesByCurrentInsertMode()
        );

        return (
            <Dialog
                actions={[this.renderCancelAction()]}
                title={this.renderInsertModeSelector()}
                onRequestClose={onHandleClose}
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
}
