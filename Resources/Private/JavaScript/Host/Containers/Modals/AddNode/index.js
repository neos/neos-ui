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
    I18n
} from 'Components/index';
import {
    referenceNodeSelector,
    nodeTypesForAddNodeModalSelector
} from 'Host/Selectors/UI/AddNodeModal/index';

import style from './style.css';

@connect($transform({
    referenceNode: referenceNodeSelector,
    groupedAllowedNodeTypes: nodeTypesForAddNodeModalSelector,
    mode: $get('ui.addNodeModal.mode')
}), {
    close: actions.UI.AddNodeModal.close,
    persistChange: actions.Changes.persistChange
})
export default class AddNodeModal extends Component {
    static propTypes = {
        referenceNode: NeosPropTypes.cr.node,
        groupedAllowedNodeTypes: PropTypes.array,
        mode: PropTypes.string.isRequired,

        close: PropTypes.func.isRequired,
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
            <GridItem className={style.gridItem} width="33%" key={key}>
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
        return (
            <div key={key}>
                <div className={style.groupTitle}>
                    <I18n fallback={group.label} id={group.label} />
                </div>
                <Grid className={style.grid} id="neos__addNodeModal__grid">
                    {group.nodeTypes.map(this.renderNodeTypeItem.bind(this))}
                </Grid>
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

            return (
                <Dialog
                    isOpen={true}
                    wide={true}
                    actions={actions}
                    title={<I18n fallback="Create new" id="createNew" />}
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
