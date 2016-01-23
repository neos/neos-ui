import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import mergeClassNames from 'classnames';
import {IconButton} from 'Host/Components/';
import DimensionSwitcher from './DimensionSwitcher/';
import style from './style.css';
import {immutableOperations} from 'Shared/Util/';

const {$get} = immutableOperations;

@connect(state => ({
    isFringedLeft: $get(state, 'ui.leftSideBar.isHidden'),
    isFringedRight: $get(state, 'ui.rightSideBar.isHidden')
}))
export default class ContextBar extends Component {
    static propTypes = {
        isFringedLeft: PropTypes.bool.isRequired,
        isFringedRight: PropTypes.bool.isRequired
    };

    render() {
        const {isFringedLeft, isFringedRight} = this.props;
        const classNames = mergeClassNames({
            [style.contextBar]: true,
            [style['contextBar--isFringeLeft']]: isFringedLeft,
            [style['contextBar--isFringeRight']]: isFringedRight
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
