import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import mergeClassNames from 'classnames';
import {$transform, $get} from 'plow-js';

import Button from '@neos-project/react-ui-components/src/Button/';
import {actions} from '@neos-project/neos-ui-redux-store';
import {neos} from '@neos-project/neos-ui-decorators';

import style from './style.css';

@neos(globalRegistry => ({
    i18nRegistry: globalRegistry.get('i18n')
}))

@connect($transform({
    isMenuHidden: $get('ui.drawer.isHidden')
}), {
    toggleDrawer: actions.UI.Drawer.toggle
})
export default class MenuToggler extends PureComponent {
    static propTypes = {
        i18nRegistry: PropTypes.object.isRequired,

        className: PropTypes.string,
        isMenuHidden: PropTypes.bool.isRequired,
        toggleDrawer: PropTypes.func.isRequired
    };

    handleToggle = () => {
        const {toggleDrawer} = this.props;

        toggleDrawer();
    }

    render() {
        const {className, isMenuHidden, i18nRegistry} = this.props;
        const isMenuVisible = !isMenuHidden;
        const classNames = mergeClassNames({
            [style.menuToggler]: true,
            [style['menuToggler--isActive']]: isMenuVisible,
            [className]: className && className.length
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
                onClick={this.handleToggle}
                title={i18nRegistry.translate('Neos.Neos:Main:toggleMenu', 'Toggle menu')}
                aria-label="Menu"
                aria-controls="navigation"
                aria-expanded={isMenuHidden ? 'false' : 'true'}
                >
                <div className={style.menuToggler__icon}/>
            </Button>
        );
    }
}
