import React, {Component, PropTypes} from 'react';
import {IconButton} from 'Components/index';

export default class Underline extends Component {
    static propTypes = {
        className: PropTypes.string,
        ckApi: PropTypes.object.isRequired,
        editor: PropTypes.object.isRequired
    };

    isActive() {
        const {editor, ckApi} = this.props;

        if (editor) {
            return editor.getCommand('underline').state === ckApi.TRISTATE_ON;
        }

        return false;
    }

    render() {
        const {className} = this.props;
        const isActive = this.isActive();

        return (
            <IconButton
                className={className}
                onClick={() => this.toggleUnderline()}
                isActive={isActive}
                icon="underline"
                hoverStyle="brand"
                />
        );
    }

    toggleUnderline() {
        const {editor} = this.props;

        if (editor) {
            editor.execCommand('underline');
            this.setState(this.state);
        }
    }
}
