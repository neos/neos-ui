import React, { Component, PropTypes } from 'react';
import {connect} from 'react-redux';
import {Button, I18n} from '../../../Components/';

@connect()
export default class LeftSideBarToggler extends Component {
    static propTypes = {
        className: PropTypes.string
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
        console.log('toggle left sidebar...');
    }
}
