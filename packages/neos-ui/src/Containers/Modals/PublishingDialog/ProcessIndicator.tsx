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
import {PublishingMode, PublishingPhase, PublishingScope} from '@neos-project/neos-ui-redux-store/src/CR/Publishing';

import {Diagram} from './Diagram';
import style from './style.module.css';

const ProcessIndicatorVariants = {
    [PublishingMode.PUBLISH]: {
        id: 'neos-PublishDialog',
        [PublishingScope.SITE]: {
            label: {
                title: {
                    id: 'Neos.Neos.Ui:PublishingDialog:publish.site.process.title',
                    fallback: (props: { scopeTitle: string; }) =>
                        `Publishing all changes in site "${props.scopeTitle}"...`
                },
                message: {
                    id: 'Neos.Neos.Ui:PublishingDialog:publish.site.process.message',
                    fallback: (props: { numberOfChanges: number; }) =>
                        `Please wait while ${props.numberOfChanges} change(s) are being published. This may take a while.`
                }
            }
        },
        [PublishingScope.DOCUMENT]: {
            label: {
                title: {
                    id: 'Neos.Neos.Ui:PublishingDialog:publish.document.process.title',
                    fallback: (props: { scopeTitle: string; }) =>
                        `Publishing all changes in document "${props.scopeTitle}"...`
                },
                message: {
                    id: 'Neos.Neos.Ui:PublishingDialog:publish.document.process.message',
                    fallback: (props: { numberOfChanges: number; }) =>
                        `Please wait while ${props.numberOfChanges} change(s) are being published. This may take a while.`
                }
            }
        }
    },
    [PublishingMode.DISCARD]: {
        id: 'neos-DiscardDialog',
        [PublishingScope.SITE]: {
            label: {
                title: {
                    id: 'Neos.Neos.Ui:PublishingDialog:discard.site.process.title',
                    fallback: (props: { scopeTitle: string; }) =>
                        `Discarding all changes in site "${props.scopeTitle}"...`
                },
                message: {
                    id: 'Neos.Neos.Ui:PublishingDialog:discard.site.process.message',
                    fallback: (props: { numberOfChanges: number; }) =>
                        `Please wait while ${props.numberOfChanges} change(s) are being discarded. This may take a while.`
                }
            }
        },
        [PublishingScope.DOCUMENT]: {
            label: {
                title: {
                    id: 'Neos.Neos.Ui:PublishingDialog:discard.document.process.title',
                    fallback: (props: { scopeTitle: string; }) =>
                        `Discarding all changes in document "${props.scopeTitle}"...`
                },
                message: {
                    id: 'Neos.Neos.Ui:PublishingDialog:discard.document.process.message',
                    fallback: (props: { numberOfChanges: number; }) =>
                        `Please wait while ${props.numberOfChanges} change(s) are being discarded. This may take a while.`
                }
            }
        }
    }
} as const;

export const ProcessIndicator: React.FC<{
    mode: PublishingMode;
    scope: PublishingScope;
    scopeTitle: string;
    sourceWorkspaceName: string;
    targetWorkspaceName: null | string;
    numberOfChanges: number;
}> = (props) => {
    const variant = ProcessIndicatorVariants[props.mode];

    return (
        <Dialog
            actions={[]}
            title={
                <div>
                    <Icon icon="refresh" spin />
                    <span className={style.modalTitle}>
                        <I18n
                            id={variant[props.scope].label.title.id}
                            params={props}
                            fallback={variant[props.scope].label.title.fallback(props)}
                            />
                    </span>
                </div>
            }
            type={undefined as any}
            isOpen
            autoFocus
            preventClosing
            theme={undefined as any}
            style={undefined as any}
        >
            <div className={style.modalContents}>
                <Diagram
                    phase={PublishingPhase.ONGOING}
                    sourceWorkspaceName={props.sourceWorkspaceName}
                    targetWorkspaceName={props.targetWorkspaceName}
                    numberOfChanges={props.numberOfChanges}
                />
                <I18n
                    id={variant[props.scope].label.message.id}
                    params={props}
                    fallback={variant[props.scope].label.message.fallback(props)}
                    />
            </div>
        </Dialog>
    );
};
