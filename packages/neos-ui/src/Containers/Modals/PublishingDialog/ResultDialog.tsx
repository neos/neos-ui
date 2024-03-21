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
import {PublishDiscardMode, PublishDiscardPhase, PublishDiscardScope} from '@neos-project/neos-ui-redux-store/src/CR/Publishing';

import style from './style.module.css';

const ResultDialogVariants = {
    [PublishDiscardMode.PUBLISHING]: {
        id: 'neos-PublishDialog',
        [PublishDiscardPhase.SUCCESS]: {
            style: 'success',
            icon: 'check',
            [PublishDiscardScope.SITE]: {
                label: {
                    title: {
                        id: 'Neos.Neos.Ui:PublishingDialog:publish.site.success.title',
                        fallback: (props: { scopeTitle: string; }) =>
                            `Changes in site "${props.scopeTitle}" were published`
                    },
                    message: {
                        id: 'Neos.Neos.Ui:PublishingDialog:publish.site.success.message',
                        fallback: (props: { numberOfChanges: number; scopeTitle: string; }) =>
                            `${props.numberOfChanges} change(s) in site "${props.scopeTitle}" were sucessfully published.`
                    },
                    acknowledge: {
                        id: 'Neos.Neos.Ui:PublishingDialog:publish.site.success.acknowledge',
                        fallback: 'Okay, take me back'
                    }
                }
            },
            [PublishDiscardScope.DOCUMENT]: {
                label: {
                    title: {
                        id: 'Neos.Neos.Ui:PublishingDialog:publish.document.success.title',
                        fallback: (props: { scopeTitle: string; }) =>
                            `Changes in document "${props.scopeTitle}" were published`
                    },
                    message: {
                        id: 'Neos.Neos.Ui:PublishingDialog:publish.document.success.message',
                        fallback: (props: { numberOfChanges: number; scopeTitle: string; }) =>
                            `${props.numberOfChanges} change(s) in document "${props.scopeTitle}" were sucessfully published.`
                    },
                    acknowledge: {
                        id: 'Neos.Neos.Ui:PublishingDialog:publish.document.success.acknowledge',
                        fallback: 'Okay, take me back'
                    }
                }
            }
        },
        [PublishDiscardPhase.ERROR]: {
            style: 'error',
            icon: 'exclamation-circle',
            [PublishDiscardScope.SITE]: {
                label: {
                    title: {
                        id: 'Neos.Neos.Ui:PublishingDialog:publish.site.error.title',
                        fallback: (props: { scopeTitle: string; }) =>
                            `Changes in site "${props.scopeTitle}" could not be published`
                    },
                    retry: {
                        id: 'Neos.Neos.Ui:PublishingDialog:publish.site.error.retry',
                        fallback: 'Try again'
                    },
                    acknowledge: {
                        id: 'Neos.Neos.Ui:PublishingDialog:publish.site.error.acknowledge',
                        fallback: 'Okay, take me back'
                    }
                }
            },
            [PublishDiscardScope.DOCUMENT]: {
                label: {
                    title: {
                        id: 'Neos.Neos.Ui:PublishingDialog:publish.document.error.title',
                        fallback: (props: { scopeTitle: string; }) =>
                            `Changes in document "${props.scopeTitle}" could not be published`
                    },
                    retry: {
                        id: 'Neos.Neos.Ui:PublishingDialog:publish.document.error.retry',
                        fallback: 'Try again'
                    },
                    acknowledge: {
                        id: 'Neos.Neos.Ui:PublishingDialog:publish.document.error.acknowledge',
                        fallback: 'Okay, take me back'
                    }
                }
            }
        }
    },
    [PublishDiscardMode.DISCARDING]: {
        id: 'neos-DiscardDialog',
        [PublishDiscardPhase.SUCCESS]: {
            style: 'success',
            icon: 'check',
            [PublishDiscardScope.SITE]: {
                label: {
                    title: {
                        id: 'Neos.Neos.Ui:PublishingDialog:discard.site.success.title',
                        fallback: (props: { scopeTitle: string; }) =>
                            `Changes in site "${props.scopeTitle}" were discarded`
                    },
                    message: {
                        id: 'Neos.Neos.Ui:PublishingDialog:discard.site.success.message',
                        fallback: (props: { numberOfChanges: number; scopeTitle: string; }) =>
                            `${props.numberOfChanges} change(s) in site "${props.scopeTitle}" were sucessfully discarded.`
                    },
                    acknowledge: {
                        id: 'Neos.Neos.Ui:PublishingDialog:discard.site.success.acknowledge',
                        fallback: 'Okay, take me back'
                    }
                }
            },
            [PublishDiscardScope.DOCUMENT]: {
                label: {
                    title: {
                        id: 'Neos.Neos.Ui:PublishingDialog:discard.document.success.title',
                        fallback: (props: { scopeTitle: string; }) =>
                            `Changes in document "${props.scopeTitle}" were discarded`
                    },
                    message: {
                        id: 'Neos.Neos.Ui:PublishingDialog:discard.document.success.message',
                        fallback: (props: { numberOfChanges: number; scopeTitle: string; }) =>
                            `${props.numberOfChanges} change(s) in document "${props.scopeTitle}" were sucessfully discarded.`
                    },
                    acknowledge: {
                        id: 'Neos.Neos.Ui:PublishingDialog:discard.document.success.acknowledge',
                        fallback: 'Okay, take me back'
                    }
                }
            }
        },
        [PublishDiscardPhase.ERROR]: {
            style: 'error',
            icon: 'exclamation-circle',
            [PublishDiscardScope.SITE]: {
                label: {
                    title: {
                        id: 'Neos.Neos.Ui:PublishingDialog:discard.site.error.title',
                        fallback: (props: { scopeTitle: string; }) =>
                            `Changes in site "${props.scopeTitle}" could not be discarded`
                    },
                    retry: {
                        id: 'Neos.Neos.Ui:PublishingDialog:discard.site.error.retry',
                        fallback: 'Try again'
                    },
                    acknowledge: {
                        id: 'Neos.Neos.Ui:PublishingDialog:discard.site.error.acknowledge',
                        fallback: 'Okay, take me back'
                    }
                }
            },
            [PublishDiscardScope.DOCUMENT]: {
                label: {
                    title: {
                        id: 'Neos.Neos.Ui:PublishingDialog:discard.document.error.title',
                        fallback: (props: { scopeTitle: string; }) =>
                            `Changes in document "${props.scopeTitle}" could not be discarded`
                    },
                    retry: {
                        id: 'Neos.Neos.Ui:PublishingDialog:discard.document.error.retry',
                        fallback: 'Try again'
                    },
                    acknowledge: {
                        id: 'Neos.Neos.Ui:PublishingDialog:discard.document.error.acknowledge',
                        fallback: 'Okay, take me back'
                    }
                }
            }
        }
    }
} as const;

