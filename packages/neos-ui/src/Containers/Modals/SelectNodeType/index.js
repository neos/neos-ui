import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {$get} from 'plow-js';
import isEqual from 'lodash.isequal';

import {neos} from '@neos-project/neos-ui-decorators';
import {actions, selectors} from '@neos-project/neos-ui-redux-store';

import Button from '@neos-project/react-ui-components/src/Button/';
import Dialog from '@neos-project/react-ui-components/src/Dialog/';
import I18n from '@neos-project/neos-ui-i18n';

import {InsertModeSelector} from '@neos-project/neos-ui-containers';
import NodeTypeGroupPanel from './nodeTypeGroupPanel';
import NodeTypeFilter from './nodeTypeFilter';
import style from './style.css';

const calculateInitialMode = (allowedSiblingNodeTypes, allowedChildNodeTypes, preferredMode) => {
    if (
        ((preferredMode === 'before' || preferredMode === 'after') && allowedSiblingNodeTypes.length) ||
        (preferredMode === 'into' && allowedChildNodeTypes.length)
    ) {
        return preferredMode;
    }
    if (allowedSiblingNodeTypes.length) {
        return 'after';
    }

    if (allowedChildNodeTypes.length) {
        return 'into';
    }

    return '';
};

const allowedSiblingsOrChildrenChanged = (previousProps, nextProps) => (
    !isEqual(
        previousProps.allowedSiblingNodeTypes.map(i => i.label).sort(),
        nextProps.allowedSiblingNodeTypes.map(i => i.label).sort()
    ) ||
    !isEqual(
        previousProps.allowedChildNodeTypes.map(i => i.label).sort(),
        nextProps.allowedChildNodeTypes.map(i => i.label).sort()
    )
);

@neos(globalRegistry => ({
    nodeTypesRegistry: globalRegistry.get('@neos-project/neos-ui-contentrepository')
}))
@connect((state, {nodeTypesRegistry}) => {
    const getAllowedSiblingNodeTypesSelector = selectors.CR.Nodes.makeGetAllowedSiblingNodeTypesSelector(nodeTypesRegistry);
    const getAllowedChildNodeTypesSelector = selectors.CR.Nodes.makeGetAllowedChildNodeTypesSelector(nodeTypesRegistry);

    return state => {
        const reference = $get('ui.selectNodeTypeModal.referenceNodeContextPath', state);
        if (!reference) {
            return {
                isOpen: false,
                allowedSiblingNodeTypes: [],
                allowedChildNodeTypes: []
            };
        }
        const referenceNodeType = selectors.CR.Nodes.getPathInNode(state, reference, 'nodeType');
        const role = nodeTypesRegistry.hasRole(referenceNodeType, 'document') ? 'document' : 'content';
        const allowedSiblingNodeTypes = nodeTypesRegistry.getGroupedNodeTypeList(getAllowedSiblingNodeTypesSelector(state, {reference, role}));
        const allowedChildNodeTypes = nodeTypesRegistry.getGroupedNodeTypeList(getAllowedChildNodeTypesSelector(state, {reference, role}));

        return {
            isOpen: $get('ui.selectNodeTypeModal.isOpen', state),
            preferredMode: $get('ui.selectNodeTypeModal.preferredMode', state),
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
        preferredMode: PropTypes.string,
        nodeTypesRegistry: PropTypes.object.isRequired,
        allowedSiblingNodeTypes: PropTypes.array,
        allowedChildNodeTypes: PropTypes.array,
        cancel: PropTypes.func.isRequired,
        apply: PropTypes.func.isRequired
    };

    state = {
        filterSearchTerm: '',
        insertMode: calculateInitialMode(
            this.props.allowedSiblingNodeTypes,
            this.props.allowedChildNodeTypes,
            this.props.preferredMode
        ),
        activeHelpMessageGroupPanel: '',
        showHelpMessageFor: ''
    };

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (allowedSiblingsOrChildrenChanged(this.props, nextProps)) {
            this.setState({
                insertMode: calculateInitialMode(
                    nextProps.allowedSiblingNodeTypes,
                    nextProps.allowedChildNodeTypes,
                    nextProps.preferredMode
                )
            });
        }
    }

    handleModeChange = insertMode => this.setState({insertMode});

    handleCancel = () => {
        const {cancel} = this.props;
        this.setState({
            filterSearchTerm: ''
        });
        cancel();
    }

    handleApply = nodeType => {
        const {apply} = this.props;
        const {insertMode} = this.state;

        apply(insertMode, nodeType);
    };

    handleCloseHelpMessage = () => {
        this.setState({
            showHelpMessageFor: ''
        });
    }

    handleHelpMessage = (nodeType, groupPanel) => {
        this.setState({
            showHelpMessageFor: nodeType === this.state.showHelpMessageFor ? '' : nodeType,
            activeHelpMessageGroupPanel: groupPanel
        });
    }

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

    renderSelectNodeTypeDialogHeader() {
        return (
            <div>
                <span className={style.modalTitle}>
                    <I18n fallback="Create new" id="createNew"/>
                </span>
            </div>
        );
    }

    handleNodeTypeFilterChange = filterSearchTerm => this.setState({filterSearchTerm});

    render() {
        const {insertMode, filterSearchTerm} = this.state;
        const {isOpen, allowedSiblingNodeTypes, allowedChildNodeTypes} = this.props;

        if (!isOpen) {
            return null;
        }

        return (
            <Dialog
                actions={[this.renderCancelAction()]}
                title={this.renderSelectNodeTypeDialogHeader()}
                onRequestClose={this.handleCancel}
                isOpen
                style="wide"
                id="neos-SelectNodeTypeDialog"
                >
                <div className={style.nodeTypeDialogHeader} key="nodeTypeDialogHeader">
                    <InsertModeSelector
                        mode={insertMode}
                        onSelect={this.handleModeChange}
                        enableAlongsideModes={Boolean(allowedSiblingNodeTypes.length)}
                        enableIntoMode={Boolean(allowedChildNodeTypes.length)}
                        />
                    <NodeTypeFilter
                        filterSearchTerm={filterSearchTerm}
                        onChange={this.handleNodeTypeFilterChange}
                        />
                </div>
                {this.getAllowedNodeTypesByCurrentInsertMode().map((group, key) => (
                    <div key={key}>
                        <NodeTypeGroupPanel
                            group={group}
                            filterSearchTerm={this.state.filterSearchTerm}
                            onSelect={this.handleApply}
                            showHelpMessageFor ={this.state.showHelpMessageFor}
                            activeHelpMessageGroupPanel ={this.state.activeHelpMessageGroupPanel}
                            onHelpMessage={this.handleHelpMessage}
                            onCloseHelpMessage={this.handleCloseHelpMessage}
                            />
                    </div>
                ))}
            </Dialog>
        );
    }
}
