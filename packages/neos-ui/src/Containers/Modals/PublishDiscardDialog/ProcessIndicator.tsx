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
import {PublishDiscardMode, PublishDiscardScope} from '@neos-project/neos-ui-redux-store/src/CR/Publishing';

import style from './style.module.css';

const ProcessIndicatorVariants = {
    [PublishDiscardMode.PUBLISHING]: {
        id: 'neos-PublishDialog',
        [PublishDiscardScope.SITE]: {
            label: {
                title: {
                    id: 'Neos.Neos.Ui:PublishDiscardDialog:publish.site.process.title',
                    fallback: (props: { scopeTitle: string; }) =>
                        `Publishing all changes in site "${props.scopeTitle}"...`
                },
                message: {
                    id: 'Neos.Neos.Ui:PublishDiscardDialog:publish.site.process.message',
                    fallback: (props: { numberOfChanges: number; }) =>
                        `Please wait while ${props.numberOfChanges} change(s) are being published. This may take a while.`
                }
            }
        },
        [PublishDiscardScope.DOCUMENT]: {
            label: {
                title: {
                    id: 'Neos.Neos.Ui:PublishDiscardDialog:publish.document.process.title',
                    fallback: (props: { scopeTitle: string; }) =>
                        `Publishing all changes in document "${props.scopeTitle}"...`
                },
                message: {
                    id: 'Neos.Neos.Ui:PublishDiscardDialog:publish.document.process.message',
                    fallback: (props: { numberOfChanges: number; }) =>
                        `Please wait while ${props.numberOfChanges} change(s) are being published. This may take a while.`
                }
            }
        }
    },
    [PublishDiscardMode.DISCARDING]: {
        id: 'neos-DiscardDialog',
        [PublishDiscardScope.SITE]: {
            label: {
                title: {
                    id: 'Neos.Neos.Ui:PublishDiscardDialog:discard.site.process.title',
                    fallback: (props: { scopeTitle: string; }) =>
                        `Discarding all changes in site "${props.scopeTitle}"...`
                },
                message: {
                    id: 'Neos.Neos.Ui:PublishDiscardDialog:discard.site.process.message',
                    fallback: (props: { numberOfChanges: number; }) =>
                        `Please wait while ${props.numberOfChanges} change(s) are being discarded. This may take a while.`
                }
            }
        },
        [PublishDiscardScope.DOCUMENT]: {
            label: {
                title: {
                    id: 'Neos.Neos.Ui:PublishDiscardDialog:discard.document.process.title',
                    fallback: (props: { scopeTitle: string; }) =>
                        `Discarding all changes in document "${props.scopeTitle}"...`
                },
                message: {
                    id: 'Neos.Neos.Ui:PublishDiscardDialog:discard.document.process.message',
                    fallback: (props: { numberOfChanges: number; }) =>
                        `Please wait while ${props.numberOfChanges} change(s) are being discarded. This may take a while.`
                }
            }
        }
    }
} as const;

export const ProcessIndicator: React.FC<{
    mode: PublishDiscardMode;
    scope: PublishDiscardScope;
    scopeTitle: string;
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
                <I18n
                    id={variant[props.scope].label.message.id}
                    params={props}
                    fallback={variant[props.scope].label.message.fallback(props)}
                    />
            </div>
        </Dialog>
    );
};
