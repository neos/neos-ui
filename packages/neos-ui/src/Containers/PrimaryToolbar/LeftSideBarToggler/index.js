import React, {PureComponent, PropTypes} from 'react';
import {connect} from 'react-redux';
import mergeClassNames from 'classnames';
import {$transform, $get} from 'plow-js';
import Button from '@neos-project/react-ui-components/lib/Button/';
import Icon from '@neos-project/react-ui-components/lib/Icon/';

import {actions} from '@neos-project/neos-ui-redux-store';
import I18n from '@neos-project/neos-ui-i18n';

import style from './style.css';

@connect($transform({
    isSideBarHidden: $get('ui.leftSideBar.isHidden')
}), {
    toggleSidebar: actions.UI.LeftSideBar.toggle
})
export default class LeftSideBarToggler extends PureComponent {
    static propTypes = {
        className: PropTypes.string,
        isSideBarHidden: PropTypes.bool.isRequired,
        toggleSidebar: PropTypes.func.isRequired
    };

    render() {
        const {className, isSideBarHidden, toggleSidebar} = this.props;
        const isActive = !isSideBarHidden;
        const classNames = mergeClassNames({
            [className]: true,
            [style['btn--isActive']]: isActive
        });

        return (
            <Button
                className={classNames}
                style="clean"
                hoverStyle="clean"
                isFocused={isActive}
                onClick={toggleSidebar}
                >
                <Icon className={style.icon} icon="location-arrow"/> <I18n id="navigate" fallback="Navigate"/>
            </Button>
        );
    }
}
