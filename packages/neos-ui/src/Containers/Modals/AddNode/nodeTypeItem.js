import React, {PureComponent, PropTypes} from 'react';
import {connect} from 'react-redux';
import {$transform, $get} from 'plow-js';
import Icon from '@neos-project/react-ui-components/lib/Icon/';
import Button from '@neos-project/react-ui-components/lib/Button/';
import Grid from '@neos-project/react-ui-components/lib/Grid/';

import {actions, selectors} from '@neos-project/neos-ui-redux-store';

import I18n from '@neos-project/neos-ui-i18n';

const {referenceNodeSelector} = selectors.UI.AddNodeModal;

import style from './style.css';

@connect($transform({
    mode: $get('ui.addNodeModal.mode')
}), {
    closeModal: actions.UI.AddNodeModal.close,
    persistChange: actions.Changes.persistChange
})
class NodeTypeItem extends PureComponent {
    static propTypes = {
        onSelect: PropTypes.func.isRequired,

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
        const {ui} = this.props.nodeType;

        return (
            <Grid.Col className={style.gridItem} width="third">
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
        this.props.onSelect(this.props.nodeType);
    }
}

export default NodeTypeItem;
