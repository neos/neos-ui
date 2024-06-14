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

import {neos} from '@neos-project/neos-ui-decorators';
import {SynchronousRegistry} from '@neos-project/neos-ui-extensibility';
import {createState} from '@neos-project/framework-observable';
import {useLatestState} from '@neos-project/framework-observable-react';

import MenuItemGroup from './MenuItemGroup/index';
import style from './style.module.css';
import {THRESHOLD_MOUSE_LEAVE} from './constants';

const withNeosGlobals = neos(globalRegistry => ({
    containerRegistry: globalRegistry.get('containers')
}));

export const drawer$ = createState({
    isHidden: true,
    collapsedMenuGroups: [] as string[]
});

export function toggleDrawer() {
    drawer$.update((state) => ({
        ...state,
        isHidden: !state.isHidden
    }));
}

function hideDrawer() {
    drawer$.update((state) => ({
        ...state,
        isHidden: true
    }));
}

function toggleMenuGroup(menuGroupId: string) {
    drawer$.update((state) => ({
        ...state,
        collapsedMenuGroups: state.collapsedMenuGroups.includes(menuGroupId)
            ? state.collapsedMenuGroups.filter((m) => m !== menuGroupId)
            : [...state.collapsedMenuGroups, menuGroupId]
    }));
}

const StatelessDrawer: React.FC<{
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
    const {isHidden, collapsedMenuGroups} = useLatestState(drawer$);
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
                hideDrawer();
                mouseLeaveTimeoutRef.current = null;
            }, THRESHOLD_MOUSE_LEAVE);
        }
    }, []);
    const {menuData, containerRegistry} = props;
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
                        id={menuGroup}
                        collapsed={collapsedMenuGroups.includes(menuGroup)}
                        onMenuGroupToggle={toggleMenuGroup}
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

export const Drawer = withNeosGlobals(StatelessDrawer as any);
