import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import mergeClassNames from 'classnames';
import {actions} from 'Host/Redux/';
import {Button, I18n} from 'Host/Components/';
import {immutableOperations} from 'Shared/Utilities/';
import style from './style.css';

const {$get} = immutableOperations;

@connect(state => ({
    isSideBarHidden: $get(state, 'ui.leftSideBar.isHidden')
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
                id="neos__topBar__leftSideBarToggler"
                >
                <I18n id="navigate" fallback="Navigate" />
            </Button>
        );
    }
}
