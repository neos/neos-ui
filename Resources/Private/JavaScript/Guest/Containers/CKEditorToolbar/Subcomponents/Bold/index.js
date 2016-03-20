import React, {Component, PropTypes} from 'react';
import {IconButton} from 'Components/index';

export default class Bold extends Component {
    static propTypes = {
        className: PropTypes.string,
        ckApi: PropTypes.object.isRequired,
        editor: PropTypes.object.isRequired
    };

    isActive() {
        const {editor, ckApi} = this.props;

        if (editor) {
            return editor.getCommand('bold').state === ckApi.TRISTATE_ON;
        }

        return false;
    }

    render() {
        const {className} = this.props;
        const isActive = this.isActive();

        return (
            <IconButton
                className={className}
                onClick={() => this.toggleBold()}
                isActive={isActive}
                icon="bold"
                hoverStyle="brand"
                />
        );
    }

    toggleBold() {
        const {editor} = this.props;

        if (editor) {
            editor.execCommand('bold');
            this.setState(this.state);
        }
    }
}
