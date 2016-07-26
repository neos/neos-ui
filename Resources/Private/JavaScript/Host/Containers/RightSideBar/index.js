import React, {Component, PropTypes} from 'react';
import mergeClassNames from 'classnames';
import {connect} from 'react-redux';
import {$transform, $get} from 'plow-js';
import {
    SideBar,
    IconButton
} from 'Components/index';
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

    render() {
        const {isHidden, isFullScreen} = this.props;
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
              onClick={() => this.props.toggleSidebar()}
              id="neos__rightSideBar__toggler"
              />
        );

        /* eslint-disable no-inline-comments */
        return (
            <SideBar
                position="right"
                className={classNames}
                id="neos__rightSideBar"
                aria-hidden={isSideBarHidden ? 'true' : 'false'}
                >
                {toggle}
                <Inspector />
            </SideBar>
        );
        /* eslint-enable no-inline-comments */
    }
}
