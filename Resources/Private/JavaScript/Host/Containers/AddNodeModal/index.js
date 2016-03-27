import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {$transform, $get} from 'plow-js';
import {actions} from 'Host/Redux/index';
import style from './style.css';
import {
    Icon,
    Dialog,
    Headline,
    Button,
    Grid,
    GridItem,
    I18n
} from 'Components/index';
import {
    referenceNodeSelector,
    nodeTypesForAddNodeModalSelector
} from 'Host/Selectors/UI/AddNodeModal/index';

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
        referenceNode: PropTypes.object,
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
                changeType = 'PackageFactory.Guevara:CreateBefore';
                break;
            case 'append':
                changeType = 'PackageFactory.Guevara:CreateAfter';
                break;
            default:
                changeType = 'PackageFactory.Guevara:Create';
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
            <GridItem width="33%" key={key}>
                <Button
                    hoverStyle="brand"
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
                <Headline type="h2">
                    <I18n fallback={group.label} id={group.label} />
                </Headline>
                <Grid>
                    {group.nodeTypes.map(this.renderNodeTypeItem.bind(this))}
                </Grid>
            </div>
        );
    }

    render() {
        if (this.props.referenceNode) {
            const actions = [
                <Button
                    style="clean"
                    hoverStyle="brand"
                    onClick={this.props.close}
                    isFocused={true}
                    >
                    <I18n fallback="Cancel" />
                </Button>
            ];

            return (
                <Dialog
                    isOpen={true}
                    actions={actions}
                    onRequestClose={this.props.close.bind(this)}
                    id="neos__addNodeModal"
                    >
                    <Headline type="h1">
                        <I18n fallback="Create new" id="createNew" />
                    </Headline>
                    {this.props.groupedAllowedNodeTypes.map(this.renderNodeTypeGroup.bind(this))}
                </Dialog>
            );
        }
        return null;
    }
}
