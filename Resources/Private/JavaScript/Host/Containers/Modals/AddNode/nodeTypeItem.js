import React, {Component, PropTypes} from 'react';
import shallowCompare from 'react-addons-shallow-compare';
import {connect} from 'react-redux';
import omit from 'lodash.omit';
import {$transform, $get} from 'plow-js';

import {actions} from 'Host/Redux/index';
import NeosPropTypes from 'Shared/PropTypes/index';
import {
    Icon,
    GridItem,
    Button
} from 'Components/index';

import {I18n} from 'Host/Containers/index';

import {
    referenceNodeSelector
} from 'Host/Selectors/UI/AddNodeModal/index';

import style from './style.css';

@connect($transform({
    referenceNode: referenceNodeSelector,
    mode: $get('ui.addNodeModal.mode')
}), {
    closeModal: actions.UI.AddNodeModal.close,
    persistChange: actions.Changes.persistChange
})
class NodeTypeItem extends Component {
    static propTypes = {
        referenceNode: NeosPropTypes.cr.node,
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

    shouldComponentUpdate(...args) {
        //
        // ToDo: Revisit later, shallow compare may not be suitable for these nested objects
        //
        return shallowCompare(this, ...args);
    }

    render() {
        const {
            nodeType,
            ...restProps
        } = this.props;
        const rest = omit(restProps, ['referenceNode', 'mode', 'closeModal', 'persistChange', 'nodeType']);
        const {ui} = nodeType;

        return (
            <GridItem className={style.gridItem} width="third" {...rest}>
                <Button
                    hoverStyle="brand"
                    style="clean"
                    className={style.nodeType}
                    onClick={this.handleNodeTypeClick}
                    >
                    <Icon icon={ui.icon} className={style.nodeType__icon} padded="right"/>
                    <I18n id={ui.label} fallback={ui.label}/>
                </Button>
            </GridItem>
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
