import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {Button, I18n} from 'Host/Components/';

@connect()
export default class EditModePanelToggler extends Component {
    static propTypes = {
        className: PropTypes.string
    };

    render() {
        const isActive = false;

        return (
            <Button
                className={this.props.className}
                style="clean"
                hoverStyle="clean"
                isFocused={isActive}
                onClick={this.onEditModeToggle.bind(this)}
                >
                <I18n id="editPreview" fallback="Edit / Preview" />
            </Button>
        );
    }

    onEditModeToggle() {
        console.log('toggle edit mode container...');
    }
}
