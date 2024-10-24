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

export enum PublishingMode {
    PUBLISH,
    DISCARD
}

export enum PublishingScope {
    ALL,
    SITE,
    DOCUMENT
}

export enum PublishingPhase {
    START,
    ONGOING,
    CONFLICTS,
    SUCCESS,
    ERROR
}

export type State = null | {
    mode: PublishingMode;
    scope: PublishingScope;
    process:
        | { phase: PublishingPhase.START }
        | { phase: PublishingPhase.ONGOING }
        | { phase: PublishingPhase.CONFLICTS }
        | {
              phase: PublishingPhase.ERROR;
              error: null | AnyError;
          }
        | {
            phase: PublishingPhase.SUCCESS;
            numberOfAffectedChanges: number;
        };
};

export const defaultState: State = null;

export enum actionTypes {
    STARTED = '@neos/neos-ui/CR/Publishing/STARTED',
    CANCELLED = '@neos/neos-ui/CR/Publishing/CANCELLED',
    CONFIRMED = '@neos/neos-ui/CR/Publishing/CONFIRMED',
    CONFLICTS_OCCURRED = '@neos/neos-ui/CR/Publishing/CONFLICTS_OCCURRED',
    CONFLICTS_RESOLVED = '@neos/neos-ui/CR/Publishing/CONFLICTS_RESOLVED',
    FAILED = '@neos/neos-ui/CR/Publishing/FAILED',
    RETRIED = '@neos/neos-ui/CR/Publishing/RETRIED',
    SUCEEDED = '@neos/neos-ui/CR/Publishing/SUCEEDED',
    ACKNOWLEDGED = '@neos/neos-ui/CR/Publishing/ACKNOWLEDGED',
    FINISHED = '@neos/neos-ui/CR/Publishing/FINISHED'
}

/**
 * Publishes or discards all changes in the given scope
 */
const start = (mode: PublishingMode, scope: PublishingScope) =>
    createAction(actionTypes.STARTED, {mode, scope});

/**
 * Cancel the ongoing publish/discard workflow
 */
const cancel = () => createAction(actionTypes.CANCELLED);

/**
 * Confirm the ongoing publish/discard workflow
 */
const confirm = () => createAction(actionTypes.CONFIRMED);

/**
 * Signal that conflicts have occurred during the publish/discard operation
 */
const conflicts = () => createAction(actionTypes.CONFLICTS_OCCURRED);

/**
 * Signal that conflicts have been resolved during the publish/discard operation
 */
const resolveConflicts = () => createAction(actionTypes.CONFLICTS_RESOLVED);

/**
 * Signal that the ongoing publish/discard workflow has failed
 */
const fail = (error: null | AnyError) =>
    createAction(actionTypes.FAILED, {error});

/**
 * Attempt to retry a failed publish/discard workflow
 */
const retry = () => createAction(actionTypes.RETRIED);

/**
 * Signal that the ongoing publish/discard workflow succeeded
 */
const succeed = (numberOfAffectedChanges: number) =>
        createAction(actionTypes.SUCEEDED, {numberOfAffectedChanges});

/**
 * Acknowledge that the publish/discard operation is finished
 */
const acknowledge = () => createAction(actionTypes.ACKNOWLEDGED);

/**
 * Finish the ongoing publish/discard workflow
 */
const finish = () => createAction(actionTypes.FINISHED);

//
// Export the actions
//
export const actions = {
    start,
    cancel,
    confirm,
    conflicts,
    resolveConflicts,
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
                mode: action.payload.mode,
                scope: action.payload.scope,
                process: {
                    phase: PublishingPhase.START
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
                ...state,
                process: {
                    phase: PublishingPhase.ONGOING
                }
            };
        case actionTypes.CONFLICTS_OCCURRED:
            return {
                ...state,
                process: {
                    phase: PublishingPhase.CONFLICTS
                }
            };
        case actionTypes.CONFLICTS_RESOLVED:
            return {
                ...state,
                process: {
                    phase: PublishingPhase.ONGOING
                }
            };
        case actionTypes.FAILED:
            return {
                ...state,
                process: {
                    phase: PublishingPhase.ERROR,
                    error: action.payload.error
                }
            };
        case actionTypes.RETRIED:
            return {
                ...state,
                process: {
                    phase: PublishingPhase.ONGOING
                }
            };
        case actionTypes.SUCEEDED:
            return {
                ...state,
                process: {
                    phase: PublishingPhase.SUCCESS,
                    numberOfAffectedChanges: action.payload.numberOfAffectedChanges
                }
            };
        case actionTypes.FINISHED:
            return null;
        default:
            return state;
    }
};

export const selectors = {};
