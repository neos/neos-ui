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

import {Button, Dialog, Icon} from '@neos-project/react-ui-components';
import I18n from '@neos-project/neos-ui-i18n';
import {PublishDiscardMode} from '@neos-project/neos-ui-redux-store/src/CR/Workspaces';

import style from './style.module.css';

const ResultDialogVariants = {
    [PublishDiscardMode.PUBLISHING]: {
        id: 'neos-PublishDialog',
        style: {
            success: 'success',
            error: 'error'
        },
        icon: {
            success: 'check',
            error: 'exclamation-circle'
        },
        label: {
            dialogTitle: {
                id: 'Neos.Neos:Main:publish',
                fallback: 'Publish'
            },
            message: {
                id: 'Neos.Neos:Main:content.components.publishAllDialog.publishXChangesSubheader',
                fallback: (props: { numberOfChanges: number; }) =>
                    `Are you sure that you want to publish ${props.numberOfChanges} change(s) in this workspace?`
            }
        }
    },
    [PublishDiscardMode.DISCARDING]: {
        id: 'neos-DiscardDialog',
        style: {
            success: 'success',
            error: 'error'
        },
        icon: {
            success: 'check',
            error: 'exclamation-circle'
        },
        label: {
            dialogTitle: {
                id: 'Neos.Neos:Main:discard',
                fallback: 'Discard'
            },
            message: {
                id: 'Neos.Neos:Main:content.components.discardAllDialog.discardXChangesSubheader',
                fallback: (props: { numberOfChanges: number; }) => `Are you sure that you want to discard ${props.numberOfChanges} change(s) in this workspace?`
            }
        }
    }
} as const;

export const ResultDialog: React.FC<{
    type: 'success' | 'error';
    mode: PublishDiscardMode;
    message: string;
    onAcknowledge: () => void;
    onRetry: () => void;
}> = (props) => {
    const variant = ResultDialogVariants[props.mode];

    return (
        <Dialog
            actions={[
                props.type === 'error' ? (
                    <Button
                        id={`${variant.id}-Retry`}
                        key="retry"
                        style="warn"
                        hoverStyle="warn"
                        onClick={props.onRetry}
                    >
                        <Icon icon="refresh" className={style.buttonIcon} />
                        <I18n id="Neos.Neos:Main:retry" fallback="Try again" />
                    </Button>
                ) : null,
                <Button
                    id={`${variant.id}-Acknowledge`}
                    key="acknowledge"
                    style={variant.style[props.type]}
                    hoverStyle={variant.style[props.type]}
                    onClick={props.onAcknowledge}
                >
                    <Icon icon="check" className={style.buttonIcon} />
                    <I18n id="Neos.Neos:Main:okay" fallback="OK" />
                </Button>
            ]}
            title={<div>
                <Icon icon={variant.icon[props.type]} />
                <span className={style.modalTitle}>
                    <I18n {...variant.label.dialogTitle} />
                </span>
            </div>}
            onRequestClose={props.onAcknowledge}
            type={variant.style[props.type]}
            isOpen
            autoFocus
            preventClosing={props.type === 'error'}
            theme={undefined as any}
            style={undefined as any}
        >
            <div className={style.modalContents}>
                {props.message}
            </div>
        </Dialog>
    );
};
