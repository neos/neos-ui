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
import {TARGET_WINDOW} from '../constants';
import style from '../style.module.css';

export const MenuItemGroup: React.FC<{
    icon?: string;
    label: string;
    uri: string;
    target?: string;
    collapsed: boolean;
    handleMenuGroupToggle: () => void;
    children: {
        icon?: string;
        label: string;
        uri?: string;
        target?: string;
        isActive: boolean;
        skipI18n?: boolean;
    }[];

    onClick: (target?: string, uri?: string) => void;
    onChildClick: () => void;
}> = (props) => {
    const handleClick = React.useCallback(() => {
        const {uri, target, onClick} = props;

        onClick(target, uri);
    }, [props.onClick, props.target, props.uri]);
    const {label, icon, children, onChildClick, target, uri, collapsed, handleMenuGroupToggle} = props;

    const headerButton = (
        <Button
            className={style.drawer__menuItemGroupBtn}
            onClick={handleClick}
            style="transparent"
            hoverStyle="clean"
            >
            {icon && <Icon icon={icon} padded="right"/>}

            <I18n id={label} fallback={label}/>
        </Button>
    );

    const header = (target === TARGET_WINDOW ? <a href={uri}>{headerButton}</a> : headerButton);

    return (
        <ToggablePanel onPanelToggle={handleMenuGroupToggle} isOpen={!collapsed} style="condensed" className={style.drawer__menuItem}>
            <ToggablePanel.Header className={style.drawer__menuItem__header}>
                {header}
            </ToggablePanel.Header>
            <ToggablePanel.Contents>
                {children.map((item, index) => (
                    <MenuItem key={index} onClick={onChildClick} {...item}/>
                ))}
            </ToggablePanel.Contents>
        </ToggablePanel>
    );
}
