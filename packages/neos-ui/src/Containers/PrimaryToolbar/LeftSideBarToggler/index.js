import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import mergeClassNames from 'classnames';
import {$transform, $get} from 'plow-js';
import Button from '@neos-project/react-ui-components/src/Button/';
import Icon from '@neos-project/react-ui-components/src/Icon/';

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

    handleToggle = () => {
        const {toggleSidebar} = this.props;

        toggleSidebar();
    }

    render() {
        const {className, isSideBarHidden} = this.props;
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
                onClick={this.handleToggle}
                >
                <Icon className={style.icon} icon="location-arrow"/> <I18n id="navigate" fallback="Navigate"/>
            </Button>
        );
    }
}
