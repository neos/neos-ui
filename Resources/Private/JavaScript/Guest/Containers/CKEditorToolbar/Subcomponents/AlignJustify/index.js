import React, {Component, PropTypes} from 'react';
import {IconButton} from 'Components/index';

export default class AlignJustify extends Component {
    static propTypes = {
        className: PropTypes.string,
        ckApi: PropTypes.object.isRequired,
        editor: PropTypes.object.isRequired
    };

    isActive() {
        const {editor, ckApi} = this.props;

        if (editor) {
            return editor.getCommand('justifyblock').state === ckApi.TRISTATE_ON;
        }

        return false;
    }

    render() {
        const {className} = this.props;
        const isActive = this.isActive();

        return (
            <IconButton
                className={className}
                onClick={() => this.toggleAlignJustify()}
                isActive={isActive}
                icon="align-justify"
                hoverStyle="brand"
                />
        );
    }

    toggleAlignJustify() {
        const {editor} = this.props;

        if (editor) {
            editor.execCommand('justifyblock');
            this.setState(this.state);
        }
    }
}
