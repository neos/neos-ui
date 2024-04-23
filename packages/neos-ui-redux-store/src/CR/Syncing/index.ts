/*
 * This file is part of the Neos.Neos.Ui package.
 *
 * (c) Contributors of the Neos Project - www.neos.io
 *
 * This package is Open Source Software. For the full copyright and license
 * information, please view the LICENSE file which was distributed with this
 * source code.
 */
import {action as createAction, ActionType} from 'typesafe-actions';

import type {AnyError} from '@neos-project/neos-ui-error';

import {TypeOfChange} from '../Workspaces';

export enum SyncingPhase {
    START,
    ONGOING,
    CONFLICT,
    RESOLVING,
    ERROR,
    SUCCESS
}

export enum ResolutionStrategy {
    FORCE,
    DISCARD_ALL
}

export enum ReasonForConflict {
    NODE_HAS_BEEN_DELETED
}

export type Conflict = {
    key: string;
    affectedNode: null | {
        icon: string;
        label: string;
    },
    affectedSite: null | {
        icon: string;
        label: string;
    },
    affectedDocument: null | {
        icon: string;
        label: string;
    },
    typeOfChange: null | TypeOfChange,
    reasonForConflict: null | ReasonForConflict
};

export type State = null | {
    process:
        | { phase: SyncingPhase.START }
        | { phase: SyncingPhase.ONGOING }
        | {
            phase: SyncingPhase.CONFLICT;
            strategy: null | ResolutionStrategy;
            conflicts: Conflict[];
        }
        | {
            phase: SyncingPhase.RESOLVING;
            strategy: ResolutionStrategy;
            conflicts: Conflict[];
        }
        | {
              phase: SyncingPhase.ERROR;
              error: null | AnyError;
          }
        | { phase: SyncingPhase.SUCCESS };
};

export const defaultState: State = null;

export enum actionTypes {
    STARTED = '@neos/neos-ui/CR/Syncing/STARTED',
    CANCELLED = '@neos/neos-ui/CR/Syncing/CANCELLED',
    CONFIRMED = '@neos/neos-ui/CR/Syncing/CONFIRMED',
    CONFLICTS_DETECTED = '@neos/neos-ui/CR/Syncing/CONFLICTS_DETECTED',
    RESOLUTION_STARTED = '@neos/neos-ui/CR/Syncing/RESOLUTION_STARTED',
    RESOLUTION_CANCELLED = '@neos/neos-ui/CR/Syncing/RESOLUTION_CANCELLED',
    RESOLUTION_CONFIRMED = '@neos/neos-ui/CR/Syncing/RESOLUTION_CONFIRMED',
    FAILED = '@neos/neos-ui/CR/Syncing/FAILED',
    RETRIED = '@neos/neos-ui/CR/Syncing/RETRIED',
    SUCEEDED = '@neos/neos-ui/CR/Syncing/SUCEEDED',
    ACKNOWLEDGED = '@neos/neos-ui/CR/Syncing/ACKNOWLEDGED',
    FINISHED = '@neos/neos-ui/CR/Syncing/FINISHED'
}

/**
 * Initiates the process of syncing (rebasing) the workspace
 */
const start = () => createAction(actionTypes.STARTED);

/**
 * Cancel the ongoing syncing (rebasing) workflow
 */
const cancel = () => createAction(actionTypes.CANCELLED);

/**
 * Confirm the ongoing syncing (rebasing) workflow
 */
const confirm = () => createAction(actionTypes.CONFIRMED);

/**
 * Signal that conflicts occurred during the ongoing syncing (rebasing) workflow
 */
const resolve = (conflicts: Conflict[]) =>
    createAction(actionTypes.CONFLICTS_DETECTED, {conflicts});

/**
 * Initiates the process of resolving a conflict that occurred
 * during the ongoing syncing (rebasing) workflow
 */
const selectResolutionStrategy = (strategy: ResolutionStrategy) =>
    createAction(actionTypes.RESOLUTION_STARTED, {strategy});

/**
 * Cancel the ongoing resolution workflow
 */
const cancelResolution = () => createAction(actionTypes.RESOLUTION_CANCELLED);

/**
 * Confirm the ongoing resolution workflow
 */
const confirmResolution = () => createAction(actionTypes.RESOLUTION_CONFIRMED);

/**
 * Signal that the ongoing syncing (rebasing) workflow has failed
 */
const fail = (error: null | AnyError) =>
    createAction(actionTypes.FAILED, {error});

/**
 * Attempt to retry a failed syncing (rebasing) workflow
 */
const retry = () => createAction(actionTypes.RETRIED);

/**
 * Signal that the ongoing syncing (rebasing) workflow succeeded
 */
const succeed = () => createAction(actionTypes.SUCEEDED);

/**
 * Acknowledge that the syncing (rebasing) operation is finished
 */
const acknowledge = () => createAction(actionTypes.ACKNOWLEDGED);

/**
 * Finish the ongoing syncing (rebasing) workflow
 */
const finish = () => createAction(actionTypes.FINISHED);

//
// Export the actions
//
export const actions = {
    start,
    cancel,
    confirm,
    resolve,
    selectResolutionStrategy,
    cancelResolution,
    confirmResolution,
    fail,
    retry,
    succeed,
    acknowledge,
    finish
};

export type Action = ActionType<typeof actions>;

//
// Export the reducer
//
export const reducer = (state: State = defaultState, action: Action): State => {
    if (state === null) {
        if (action.type === actionTypes.STARTED) {
            return {
                process: {
                    phase: SyncingPhase.START
                }
            };
        }

        return null;
    }

    switch (action.type) {
        case actionTypes.CANCELLED:
            return null;
        case actionTypes.CONFIRMED:
            return {
                process: {
                    phase: SyncingPhase.ONGOING
                }
            };
        case actionTypes.CONFLICTS_DETECTED:
            return {
                process: {
                    phase: SyncingPhase.CONFLICT,
                    conflicts: action.payload.conflicts,
                    strategy: null
                }
            };
        case actionTypes.RESOLUTION_STARTED:
            if (state.process.phase === SyncingPhase.CONFLICT) {
                return {
                    process: {
                        ...state.process,
                        phase: SyncingPhase.RESOLVING,
                        strategy: action.payload.strategy
                    }
                };
            }
            return state;
        case actionTypes.RESOLUTION_CANCELLED:
            if (state.process.phase === SyncingPhase.RESOLVING) {
                return {
                    process: {
                        ...state.process,
                        phase: SyncingPhase.CONFLICT
                    }
                };
            }
            return state;
        case actionTypes.RESOLUTION_CONFIRMED:
            return {
                process: {
                    phase: SyncingPhase.ONGOING
                }
            };
        case actionTypes.FAILED:
            return {
                process: {
                    phase: SyncingPhase.ERROR,
                    error: action.payload.error
                }
            };
        case actionTypes.RETRIED:
            return {
                process: {
                    phase: SyncingPhase.ONGOING
                }
            };
        case actionTypes.SUCEEDED:
            return {
                process: {
                    phase: SyncingPhase.SUCCESS
                }
            };
        case actionTypes.FINISHED:
            return null;
        default:
            return state;
    }
};

export const selectors = {};
