import React, { Component, PropTypes } from 'react';
import {connect} from 'react-redux';
import mergeClassNames from 'classnames';
import actions from '../../../Actions/';
import {Button, I18n} from '../../../Components/';
import {immutableOperations} from '../../../../Shared/Util';
import style from './style.css';

const {$get} = immutableOperations;

@connect(state => ({
    isSideBarHidden: $get(state, 'ui.leftSidebar.isHidden')
}))
export default class LeftSideBarToggler extends Component {
    static propTypes = {
        className: PropTypes.string,
        isSideBarHidden: PropTypes.bool.isRequired,
        dispatch: PropTypes.any.isRequired
    };

    render() {
        const {className, isSideBarHidden} = this.props;
        const classNames = mergeClassNames({
            [className]: true,
            [style['btn--isActive']]: !isSideBarHidden
        });

        return (
            <Button className={classNames} style="clean" hoverStyle="clean" onClick={this.onLeftSidebarToggle.bind(this)}>
                <I18n target="Navigate" />
            </Button>
        );
    }

    onLeftSidebarToggle() {
        this.props.dispatch(actions.UI.LeftSideBar.toggleSideBar());
    }
}
