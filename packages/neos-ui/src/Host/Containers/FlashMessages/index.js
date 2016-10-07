import React, {Component, PropTypes} from 'react';
import shallowCompare from 'react-addons-shallow-compare';
import ImmutablePropTypes from 'react-immutable-proptypes';
import {connect} from 'react-redux';
import {$transform, $get} from 'plow-js';

import {actions} from 'Host/Redux/index';
import FlashMessage from './FlashMessage/index';

import style from './style.css';

@connect($transform({
    flashMessages: $get('ui.flashMessages')
}), {
    removeMessage: actions.UI.FlashMessages.remove
})
export default class FlashMessages extends Component {
    static propTypes = {
        flashMessages: ImmutablePropTypes.map,
        removeMessage: PropTypes.func.isRequired
    };

    static defaultProps = {
        flashMessages: {}
    };

    shouldComponentUpdate(newProps, newState) {
        return shallowCompare(this, newProps, newState) && newProps.flashMessages !== this.props.flashMessages;
    }

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
