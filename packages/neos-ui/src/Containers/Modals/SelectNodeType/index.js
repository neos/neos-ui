import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {$get} from 'plow-js';

import {neos} from '@neos-project/neos-ui-decorators';
import {actions, selectors} from '@neos-project/neos-ui-redux-store';

import Icon from '@neos-project/react-ui-components/src/Icon/';
import IconButton from '@neos-project/react-ui-components/src/IconButton/';
import Button from '@neos-project/react-ui-components/src/Button/';
import Dialog from '@neos-project/react-ui-components/src/Dialog/';
import I18n from '@neos-project/neos-ui-i18n';

import {InsertModeSelector} from '@neos-project/neos-ui-containers';
import NodeTypeGroupPanel from './nodeTypeGroupPanel';
import NodeTypeFilter from './nodeTypeFilter';
import style from './style.css';

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

    state = {
        filterSearchTerm: '',
        insertMode: calculateInitialMode(
            this.props.allowedSiblingNodeTypes,
            this.props.allowedChildNodeTypes
        ),
        showHelpMessageFor: ''
    };

    componentWillReceiveProps(nextProps) {
        if (this.props.allowedSiblingNodeTypes !== nextProps.allowedSiblingNodeTypes ||
            this.props.allowedChildNodeTypes !== nextProps.allowedChildNodeTypes) {
            this.setState({
                insertMode: calculateInitialMode(
                    nextProps.allowedSiblingNodeTypes,
                    nextProps.allowedChildNodeTypes
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
        const {insertMode, filterSearchTerm} = this.state;
        const {allowedSiblingNodeTypes, allowedChildNodeTypes} = this.props;

        return (
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
        );
    }

    handleNodeTypeFilterChange = filterSearchTerm => this.setState({filterSearchTerm});

    renderHelpMessage = () => {
        const {showHelpMessageFor} = this.state;
        const {nodeTypesRegistry} = this.props;

        const nodeType = nodeTypesRegistry.getNodeType(showHelpMessageFor);
        const message = $get('ui.help.message', nodeType);

        const icon = $get('ui.icon', nodeType);
        const label = $get('ui.label', nodeType);

        return (
            <div className={style.helpMessage__wrapper}>
                <div className={style.helpMessage}>
                    <span className={style.helpMessage__label}>
                        {icon && <Icon icon={icon} className={style.nodeType__icon} padded="right"/>}
                        <I18n id={label} fallback={label}/>
                    </span>
                    {message}
                </div>

                <IconButton className={style.helpMessage__closeButton} icon="times" onClick={() => this.handleCloseHelpMessage()} />
            </div>
        );
    }

    handleCloseHelpMessage = () => {
        this.setState({
            showHelpMessageFor: ''
        });
    }

    handleHelpMessage = nodeType => {
        this.setState({
            showHelpMessageFor: nodeType === this.state.showHelpMessageFor ? '' : nodeType
        });
    }

    render() {
        const {isOpen} = this.props;
        const {showHelpMessageFor} = this.state;

        const showHelpMessage = showHelpMessageFor !== '';

        if (!isOpen) {
            return null;
        }

        return (
            <Dialog
                className={showHelpMessage ? style.dialog__padded : ''}
                actions={[this.renderCancelAction()]}
                title={[this.renderSelectNodeTypeDialogHeader()]}
                onRequestClose={this.handleCancel}
                isOpen
                style="wide"
                id="neos-SelectNodeTypeDialog"
                >
                {this.getAllowedNodeTypesByCurrentInsertMode().map((group, key) => (
                    <div key={key}>
                        <NodeTypeGroupPanel
                            group={group}
                            filterSearchTerm={this.state.filterSearchTerm}
                            onSelect={this.handleApply}
                            onHelpMessage={this.handleHelpMessage}
                            />
                    </div>
                ))}
                {showHelpMessage ? this.renderHelpMessage() : null}
            </Dialog>
        );
    }
}
