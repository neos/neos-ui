import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {actions} from 'Host/Redux/';
import mergeClassNames from 'classnames';
import {IconButton} from 'Host/Components/';
import DimensionSwitcher from './DimensionSwitcher/';
import style from './style.css';
import {immutableOperations} from 'Shared/Utilities/';

const {$get} = immutableOperations;

@connect(state => ({
    isFringedLeft: $get(state, 'ui.leftSideBar.isHidden'),
    isFringedRight: $get(state, 'ui.rightSideBar.isHidden'),
    isFullScreen: $get(state, 'ui.fullScreen.isFullScreen')
}))
export default class ContextBar extends Component {
    static propTypes = {
        isFringedLeft: PropTypes.bool.isRequired,
        isFringedRight: PropTypes.bool.isRequired,
        isFullScreen: PropTypes.bool.isRequired,
        dispatch: PropTypes.func.isRequired
    };

    render() {
        const {isFringedLeft, isFringedRight, isFullScreen} = this.props;
        const classNames = mergeClassNames({
            [style.contextBar]: true,
            [style['contextBar--isFringeLeft']]: isFringedLeft,
            [style['contextBar--isFringeRight']]: isFringedRight,
            [style['contextBar--isHidden']]: isFullScreen
        });

        return (
            <div className={classNames}>
                <DimensionSwitcher />

                <div className={style.contextBar__rightHandedActions}>
                    <IconButton icon="external-link" onClick={this.onClickOpenInNewTab.bind(this)} />
                    <IconButton icon="expand" onClick={this.onClickToggleFullScreen.bind(this)} />
                </div>
            </div>
        );
    }

    onClickOpenInNewTab() {
        console.log('open the current opened session into a new browser tab.');
    }

    onClickToggleFullScreen() {
        this.props.dispatch(actions.UI.FullScreen.toggle());
    }
}
