import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {$transform, $get} from 'plow-js';
import {actions} from 'Host/Redux/';
import {referenceNodeSelector, allowedNodeTypesSelector} from 'Host/Selectors/UI/AddNodeModal/';
import style from './style.css';
import {
    Icon,
    Dialog,
    Headline,
    Button,
    Grid,
    GridItem,
    I18n
} from 'Host/Components/';

@connect($transform({
    nodeTypes: $get('cr.nodeTypes.byName'),
    referenceNode: referenceNodeSelector,
    allowedNodeTypes: allowedNodeTypesSelector,
    mode: $get('ui.addNodeModal.mode')
}), {
    close: actions.UI.AddNodeModal.close
})
export default class AddNodeModal extends Component {
    static propTypes = {
        nodeTypes: PropTypes.object.isRequired,
        referenceNode: PropTypes.object,
        allowedNodeTypes: PropTypes.array,
        mode: PropTypes.string.isRequired,
        close: PropTypes.func.isRequired
    };

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
            const allowedNodeTypes = this.props.allowedNodeTypes.map(nodeType => ({
                icon: nodeType.ui.icon,
                title: nodeType.ui.label
            })).map(nodeType => {
                nodeType.onClick = () => {
                    console.log('Create NodeType:', nodeType);
                };
                return nodeType;
            });

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

                    <Grid>
                        {allowedNodeTypes.map((nodeType, index) => {
                            const {
                                icon,
                                title,
                                onClick
                            } = nodeType;

                            return (
                                <GridItem width="33%" key={index}>
                                    <Button
                                        hoverStyle="brand"
                                        className={style.nodeType}
                                        onClick={onClick}
                                        >
                                        <Icon icon={icon} className={style.nodeType__icon} padded="right" />
                                        <I18n fallback={title} />
                                    </Button>
                                </GridItem>
                            );
                        })}
                    </Grid>
                </Dialog>
            );
        }
        return null;
    }
}
