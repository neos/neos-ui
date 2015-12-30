import React, { Component, PropTypes } from 'react';
import {connect} from 'react-redux';
import actions from '../../../Actions/';
import {Button, I18n} from '../../../Components/';

@connect()
export default class LeftSideBarToggler extends Component {
    static propTypes = {
        className: PropTypes.string,
        dispatch: PropTypes.any.isRequired
    };

    render() {
        const {className} = this.props;

        return (
            <Button className={className} style="clean" hoverStyle="clean" onClick={this.onLeftSidebarToggle.bind(this)}>
                <I18n target="Navigate" />
            </Button>
        );
    }

    onLeftSidebarToggle() {
        this.props.dispatch(actions.UI.LeftSideBar.toggleSideBar());
    }
}
