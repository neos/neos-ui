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
// @ts-ignore
import {connect} from 'react-redux';
import mergeClassNames from 'classnames';

import Button from '@neos-project/react-ui-components/src/Button/';
import {actions} from '@neos-project/neos-ui-redux-store';
import {GlobalState} from '@neos-project/neos-ui-redux-store/src/System';
import {neos} from '@neos-project/neos-ui-decorators';
import {I18nRegistry} from '@neos-project/neos-ts-interfaces';

import style from './style.module.css';

const withNeosGlobals = neos(globalRegistry => ({
    i18nRegistry: globalRegistry.get('i18n')
}));

const withReduxState = connect((state: GlobalState) => ({
    isMenuHidden: state?.ui?.drawer?.isHidden
}), {
    toggleDrawer: actions.UI.Drawer.toggle
});

const StatelessMenuToggler: React.FC<{
    i18nRegistry: I18nRegistry;

    className?: string;
    isMenuHidden: boolean;
    toggleDrawer: () => void;
}> = (props) => {
    const handleToggle = React.useCallback(() => {
        props.toggleDrawer();
    }, []);

    const {className, isMenuHidden, i18nRegistry} = props;
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

export const MenuToggler = withNeosGlobals(withReduxState(StatelessMenuToggler));
