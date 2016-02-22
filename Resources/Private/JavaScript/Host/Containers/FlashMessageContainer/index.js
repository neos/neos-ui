import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {$transform, $get} from 'plow-js';

import {actions} from 'Host/Redux/';
import FlashMessage from './FlashMessage/';

import style from './style.css';

@connect($transform({
    flashMessages: $get('ui.flashMessages')
}), {
    removeMessage: actions.UI.FlashMessages.remove
})
export default class FlashMessageContainer extends Component {
    static propTypes = {
        flashMessages: PropTypes.object,
        removeMessage: PropTypes.func.isRequired
    };

    render() {
        const {flashMessages, removeMessage} = this.props;

        return (
            <div className={style.flashMessageContainer}>
                {Object.keys(flashMessages || {}).map(k => flashMessages[k]).map(flashMessage => {
                    const {id, message, severity, timeout} = flashMessage;

                    return (
                        <FlashMessage
                            key={id}
                            message={message}
                            severity={severity}
                            timeout={timeout}
                            onClose={() => removeMessage(id)}
                            />
                    );
                })}
            </div>
        );
    }
}
