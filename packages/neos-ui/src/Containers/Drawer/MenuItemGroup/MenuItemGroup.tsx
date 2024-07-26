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

import {Icon, ToggablePanel, Button} from '@neos-project/react-ui-components';

import I18n from '@neos-project/neos-ui-i18n';

import MenuItem from '../MenuItem/index';
import style from '../style.module.css';

export const MenuItemGroup: React.FC<{
    id: string;
    icon?: string;
    label: string;
    uri: string;
    target?: string;
    collapsed: boolean;
    onMenuGroupToggle: (menuGroupId: string) => void;
    children: {
        icon?: string;
        label: string;
        uri?: string;
        isActive: boolean;
        skipI18n?: boolean;
    }[];
}> = (props) => {
    const {label, icon, children, uri, collapsed} = props;
    const handleMenuGroupToggle = React.useCallback(() => {
        props.onMenuGroupToggle(props.id);
    }, [props.id])

    return (
        <ToggablePanel onPanelToggle={handleMenuGroupToggle} isOpen={!collapsed} style="condensed" className={style.drawer__menuItem}>
            <ToggablePanel.Header className={style.drawer__menuItem__header}>
                <a href={uri}>
                    <Button
                        className={style.drawer__menuItemGroupBtn}
                        style="transparent"
                        hoverStyle="clean"
                        >
                        {icon && <Icon icon={icon} padded="right"/>}

                        <I18n id={label} fallback={label}/>
                    </Button>
                </a>
            </ToggablePanel.Header>
            <ToggablePanel.Contents>
                {children.map((item, index) => (
                    <MenuItem key={index} {...item}/>
                ))}
            </ToggablePanel.Contents>
        </ToggablePanel>
    );
}
