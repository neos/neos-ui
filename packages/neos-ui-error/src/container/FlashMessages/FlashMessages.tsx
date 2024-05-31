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

import {createState} from '@neos-project/framework-observable';
import {useLatestState} from '@neos-project/framework-observable-react';

import {FlashMessage} from './FlashMessage';

import {Severity} from '../../types';

import style from './style.module.css';

const flashMessages$ = createState<Record<string, {
    id: string;
    message: string;
    severity: Severity;
    timeout?: number;
}>>({});

export function showFlashMessage(flashMessage: {
    id: string;
    message: string;
    severity?: Severity;
    timeout?: number;
}) {
    const flashMessageWithDefaults = {
        id: flashMessage.id,
        message: flashMessage.message,
        severity: flashMessage.severity ?? 'info',
        timeout: flashMessage.timeout
    };

    flashMessages$.update((flashMessages) => ({
        ...flashMessages,
        [flashMessageWithDefaults.id]: flashMessageWithDefaults
    }));
}

function removeFlashMessage(id: string) {
    flashMessages$.update((flashMessages) => {
        const {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            [id]: _,
            ...remainingFlashMessages
        } = flashMessages;
        return remainingFlashMessages;
    });
}

export const FlashMessages: React.FC = () => {
    const flashMessages = useLatestState(flashMessages$);

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
                        onClose={removeFlashMessage}
                        />
                );
            })}
        </div>
    );
}
