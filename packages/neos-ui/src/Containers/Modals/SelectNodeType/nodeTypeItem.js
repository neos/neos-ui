import React, {PureComponent, PropTypes} from 'react';
import {connect} from 'react-redux';
import {$transform, $get} from 'plow-js';
import Icon from '@neos-project/react-ui-components/lib/Icon/';
import Button from '@neos-project/react-ui-components/lib/Button/';
import Grid from '@neos-project/react-ui-components/lib/Grid/';

import {actions} from '@neos-project/neos-ui-redux-store';

import I18n from '@neos-project/neos-ui-i18n';

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
            ui: PropTypes.object
        }).isRequired
    };

    constructor(props) {
        super(props);

        this.handleNodeTypeClick = this.handleNodeTypeClick.bind(this);
    }

    render() {
        const {ui} = this.props.nodeType;
        const icon = $get('icon', ui);
        const label = $get('label', ui);

        return (
            <Grid.Col className={style.gridItem} width="third">
                <Button
                    hoverStyle="brand"
                    style="clean"
                    className={style.nodeType}
                    onClick={this.handleNodeTypeClick}
                    >
                    {icon && <Icon icon={icon} className={style.nodeType__icon} padded="right"/>}
                    <I18n id={label} fallback={label}/>
                </Button>
            </Grid.Col>
        );
    }

    handleNodeTypeClick() {
        this.props.onSelect(this.props.nodeType.name);
    }
}

export default NodeTypeItem;
