import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import mergeClassNames from 'classnames';
import {$transform, $get} from 'plow-js';

import {Bar} from 'Components/index';

import UserDropDown from './UserDropDown/index';
import PublishDropDown from './PublishDropDown/index';
import MenuToggler from './MenuToggler/index';
import LeftSideBarToggler from './LeftSideBarToggler/index';
import EditModePanelToggler from './EditModePanelToggler/index';
import style from './style.css';

@connect($transform({
    isHidden: $get('ui.fullScreen.isFullScreen')
}))
export default class PrimaryToolbar extends Component {
    static propTypes = {
        isHidden: PropTypes.bool.isRequired
    };
    render() {
        const classNames = mergeClassNames({
            [style.primaryToolbar]: true,
            [style['primaryToolbar--isHidden']]: this.props.isHidden
        });
        return (
            <Bar position="top" className={classNames}>
                <MenuToggler className={style.primaryToolbar__btn} />
                <LeftSideBarToggler className={style.primaryToolbar__btn} />
                <EditModePanelToggler className={style.primaryToolbar__btn} />

                <div className={style.primaryToolbar__rightSidedActions}>
                      <UserDropDown />
                      <PublishDropDown />
                </div>
            </Bar>
        );
    }
}
