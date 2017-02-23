import React, {PureComponent, PropTypes} from 'react';
import {connect} from 'react-redux';
import mergeClassNames from 'classnames';
import {$transform, $get} from 'plow-js';
import Button from '@neos-project/react-ui-components/lib/Button/';

import {actions} from '@neos-project/neos-ui-redux-store';

import style from './style.css';

@connect($transform({
    isMenuHidden: $get('ui.drawer.isHidden')
}), {
    toggleDrawer: actions.UI.Drawer.toggle
})
export default class MenuToggler extends PureComponent {
    static propTypes = {
        className: PropTypes.string,
        isMenuHidden: PropTypes.bool.isRequired,
        toggleDrawer: PropTypes.func.isRequired
    };

    handleToggle = () => {
        const {toggleDrawer} = this.props;

        toggleDrawer();
    }

    render() {
        const {className, isMenuHidden} = this.props;
        const isMenuVisible = !isMenuHidden;
        const classNames = mergeClassNames({
            [style['menuToggler--isActive']]: isMenuVisible,
            [className]: className && className.length
        });

        //
        // ToDo: Replace the static 'Menu' aria-label with a label from the i18n service.
        //
        return (
            <Button
                className={classNames}
                style="clean"
                hoverStyle="clean"
                isFocused={isMenuVisible}
                onClick={this.handleToggle}
                aria-label="Menu"
                aria-controls="navigation"
                aria-expanded={isMenuHidden ? 'false' : 'true'}
                >
                <div className={style.menuToggler__icon}/>
            </Button>
        );
    }
}
