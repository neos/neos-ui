import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import mergeClassNames from 'classnames';
import {connect} from 'react-redux';
import {IconButton, SideBar} from '@neos-project/react-ui-components';
import {actions, selectors} from '@neos-project/neos-ui-redux-store';
import {neos} from '@neos-project/neos-ui-decorators';
import {translate} from '@neos-project/neos-ui-i18n';

import style from './style.module.css';

@neos(globalRegistry => ({
    containerRegistry: globalRegistry.get('containers')
}))
@connect(state => ({
    isHidden: selectors.UI.RightSideBar.isHidden(state),
    isFullScreen: state?.ui?.fullScreen?.isFullScreen
}), {
    toggleSidebar: actions.UI.RightSideBar.toggle
})
export default class RightSideBar extends PureComponent {
    static propTypes = {
        containerRegistry: PropTypes.object.isRequired,

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
        const isSideBarHidden = isHidden;
        const classNames = mergeClassNames({
            [style.rightSideBar]: true,
            [style['rightSideBar--isHidden']]: isSideBarHidden,
            [style['rightSideBar--isFullScreen']]: isFullScreen
        });
        const toggleIcon = isHidden ? 'chevron-circle-left' : 'chevron-circle-right';
        const toggle = (
            <IconButton
                id="neos-ToggleInspector"
                icon={toggleIcon}
                className={style.rightSideBar__toggleBtn}
                hoverStyle="clean"
                onClick={this.handleToggle}
                title={translate('Neos.Neos.Ui:Main:toggleInspector')}
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
                <div className={style.rightSideBar__components}>
                    {RightSideBarComponents.map((Item, key) => <Item key={key}/>)}
                </div>
            </SideBar>
        );
    }
}
