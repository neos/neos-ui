import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {$transform, $get} from 'plow-js';

import {actions} from '@neos-project/neos-ui-redux-store';
import FlashMessage from './FlashMessage/index';

import style from './style.css';

@connect($transform({
    flashMessages: $get('ui.flashMessages')
}), {
    removeMessage: actions.UI.FlashMessages.remove
})
export default class FlashMessages extends PureComponent {
    static propTypes = {
        flashMessages: PropTypes.object,
        removeMessage: PropTypes.func.isRequired
    };

    static defaultProps = {
        flashMessages: {}
    };

    render() {
        const {flashMessages, removeMessage} = this.props;

        return (
            <div className={style.flashMessageContainer}>
                {Object.keys(flashMessages).map(flashMessageId => {
                    const flashMessage = flashMessages[flashMessageId];
                    const {id, message, severity, timeout} = flashMessage;

                    return (
                        <FlashMessage
                            key={id}
                            id={id}
                            message={message}
                            severity={severity}
                            timeout={timeout}
                            onClose={removeMessage}
                            />
                    );
                })}
            </div>
        );
    }
}
