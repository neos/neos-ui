import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import mergeClassNames from 'classnames';
import {$transform, $get} from 'plow-js';

import {Bar} from 'Host/Components/';

import UserDropDown from './UserDropDown/';
import PublishDropDown from './PublishDropDown/';
import MenuToggler from './MenuToggler/';
import LeftSideBarToggler from './LeftSideBarToggler/';
import EditModePanelToggler from './EditModePanelToggler/';
import style from './style.css';

@connect($transform({
    isHidden: $get('ui.fullScreen.isFullScreen')
}))
export default class TopBar extends Component {
    static propTypes = {
        isHidden: PropTypes.bool.isRequired
    };
    render() {
        const classNames = mergeClassNames({
            [style.topBar]: true,
            [style['topBar--isHidden']]: this.props.isHidden
        });
        return (
            <Bar position="top" className={classNames}>
                <MenuToggler className={style.topBar__btn} />
                <LeftSideBarToggler className={style.topBar__btn} />
                <EditModePanelToggler className={style.topBar__btn} />

                <div className={style.topBar__rightSidedActions}>
                      <UserDropDown />
                      <PublishDropDown />
                </div>
            </Bar>
        );
    }
}
