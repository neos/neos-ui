/*
 * This file is part of the Neos.Neos.Ui package.
 *
 * (c) Contributors of the Neos Project - www.neos.io
 *
 * This package is Open Source Software. For the full copyright and license
 * information, please view the LICENSE file which was distributed with this
 * source code.
 */
import React from 'react';
import mergeClassNames from 'classnames';
// @ts-ignore
import {connect} from 'react-redux';

import {actions} from '@neos-project/neos-ui-redux-store';
import {neos} from '@neos-project/neos-ui-decorators';
import {GlobalState} from '@neos-project/neos-ui-redux-store/src/System';
import {SynchronousRegistry} from '@neos-project/neos-ui-extensibility';

import MenuItemGroup from './MenuItemGroup/index';
import style from './style.module.css';
import {THRESHOLD_MOUSE_LEAVE} from './constants';

const withReduxState = connect((state: GlobalState) => ({
    isHidden: state?.ui?.drawer?.isHidden,
    collapsedMenuGroups: state?.ui?.drawer?.collapsedMenuGroups
}), {
    hideDrawer: actions.UI.Drawer.hide,
    toggleMenuGroup: actions.UI.Drawer.toggleMenuGroup
});

const withNeosGlobals = neos(globalRegistry => ({
    containerRegistry: globalRegistry.get('containers')
}));

const StatelessDrawer: React.FC<{
    isHidden: boolean;
    collapsedMenuGroups: string[],

    hideDrawer: () => void;
    toggleMenuGroup: (menuGroup: string) => void;

    containerRegistry: SynchronousRegistry<any>;

    menuData: {
        icon?: string;
        label: string;
        uri: string;
        target?: string;

        children: {
            icon?: string;
            label: string;
            uri?: string;
            isActive: boolean;
            skipI18n: boolean;
        }[];
    }[];
}> = (props) => {
    const mouseLeaveTimeoutRef = React.useRef<null | ReturnType<typeof setTimeout>>(null);
    const handleMouseEnter = React.useCallback(() => {
        if (mouseLeaveTimeoutRef.current) {
            clearTimeout(mouseLeaveTimeoutRef.current);
            mouseLeaveTimeoutRef.current = null;
        }
    }, []);
    const handleMouseLeave = React.useCallback(() => {
        if (!mouseLeaveTimeoutRef.current) {
            mouseLeaveTimeoutRef.current = setTimeout(() => {
                props.hideDrawer();
                mouseLeaveTimeoutRef.current = null;
            }, THRESHOLD_MOUSE_LEAVE);
        }
    }, [props.hideDrawer]);
    const {isHidden, menuData, collapsedMenuGroups, toggleMenuGroup, containerRegistry} = props;
    const classNames = mergeClassNames({
        [style.drawer]: true,
        [style['drawer--isHidden']]: isHidden
    });

    const BottomComponents = containerRegistry.getChildren('Drawer/Bottom');

    return (
        <div
            className={classNames}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            aria-hidden={isHidden ? 'true' : 'false'}
            >
            <div className={style.drawer__menuItemGroupsWrapper}>
                {Object.entries(menuData).map(([menuGroup, menuGroupConfiguration]) => (
                    <MenuItemGroup
                        key={menuGroup}
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

export const Drawer = withReduxState(withNeosGlobals(StatelessDrawer as any));
