/*
 * This file is part of the Neos.Neos.Ui package.
 *
 * (c) Contributors of the Neos Project - www.neos.io
 *
 * This package is Open Source Software. For the full copyright and license
 * information, please view the LICENSE file which was distributed with this
 * source code.
 */
import React from 'react';
// @ts-ignore
import {connect} from 'react-redux';

import {actions} from '@neos-project/neos-ui-redux-store';
import {GlobalState} from '@neos-project/neos-ui-redux-store/src/System';

import {FlashMessage} from './FlashMessage';

import style from './style.module.css';

const withReduxState = connect((state: GlobalState) => ({
    flashMessages: state?.ui?.flashMessages
}), {
    removeMessage: actions.UI.FlashMessages.remove
});

const StatelessFlashMessages: React.FC<{
    flashMessages: Record<string, {
        id: string;
        message: string;
        severity: 'success' | 'error' | 'info';
        timeout?: number;
    }>;
    removeMessage: (id: string) => void;
}> = (props) => {
    const {flashMessages, removeMessage} = props;

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

export const FlashMessages = withReduxState(StatelessFlashMessages);
