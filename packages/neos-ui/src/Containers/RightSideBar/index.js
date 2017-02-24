import React, {PureComponent, PropTypes} from 'react';
import mergeClassNames from 'classnames';
import {connect} from 'react-redux';
import {$transform, $get} from 'plow-js';
import IconButton from '@neos-project/react-ui-components/lib/IconButton/';
import SideBar from '@neos-project/react-ui-components/lib/SideBar/';
import {actions, selectors} from '@neos-project/neos-ui-redux-store';
import {neos} from '@neos-project/neos-ui-decorators';

import style from './style.css';

@neos(globalRegistry => ({
    containerRegistry: globalRegistry.get('containers')
}))
@connect($transform({
    isHidden: selectors.UI.RightSideBar.isHidden,
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

    handleToggle = () => {
        const {toggleSidebar} = this.props;

        toggleSidebar();
    }

    render() {
        const {isHidden, isFullScreen, containerRegistry} = this.props;
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
                onClick={this.handleToggle}
                />
        );

        const Inspector = containerRegistry.get('RightSideBar/Inspector');

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
