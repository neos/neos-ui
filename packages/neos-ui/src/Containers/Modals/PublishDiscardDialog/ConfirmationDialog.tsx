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

const ConfirmationDialogVariants = {
    [PublishDiscardMode.PUBLISHING]: {
        id: 'neos-PublishDialog',
        style: 'success',
        icon: {
            dialogTitle: 'share-square-o',
            confirmButton: 'share-square-o'
        },
        label: {
            dialogTitle: {
                id: 'Neos.Neos:Main:publish',
                fallback: 'Publish'
            },
            confirmButton: {
                id: 'Neos.Neos:Main:publish',
                fallback: 'Publish'
            },
            message: {
                id: 'Neos.Neos:Main:content.components.publishAllDialog.publishXChangesSubheader',
                fallback: (props: { numberOfChanges: number; }) => `Are you sure that you want to publish ${props.numberOfChanges} change(s) in this workspace?`
            }
        }
    },
    [PublishDiscardMode.DISCARDING]: {
        id: 'neos-DiscardDialog',
        style: 'error',
        icon: {
            dialogTitle: 'exclamation-triangle',
            confirmButton: 'ban'
        },
        label: {
            dialogTitle: {
                id: 'Neos.Neos:Main:discard',
                fallback: 'Discard'
            },
            confirmButton: {
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

export const ConfirmationDialog: React.FC<{
    mode: PublishDiscardMode;
    numberOfChanges: number;
    onAbort: () => void;
    onConfirm: () => void;
}> = (props) => {
    const variant = ConfirmationDialogVariants[props.mode];

    return (
        <Dialog
            actions={[
                <Button
                    id={`${variant.id}-Cancel`}
                    key="cancel"
                    style="lighter"
                    hoverStyle="brand"
                    onClick={props.onAbort}
                >
                    <I18n id="Neos.Neos:Main:cancel" fallback="Cancel" />
                </Button>,
                <Button
                    id={`${variant.id}-Confirm`}
                    key="confirm"
                    style={variant.style}
                    hoverStyle={variant.style}
                    onClick={props.onConfirm}
                >
                    <Icon icon={variant.icon.confirmButton} className={style.buttonIcon} />
                    <I18n {...variant.label.confirmButton} />
                </Button>
            ]}
            title={<div>
                <Icon icon={variant.icon.dialogTitle} />
                <span className={style.modalTitle}>
                    <I18n {...variant.label.dialogTitle} />
                </span>
            </div>}
            onRequestClose={props.onAbort}
            type={variant.style}
            isOpen
            autoFocus
            theme={undefined as any}
            style={undefined as any}
        >
            <div className={style.modalContents}>
                <I18n
                    id={variant.label.message.id}
                    params={{numberOfChanges: props.numberOfChanges}}
                    fallback={variant.label.message.fallback(props)} />
            </div>
        </Dialog>
    );
};
