import React, {Component, PropTypes} from 'react';
import shallowCompare from 'react-addons-shallow-compare';
import omit from 'lodash.omit';
import Icon from '@neos-project/react-ui-components/lib/Icon/';
import Button from '@neos-project/react-ui-components/lib/Button/';
import Grid from '@neos-project/react-ui-components/lib/Grid/';

import I18n from '@neos-project/neos-ui-i18n';

import style from './style.css';

class NodeTypeItem extends Component {
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
        const rest = omit(restProps, ['nodeType']);
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
        this.props.onSelect(this.props.nodeType);
    }
}

export default NodeTypeItem;
