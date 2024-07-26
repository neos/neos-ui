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

import Button from '@neos-project/react-ui-components/src/Button/';
import {neos} from '@neos-project/neos-ui-decorators';
import {I18nRegistry} from '@neos-project/neos-ts-interfaces';
import {useLatestState} from '@neos-project/framework-observable-react';

import {drawer$, toggleDrawer} from '../../Drawer';

import style from './style.module.css';

const withNeosGlobals = neos(globalRegistry => ({
    i18nRegistry: globalRegistry.get('i18n')
}));

const StatelessMenuToggler: React.FC<{
    i18nRegistry: I18nRegistry;

    className?: string;
}> = (props) => {
    const handleToggle = React.useCallback(() => {
        toggleDrawer();
    }, []);

    const {className, i18nRegistry} = props;
    const {isHidden: isMenuHidden} = useLatestState(drawer$);
    const isMenuVisible = !isMenuHidden;
    const classNames = mergeClassNames({
        [style.menuToggler]: true,
        [style['menuToggler--isActive']]: isMenuVisible,
        [className ?? '']: className && className.length
    });

    //
    // ToDo: Replace the static 'Menu' aria-label with a label from the i18n service.
    //
    return (
        <Button
            id="neos-MenuToggler"
            className={classNames}
            style="clean"
            hoverStyle="clean"
            isFocused={isMenuVisible}
            onClick={handleToggle}
            title={i18nRegistry.translate('Neos.Neos:Main:toggleMenu', 'Toggle menu')}
            aria-label="Menu"
            aria-controls="navigation"
            aria-expanded={isMenuHidden ? 'false' : 'true'}
            >
            <div className={style.menuToggler__icon}/>
        </Button>
    );
}

export const MenuToggler = withNeosGlobals(StatelessMenuToggler as any);
