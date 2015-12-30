import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import mergeClassNames from 'classnames';
import {IconButton} from '../../Components/';
import DimensionSwitcher from './DimensionSwitcher/';
import style from './style.css';
import {immutableOperations} from '../../../Shared/Util';

const {$get} = immutableOperations;

@connect(state => ({
    isFringeLeft: $get(state, 'ui.leftSidebar.isHidden'),
    isFringeRight: $get(state, 'ui.rightSidebar.isHidden')
}))
export default class ContextBar extends Component {
    static propTypes = {
        isFringeLeft: PropTypes.bool.isRequired,
        isFringeRight: PropTypes.bool.isRequired
    };

    render() {
        const {isFringeLeft, isFringeRight} = this.props;
        const classNames = mergeClassNames({
            [style.contextBar]: true,
            [style['contextBar--isFringeLeft']]: isFringeLeft,
            [style['contextBar--isFringeRight']]: isFringeRight
        });

        return (
            <div className={classNames}>
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
