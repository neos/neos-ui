import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import mergeClassNames from 'classnames';
import {$transform, $get} from 'plow-js';

import {actions} from 'Host/Redux/index';
import {Button} from 'Components/index';

import style from './style.css';

@connect($transform({
    isMenuHidden: $get('ui.drawer.isHidden')
}), {
    toggleDrawer: actions.UI.Drawer.toggle
})
export default class MenuToggler extends Component {
    static propTypes = {
        className: PropTypes.string,
        isMenuHidden: PropTypes.bool.isRequired,
        toggleDrawer: PropTypes.func.isRequired
    };

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
                onClick={() => this.props.toggleDrawer()}
                id="neos__primaryToolbar__menuToggler"
                aria-label="Menu"
                aria-controls="navigation"
                aria-expanded={isMenuHidden ? 'false' : 'true'}
                >
                <div className={style.menuToggler__icon}></div>
            </Button>
        );
    }
}