type Result =
    | {
        phase: PublishDiscardPhase.ERROR,
        message: string
    }
    | { phase: PublishDiscardPhase.SUCCESS };

export const ResultDialog: React.FC<{
    mode: PublishDiscardMode;
    scope: PublishDiscardScope;
    scopeTitle: string;
    numberOfChanges: number;
    result: Result;
    onAcknowledge: () => void;
    onRetry: () => void;
}> = (props) => {
    const variant = ResultDialogVariants[props.mode];

    return (
        <Dialog
            actions={[
                props.result.phase === PublishDiscardPhase.ERROR ? (
                    <Button
                        id={`${variant.id}-Retry`}
                        key="retry"
                        style="warn"
                        hoverStyle="warn"
                        onClick={props.onRetry}
                    >
                        <Icon icon="refresh" className={style.buttonIcon} />
                        <I18n {...variant[props.result.phase][props.scope].label.retry} />
                    </Button>
                ) : null,
                <Button
                    id={`${variant.id}-Acknowledge`}
                    key="acknowledge"
                    style={variant[props.result.phase].style}
                    hoverStyle={variant[props.result.phase].style}
                    onClick={props.onAcknowledge}
                >
                    <I18n {...variant[props.result.phase][props.scope].label.acknowledge} />
                </Button>
            ]}
            title={
                <div>
                    <Icon icon={variant[props.result.phase].icon} />
                    <span className={style.modalTitle}>
                        <I18n
                            id={variant[props.result.phase][props.scope].label.title.id}
                            params={props}
                            fallback={variant[props.result.phase][props.scope].label.title.fallback(props)}
                            />
                    </span>
                </div>
            }
            onRequestClose={props.onAcknowledge}
            type={variant[props.result.phase].style}
            isOpen
            autoFocus
            preventClosing={props.result.phase === PublishDiscardPhase.ERROR}
            theme={undefined as any}
            style={undefined as any}
        >
            <div className={style.modalContents}>
                {props.result.phase === PublishDiscardPhase.ERROR
                    ? props.result.message
                    : (
                        <I18n
                            id={variant[props.result.phase][props.scope].label.message.id}
                            params={props}
                            fallback={variant[props.result.phase][props.scope].label.message.fallback(props)}
                            />
                    )
                }
            </div>
        </Dialog>
    );
};
