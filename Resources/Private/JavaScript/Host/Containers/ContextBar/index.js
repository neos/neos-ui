import React, {Component} from 'react';
import {connect} from 'react-redux';
import {IconButton} from '../../Components/';
import DimensionSwitcher from './DimensionSwitcher/';
import style from './style.css';

@connect()
export default class ContextBar extends Component {
    render() {
        return (
            <div className={style.contextBar}>
                <DimensionSwitcher />

                <div className={style.contextBar__rightHandedActions}>
                    <IconButton icon="external-link" onClick={this.onClickOpenInNewTab.bind(this)} />
                    <IconButton icon="expand" onClick={this.onClickHideUi.bind(this)} />
                </div>
            </div>
        );
    }

    onClickOpenInNewTab() {
        console.log('open the current opened session into a new browser tab.');
    }

    onClickHideUi() {
        console.log('hide the whole ui yo.');
    }
}
