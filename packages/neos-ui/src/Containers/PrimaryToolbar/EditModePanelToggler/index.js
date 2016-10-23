import React, {Component, PropTypes} from 'react';
import shallowCompare from 'react-addons-shallow-compare';
import Button from '@neos-project/react-ui-components/lib/Button/';
import I18n from '@neos-project/neos-ui-i18n';

export default class EditModePanelToggler extends Component {
    static propTypes = {
        className: PropTypes.string
    };

    constructor(props) {
        super(props);

        this.handleEditModeToggleClick = this.handleEditModeToggleClick.bind(this);
    }

    shouldComponentUpdate(...args) {
        return shallowCompare(this, ...args);
    }

    render() {
        const isActive = false;

        return (
            <Button
                className={this.props.className}
                style="clean"
                hoverStyle="clean"
                isFocused={isActive}
                onClick={this.handleEditModeToggleClick}
                >
                <I18n id="editPreview" fallback="Edit / Preview"/>
            </Button>
        );
    }

    handleEditModeToggleClick() {
        console.log('toggle edit mode container...');
    }
}
