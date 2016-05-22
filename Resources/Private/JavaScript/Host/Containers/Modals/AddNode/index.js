import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {$transform, $get} from 'plow-js';

import {actions} from 'Host/Redux/index';
import NeosPropTypes from 'Shared/PropTypes/index';
import {
    Icon,
    Dialog,
    Button,
    Grid,
    GridItem,
    I18n,
    ToggablePanel
} from 'Components/index';
import {I18n} from 'Host/Containers/index';
import {
    referenceNodeSelector,
    nodeTypesForAddNodeModalSelector
} from 'Host/Selectors/UI/AddNodeModal/index';

import style from './style.css';

@connect($transform({
    referenceNode: referenceNodeSelector,
    groupedAllowedNodeTypes: nodeTypesForAddNodeModalSelector,
    mode: $get('ui.addNodeModal.mode'),
    collapsedGroups: $get('ui.addNodeModal.collapsedGroups')
}), {
    close: actions.UI.AddNodeModal.close,
    toggleGroup: actions.UI.AddNodeModal.toggleGroup,
    persistChange: actions.Changes.persistChange
})
export default class AddNodeModal extends Component {
    static propTypes = {
        referenceNode: NeosPropTypes.cr.node,
        groupedAllowedNodeTypes: PropTypes.array,
        mode: PropTypes.string.isRequired,
        collapsedGroups: PropTypes.array.isRequired,

        close: PropTypes.func.isRequired,
        toggleGroup: PropTypes.func.isRequired,
        persistChange: PropTypes.func.isRequired
    };

    shouldComponentUpdate({referenceNode}) {
        return referenceNode !== this.props.referenceNode;
    }

    renderNodeTypeItem(nodeType, key) {
        let changeType;
        switch (this.props.mode) {
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
        const onClick = () => {
            const change = {
                type: changeType,
                subject: this.props.referenceNode.contextPath,
                payload: {
                    nodeType: nodeType.name,
                    initialProperties: {
                        title: 'test'
                    }
                }
            };
            this.props.persistChange(change);
            this.props.close();
        };
        return (
            <GridItem className={style.gridItem} width="third" key={key}>
                <Button
                    hoverStyle="brand"
                    style="clean"
                    className={style.nodeType}
                    onClick={onClick}
                    >
                    <Icon icon={nodeType.ui.icon} className={style.nodeType__icon} padded="right" />
                    <I18n id={nodeType.ui.label} fallback={nodeType.ui.label} />
                </Button>
            </GridItem>
        );
    }

    renderNodeTypeGroup(group, key) {
        const groupName = group.name;
        return (
            <div key={key}>
                <ToggablePanel
                    isOpen={this.props.collapsedGroups.indexOf(groupName) === -1}
                    togglePanel={() => this.props.toggleGroup(groupName)}
                    >
                    <ToggablePanel.Header className={style.groupHeader}>
                        <I18n className={style.groupTitle} fallback={group.label} id={group.label} />
                    </ToggablePanel.Header>
                    <ToggablePanel.Contents className={style.groupContents}>
                        <Grid className={style.grid} id="neos__addNodeModal__grid">
                            {group.nodeTypes.map(this.renderNodeTypeItem.bind(this))}
                        </Grid>
                    </ToggablePanel.Contents>
                </ToggablePanel>
            </div>
        );
    }

    render() {
        if (this.props.referenceNode) {
            const actions = [
                <Button
                    style="lighter"
                    hoverStyle="brand"
                    onClick={this.props.close}
                    isFocused={true}
                    id="neos__addNodeModal__cancel"
                    >
                    <I18n fallback="Cancel" />
                </Button>
            ];

            let insertModeText;
            switch (this.props.mode) {
                case 'prepend':
                    insertModeText = <span><I18n fallback="Create new" id="createNew" /> <I18n fallback="before" id="before" /> <Icon icon="level-up" /></span>;
                    break;
                case 'append':
                    insertModeText = <span><I18n fallback="Create new" id="createNew" /> <I18n fallback="after" id="after" /> <Icon icon="level-down" /></span>;
                    break;
                default:
                    insertModeText = <span><I18n fallback="Create new" id="createNew" /> <I18n fallback="into" id="into" /> <Icon icon="long-arrow-right" /></span>;
                    break;
            }

            return (
                <Dialog
                    isOpen={true}
                    wide={true}
                    actions={actions}
                    title={insertModeText}
                    onRequestClose={this.props.close.bind(this)}
                    id="neos__addNodeModal"
                    >
                    {this.props.groupedAllowedNodeTypes.map(this.renderNodeTypeGroup.bind(this))}
                </Dialog>
            );
        }
        return null;
    }
}
