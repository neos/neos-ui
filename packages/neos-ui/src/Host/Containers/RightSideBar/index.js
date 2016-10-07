import React, {Component, PropTypes} from 'react';
import shallowCompare from 'react-addons-shallow-compare';
import mergeClassNames from 'classnames';
import {connect} from 'react-redux';
import {$transform, $get} from 'plow-js';
import IconButton from '@neos-project/react-ui-components/lib/IconButton/';
import SideBar from '@neos-project/react-ui-components/lib/SideBar/';
import {actions} from 'Host/Redux/index';

import style from './style.css';

import Inspector from './Inspector/index';

@connect($transform({
    isHidden: $get('ui.rightSideBar.isHidden'),
    isFullScreen: $get('ui.fullScreen.isFullScreen')
}), {
    toggleSidebar: actions.UI.RightSideBar.toggle
})
export default class RightSideBar extends Component {
    static propTypes = {
        isHidden: PropTypes.bool.isRequired,
        isFullScreen: PropTypes.bool.isRequired,
        toggleSidebar: PropTypes.func.isRequired
    };

    shouldComponentUpdate(...args) {
        return shallowCompare(this, ...args);
    }

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
