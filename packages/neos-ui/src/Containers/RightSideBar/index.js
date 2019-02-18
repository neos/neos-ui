import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import mergeClassNames from 'classnames';
import {connect} from 'react-redux';
import {$transform, $get} from 'plow-js';
import IconButton from '@neos-project/react-ui-components/src/IconButton/';
import SideBar from '@neos-project/react-ui-components/src/SideBar/';
import {actions, selectors} from '@neos-project/neos-ui-redux-store';
import {neos} from '@neos-project/neos-ui-decorators';

import style from './style.css';

@neos(globalRegistry => ({
    containerRegistry: globalRegistry.get('containers'),
    i18nRegistry: globalRegistry.get('i18n')
}))
@connect($transform({
    isHidden: selectors.UI.RightSideBar.isHidden,
    isFullScreen: $get('ui.fullScreen.isFullScreen')
}), {
    toggleSidebar: actions.UI.RightSideBar.toggle
})
export default class RightSideBar extends PureComponent {
    static propTypes = {
        containerRegistry: PropTypes.object.isRequired,
        i18nRegistry: PropTypes.object.isRequired,

        isHidden: PropTypes.bool.isRequired,
        isFullScreen: PropTypes.bool.isRequired,
        toggleSidebar: PropTypes.func.isRequired
    };

    handleToggle = () => {
        const {toggleSidebar} = this.props;

        toggleSidebar();
    }

    render() {
        const {isHidden, isFullScreen, containerRegistry, i18nRegistry} = this.props;
        const isSideBarHidden = isHidden || isFullScreen;
        const classNames = mergeClassNames({
            [style.rightSideBar]: true,
            [style['rightSideBar--isHidden']]: isSideBarHidden
        });
        const toggleIcon = isHidden ? 'chevron-circle-left' : 'chevron-circle-right';
        const toggle = isFullScreen ? null : (
            <IconButton
                id="neos-ToggleInspector"
                icon={toggleIcon}
                className={style.rightSideBar__toggleBtn}
                hoverStyle="clean"
                onClick={this.handleToggle}
                title={i18nRegistry.translate('Neos.Neos:Main:toggleInspector')}
                />
        );

        const RightSideBarComponents = containerRegistry.getChildren('RightSideBar');

        return (
            <SideBar
                position="right"
                className={classNames}
                role="form"
                aria-live="assertive"
                aria-hidden={isSideBarHidden ? 'true' : 'false'}
                >
                {toggle}
                {!isSideBarHidden && RightSideBarComponents.map((Item, key) => <Item key={key}/>)}
            </SideBar>
        );
    }
}
