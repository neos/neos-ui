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

import {Dialog, Icon} from '@neos-project/react-ui-components';
import I18n from '@neos-project/neos-ui-i18n';
import {PublishDiscardMode} from '@neos-project/neos-ui-redux-store/src/CR/Workspaces';

import style from './style.module.css';

const ProcessIndicatorVariants = {
    [PublishDiscardMode.PUBLISHING]: {
        id: 'neos-PublishDialog',
        label: {
            dialogTitle: {
                id: 'Neos.Neos:Main:publishing',
                fallback: 'Publishing...'
            },
            message: {
                id: 'Neos.Neos:Main:content.components.publishAllDialog.publishIsOngoing',
                fallback: (props: { numberOfChanges: number; }) =>
                    `Please wait while ${props.numberOfChanges} change(s) are being published. This may take a while.`
            }
        }
    },
    [PublishDiscardMode.DISCARDING]: {
        id: 'neos-DiscardDialog',
        label: {
            dialogTitle: {
                id: 'Neos.Neos:Main:discarding',
                fallback: 'Discarding...'
            },
            message: {
                id: 'Neos.Neos:Main:content.components.discardAllDialog.discardIsOngoing',
                fallback: (props: { numberOfChanges: number; }) =>
                    `Please wait while ${props.numberOfChanges} change(s) are being discarded. This may take a while.`
            }
        }
    }
} as const;

export const ProcessIndicator: React.FC<{
    mode: PublishDiscardMode;
    numberOfChanges: number;
}> = (props) => {
    const variant = ProcessIndicatorVariants[props.mode];

    return (
        <Dialog
            actions={[]}
            title={<div>
                <Icon icon="refresh" spin />
                <span className={style.modalTitle}>
                    <I18n {...variant.label.dialogTitle} />
                </span>
            </div>}
            type={undefined as any}
            isOpen
            autoFocus
            preventClosing
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
