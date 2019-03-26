import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {$transform, $get} from 'plow-js';

import Icon from '@neos-project/react-ui-components/src/Icon/';
import IconButton from '@neos-project/react-ui-components/src/IconButton/';
import Button from '@neos-project/react-ui-components/src/Button/';
import {actions} from '@neos-project/neos-ui-redux-store';
import I18n from '@neos-project/neos-ui-i18n';

import style from './style.css';

@connect($transform({
    mode: $get('ui.addNodeModal.mode')
}), {
    closeModal: actions.UI.AddNodeModal.close,
    persistChanges: actions.Changes.persistChanges
})
class NodeTypeItem extends PureComponent {
    static propTypes = {
        onSelect: PropTypes.func.isRequired,
        onHelpMessage: PropTypes.func.isRequired,

        nodeType: PropTypes.shape({
            name: PropTypes.string.isRequired,
            ui: PropTypes.object
        }).isRequired,
        groupName: PropTypes.string.isRequired
    };

    render() {
        const {ui, name} = this.props.nodeType;
        const icon = $get('icon', ui);
        const label = $get('label', ui);
        const helpMessage = $get('help.message', ui);
        const {onHelpMessage, groupName} = this.props;

        return (
            <div className={style.nodeType}>
                <Button
                    hoverStyle="brand"
                    style="clean"
                    className={style.nodeType__item}
                    onClick={this.handleNodeTypeClick}
                    title={helpMessage ? helpMessage : ''}
                >
                    <span>
                        <span className={style.nodeType__iconWrapper}>
                            {icon && <Icon icon={icon} size="lg" className={style.nodeType__icon} />}
                        </span>
                        <I18n id={label} fallback={label}/>
                    </span>
                </Button>
                {helpMessage ? <IconButton className={style.nodeType__helpIcon} onClick={() => onHelpMessage(name, groupName)} icon="question-circle" /> : null}
            </div>
        );
    }

    handleNodeTypeClick = () => {
        this.props.onSelect(this.props.nodeType.name);
    }
}

export default NodeTypeItem;
