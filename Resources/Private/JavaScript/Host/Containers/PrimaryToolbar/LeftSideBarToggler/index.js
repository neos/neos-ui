import React, {Component, PropTypes} from 'react';
import shallowCompare from 'react-addons-shallow-compare';
import {connect} from 'react-redux';
import mergeClassNames from 'classnames';
import {$transform, $get} from 'plow-js';
import Button from '@neos-project/react-ui-components/lib/Button/';

import {actions} from 'Host/Redux/index';
import {I18n} from 'Host/Containers/index';

import style from './style.css';

@connect($transform({
    isSideBarHidden: $get('ui.leftSideBar.isHidden')
}), {
    toggleSidebar: actions.UI.LeftSideBar.toggle
})
export default class LeftSideBarToggler extends Component {
    static propTypes = {
        className: PropTypes.string,
        isSideBarHidden: PropTypes.bool.isRequired,
        toggleSidebar: PropTypes.func.isRequired
    };

    shouldComponentUpdate(...args) {
        return shallowCompare(this, ...args);
    }

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
                <I18n id="navigate" fallback="Navigate"/>
            </Button>
        );
    }
}
