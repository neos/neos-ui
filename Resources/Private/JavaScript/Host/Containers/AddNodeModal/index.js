import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {$transform, $get} from 'plow-js';
import {actions} from 'Host/Redux/';
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
    referenceNode: $get('ui.addNodeModal.referenceNode'),
    mode: $get('ui.addNodeModal.mode')
}), {
    close: actions.UI.AddNodeModal.close
})
export default class AddNodeModal extends Component {
    static propTypes = {
        referenceNode: PropTypes.string.isRequired,
        mode: PropTypes.string.isRequired,
        close: PropTypes.func.isRequired
    };

    render() {
        console.log(this.props.referenceNode);
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
        const dummyNodeTypes = [{
            icon: 'font',
            title: 'Headline'
        }, {
            icon: 'file-text',
            title: 'Text'
        }, {
            icon: 'picture-o',
            title: 'Image'
        }, {
            icon: 'picture-o',
            title: 'Text with Image'
        }].map(nodeType => {
            nodeType.onClick = () => {
                console.log('Create NodeType:', nodeType);
            };

            return nodeType;
        });

        return (
            <Dialog
                isOpen={Boolean(this.props.referenceNode.length)}
                actions={actions}
                onRequestClose={this.props.close.bind(this)}
                id="neos__addNodeModal"
                >
                <Headline type="h1">
                    <I18n fallback="Create new" id="createNew" />
                </Headline>

                <Grid>
                    {dummyNodeTypes.map((nodeType, index) => {
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
}
