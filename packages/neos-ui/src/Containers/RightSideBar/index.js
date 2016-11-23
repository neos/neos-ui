import React, {PureComponent, PropTypes} from 'react';
import mergeClassNames from 'classnames';
import {connect} from 'react-redux';
import {$transform, $get} from 'plow-js';
import IconButton from '@neos-project/react-ui-components/lib/IconButton/';
import SideBar from '@neos-project/react-ui-components/lib/SideBar/';
import {actions} from '@neos-project/neos-ui-redux-store';

import style from './style.css';

import Inspector from './Inspector/index';

@connect($transform({
    isHidden: $get('ui.rightSideBar.isHidden'),
    isFullScreen: $get('ui.fullScreen.isFullScreen')
}), {
    toggleSidebar: actions.UI.RightSideBar.toggle
})
export default class RightSideBar extends PureComponent {
    static propTypes = {
        isHidden: PropTypes.bool.isRequired,
        isFullScreen: PropTypes.bool.isRequired,
        toggleSidebar: PropTypes.func.isRequired
    };

    render() {
        const {isHidden, isFullScreen, toggleSidebar} = this.props;
        const isSideBarHidden = isHidden || isFullScreen;
        const classNames = mergeClassNames({
            [style.rightSideBar]: true,
            [style['rightSideBar--isHidden']]: isSideBarHidden
        });
        const toggleIcon = isHidden ? 'chevron-left' : 'chevron-right';
        const toggle = isFullScreen ? null : (
            <IconButton
                icon={toggleIcon}
                className={style.rightSideBar__toggleBtn}
                onClick={toggleSidebar}
                />
        );

        return (
            <SideBar
                position="right"
                className={classNames}
                aria-hidden={isSideBarHidden ? 'true' : 'false'}
                >
                {toggle}
                <Inspector/>
            </SideBar>
        );
    }
}
