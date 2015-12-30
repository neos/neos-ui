import React, { Component, PropTypes } from 'react';
import {connect} from 'react-redux';
import {Button, I18n} from '../../../Components/';

@connect()
export default class EditModePanelToggler extends Component {
    static propTypes = {
        className: PropTypes.string
    };

    render() {
        return (
            <Button className={this.props.className} style="clean" hoverStyle="clean" onClick={this.onEditModeToggle.bind(this)}>
                <I18n target="Edit / Preview" />
            </Button>
        );
    }

    onEditModeToggle() {
        console.log('toggle edit mode container...');
    }
}
