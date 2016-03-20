import React, {Component, PropTypes} from 'react';
import {IconButton} from 'Components/index';

export default class AlignRight extends Component {
    static propTypes = {
        className: PropTypes.string,
        ckApi: PropTypes.object.isRequired,
        editor: PropTypes.object.isRequired
    };

    isActive() {
        const {editor, ckApi} = this.props;

        if (editor) {
            return editor.getCommand('justifyright').state === ckApi.TRISTATE_ON;
        }

        return false;
    }

    render() {
        const {className} = this.props;
        const isActive = this.isActive();

        return (
            <IconButton
                className={className}
                onClick={() => this.toggleAlignRight()}
                isActive={isActive}
                icon="align-right"
                hoverStyle="brand"
                />
        );
    }

    toggleAlignRight() {
        const {editor} = this.props;

        if (editor) {
            editor.execCommand('justifyright');
            this.setState(this.state);
        }
    }
}
