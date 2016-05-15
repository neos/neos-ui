import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import mergeClassNames from 'classnames';
import {$transform, $get} from 'plow-js';

import {actions} from 'Host/Redux/index';
import {Button, I18n} from 'Components/index';

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
                onClick={() => this.props.toggleSidebar()}
                id="neos__primaryToolbar__leftSideBarToggler"
                >
                <I18n id="navigate" fallback="Navigate" />
            </Button>
        );
    }
}
