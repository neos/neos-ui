import React, {PureComponent, PropTypes} from 'react';
import {connect} from 'react-redux';
import omit from 'lodash.omit';
import {$transform, $get} from 'plow-js';
import Icon from '@neos-project/react-ui-components/lib/Icon/';
import Button from '@neos-project/react-ui-components/lib/Button/';
import Grid from '@neos-project/react-ui-components/lib/Grid/';

import {actions, selectors} from '@neos-project/neos-ui-redux-store';
import * as NeosPropTypes from '@neos-project/react-proptypes';

import I18n from '@neos-project/neos-ui-i18n';

const {referenceNodeSelector} = selectors.UI.AddNodeModal;

import style from './style.css';

@connect($transform({
    referenceNode: referenceNodeSelector,
    mode: $get('ui.addNodeModal.mode')
}), {
    closeModal: actions.UI.AddNodeModal.close,
    persistChange: actions.Changes.persistChange
})
class NodeTypeItem extends PureComponent {
    static propTypes = {
        referenceNode: NeosPropTypes.node,
        mode: PropTypes.string.isRequired,

        closeModal: PropTypes.func.isRequired,
        persistChange: PropTypes.func.isRequired,

        nodeType: PropTypes.shape({
            name: PropTypes.string.isRequired,
            ui: PropTypes.object.isRequired
        }).isRequired
    };

    constructor(props) {
        super(props);

        this.handleNodeTypeClick = this.handleNodeTypeClick.bind(this);
    }

    render() {
        const {
            nodeType,
            ...restProps
        } = this.props;
        const rest = omit(restProps, ['referenceNode', 'mode', 'closeModal', 'persistChange', 'nodeType']);
        const {ui} = nodeType;

        return (
            <Grid.Col className={style.gridItem} width="third" {...rest}>
                <Button
                    hoverStyle="brand"
                    style="clean"
                    className={style.nodeType}
                    onClick={this.handleNodeTypeClick}
                    >
                    <Icon icon={ui.icon} className={style.nodeType__icon} padded="right"/>
                    <I18n id={ui.label} fallback={ui.label}/>
                </Button>
            </Grid.Col>
        );
    }

    handleNodeTypeClick() {
        const {
            nodeType,
            mode,
            referenceNode,
            persistChange,
            closeModal
        } = this.props;
        const {name} = nodeType;
        let changeType;

        switch (mode) {
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
                nodeType: name,
                initialProperties: {
                    title: 'test'
                }
            }
        };
        persistChange(change);
        closeModal();
    }
}

export default NodeTypeItem;
