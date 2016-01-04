import React, { Component, PropTypes } from 'react';
import {connect} from 'react-redux';
import Immutable from 'immutable';
import mergeClassNames from 'classnames';
import style from './style.css';
import actions from '../../Ducks/';

import FlashMessage from './FlashMessage/';

import {immutableOperations} from '../../../Shared/Util';

const {$get} = immutableOperations;

@connect(state => ({
    flashMessages: $get(state, 'ui.flashMessages')
}))
export default class FlashMessageContainer extends Component {
    static propTypes = {
        flashMessages: PropTypes.instanceOf(Immutable.Map),
        dispatch: PropTypes.any.isRequired
    };

    render() {
        const {flashMessages} = this.props;

        const flashMessageContainerClasses = mergeClassNames({
            [style.flashMessageContainer]: true
        });

        return (
            <div className={flashMessageContainerClasses}>
                {flashMessages.map(flashMessage => {
                    const {id, message, severity, timeout} = flashMessage.toJS();
                    return (
                        <FlashMessage
                            key={id}
                            message={message}
                            severity={severity}
                            timeout={timeout}
                            onClose={() => this.onClose(id)}
                            />
                    );
                }).toArray()}
            </div>
        );
    }

    onClose(flashMessageId) {
        this.props.dispatch(actions.UI.FlashMessages.remove(flashMessageId));
    }
}
