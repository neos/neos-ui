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
import {PublishingMode, PublishingPhase, PublishingScope} from '@neos-project/neos-ui-redux-store/src/CR/Publishing';
import {AnyError, ErrorView} from '@neos-project/neos-ui-error';

import style from './style.module.css';

const ResultDialogVariants = {
    [PublishingMode.PUBLISH]: {
        id: 'neos-PublishDialog',
        [PublishingPhase.SUCCESS]: {
            style: 'success',
            icon: 'check',
            [PublishingScope.SITE]: {
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
            [PublishingScope.DOCUMENT]: {
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
        [PublishingPhase.ERROR]: {
            style: 'error',
            icon: 'exclamation-circle',
            [PublishingScope.SITE]: {
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
            [PublishingScope.DOCUMENT]: {
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
    [PublishingMode.DISCARD]: {
        id: 'neos-DiscardDialog',
        [PublishingPhase.SUCCESS]: {
            style: 'success',
            icon: 'check',
            [PublishingScope.SITE]: {
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
            [PublishingScope.DOCUMENT]: {
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
        [PublishingPhase.ERROR]: {
            style: 'error',
            icon: 'exclamation-circle',
            [PublishingScope.SITE]: {
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
            [PublishingScope.DOCUMENT]: {
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
        phase: PublishingPhase.ERROR;
        error: null | AnyError;
    }
    | { phase: PublishingPhase.SUCCESS };

export const ResultDialog: React.FC<{
    mode: PublishingMode;
    scope: PublishingScope;
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
                props.result.phase === PublishingPhase.ERROR ? (
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
            preventClosing={props.result.phase === PublishingPhase.ERROR}
            theme={undefined as any}
            style={undefined as any}
        >
            <div className={style.modalContents}>
                {props.result.phase === PublishingPhase.ERROR
                    ? (<ErrorView error={props.result.error} />)
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
