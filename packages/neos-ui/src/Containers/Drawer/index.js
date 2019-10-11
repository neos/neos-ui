import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import mergeClassNames from 'classnames';
import {connect} from 'react-redux';
import {$transform, $get} from 'plow-js';

import {actions} from '@neos-project/neos-ui-redux-store';
import {neos} from '@neos-project/neos-ui-decorators';

import MenuItemGroup from './MenuItemGroup/index';
import style from './style.css';
import {TARGET_WINDOW, TARGET_CONTENT_CANVAS, THRESHOLD_MOUSE_LEAVE} from './constants';

@neos(globalRegistry => ({
    containerRegistry: globalRegistry.get('containers')
}))
@connect($transform({
    isHidden: $get('ui.drawer.isHidden'),
    collapsedMenuGroups: $get('ui.drawer.collapsedMenuGroups')
}), {
    hideDrawer: actions.UI.Drawer.hide,
    toggleMenuGroup: actions.UI.Drawer.toggleMenuGroup,
    setContentCanvasSrc: actions.UI.ContentCanvas.setSrc
})
export default class Drawer extends PureComponent {
    static propTypes = {
        isHidden: PropTypes.bool.isRequired,
        collapsedMenuGroups: PropTypes.array.isRequired,

        hideDrawer: PropTypes.func.isRequired,
        toggleMenuGroup: PropTypes.func.isRequired,
        setContentCanvasSrc: PropTypes.func.isRequired,

        containerRegistry: PropTypes.object.isRequired,

        menuData: PropTypes.objectOf(
            PropTypes.shape({
                icon: PropTypes.string,
                label: PropTypes.string.isRequired,
                uri: PropTypes.string.isRequired,
                target: PropTypes.string,

                children: PropTypes.arrayOf(
                    PropTypes.shape({
                        icon: PropTypes.string,
                        label: PropTypes.string.isRequired,
                        uri: PropTypes.string,
                        target: PropTypes.string,
                        isActive: PropTypes.bool.isReqired,
                        skipI18n: PropTypes.bool.isReqired
                    })
                )
            })
        ).isRequired
    };

    state = {
        mouseLeaveTimeout: null
    };

    handleMouseLeave = () => {
        const {hideDrawer} = this.props;
        const {mouseLeaveTimeout} = this.state;

        if (!mouseLeaveTimeout) {
            const timeout = setTimeout(() => {
                hideDrawer();
                this.setState({
                    mouseLeaveTimeout: null
                });
            }, THRESHOLD_MOUSE_LEAVE);

            this.setState({
                mouseLeaveTimeout: timeout
            });
        }
    }

    handleMouseEnter = () => {
        const {mouseLeaveTimeout} = this.state;

        if (mouseLeaveTimeout) {
            clearTimeout(mouseLeaveTimeout);
            this.setState({
                mouseLeaveTimeout: null
            });
        }
    }

    handleMenuItemClick = (target, uri) => {
        const {setContentCanvasSrc, hideDrawer} = this.props;

        switch (target) {
            case TARGET_CONTENT_CANVAS:
                setContentCanvasSrc(uri);
                hideDrawer();
                break;

            case TARGET_WINDOW:
            default:
                // we do not need to do anything here, as MenuItems of type TARGET_WINDOW automatically
                // wrap their contents in an <a>-tag (such that the user can crtl-click it to open in a
                // new window).
                break;
        }
    }

    render() {
        const {isHidden, menuData, collapsedMenuGroups, toggleMenuGroup, containerRegistry} = this.props;
        const classNames = mergeClassNames({
            [style.drawer]: true,
            [style['drawer--isHidden']]: isHidden
        });

        const BottomComponents = containerRegistry.getChildren('Drawer/Bottom');

        return (
            <div
                className={classNames}
                onMouseEnter={this.handleMouseEnter}
                onMouseLeave={this.handleMouseLeave}
                aria-hidden={isHidden ? 'true' : 'false'}
                >
                <div className={style.drawer__menuItemGroupsWrapper}>
                    {!isHidden && Object.entries(menuData).map(([menuGroup, menuGroupConfiguration]) => (
                        <MenuItemGroup
                            key={menuGroup}
                            onClick={this.handleMenuItemClick}
                            onChildClick={this.handleMenuItemClick}
                            collapsed={Boolean(collapsedMenuGroups.includes(menuGroup))}
                            handleMenuGroupToggle={() => toggleMenuGroup(menuGroup)}
                            {...menuGroupConfiguration}
                            />
                    ))}
                </div>
                <div className={style.drawer__bottom}>
                    {BottomComponents.map((Item, key) => <Item key={key}/>)}
                </div>
            </div>
        );
    }
}
