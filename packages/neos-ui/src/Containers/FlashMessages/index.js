import React, {PureComponent, PropTypes} from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
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
        flashMessages: ImmutablePropTypes.map,
        removeMessage: PropTypes.func.isRequired
    };

    static defaultProps = {
        flashMessages: {}
    };

    render() {
        const {flashMessages, removeMessage} = this.props;

        return (
            <div className={style.flashMessageContainer}>
                {flashMessages.map(flashMessage => {
                    const {id, message, severity, timeout} = flashMessage.toJS();

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
                }).toArray()}
            </div>
        );
    }
}
