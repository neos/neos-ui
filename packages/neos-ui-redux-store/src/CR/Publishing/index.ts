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

import {PublishableNode} from '../Workspaces';

export enum PublishingMode {
    PUBLISH,
    DISCARD
}

export enum PublishingScope {
    SITE,
    DOCUMENT
}

export enum PublishingPhase {
    START,
    ONGOING,
    SUCCESS,
    ERROR
}

export type State = null | {
    mode: PublishingMode;
    scope: PublishingScope;
    process:
        | { phase: PublishingPhase.START }
        | { phase: PublishingPhase.ONGOING }
        | {
              phase: PublishingPhase.ERROR;
              error: null | AnyError;
          }
        | { phase: PublishingPhase.SUCCESS };
};

export const defaultState: State = null;

export enum actionTypes {
    STARTED = '@neos/neos-ui/CR/Publishing/STARTED',
    CANCELLED = '@neos/neos-ui/CR/Publishing/CANCELLED',
    CONFIRMED = '@neos/neos-ui/CR/Publishing/CONFIRMED',
    FAILED = '@neos/neos-ui/CR/Publishing/FAILED',
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
 * Signal that the ongoing publish/discard workflow has failed
 */
const fail = (error: null | AnyError) =>
    createAction(actionTypes.FAILED, {error});

/**
 * Signal that the ongoing publish/discard workflow succeeded
 */
const succeed = () => createAction(actionTypes.SUCEEDED);

/**
 * Acknowledge that the publish/discard operation is finished
 */
const acknowledge = () => createAction(actionTypes.ACKNOWLEDGED);

/**
 * Finish the ongoing publish/discard workflow
 */
const finish = (affectedNodes: PublishableNode[]) => createAction(actionTypes.FINISHED, {affectedNodes});

//
// Export the actions
//
export const actions = {
    start,
    cancel,
    confirm,
    fail,
    succeed,
    acknowledge,
    finish
};

export type Action = ActionType<typeof actions>;
export type FinishAction = ActionType<typeof actions.finish>;

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
        case actionTypes.FAILED:
            return {
                ...state,
                process: {
                    phase: PublishingPhase.ERROR,
                    error: action.payload.error
                }
            };
        case actionTypes.SUCEEDED:
            return {
                ...state,
                process: {
                    phase: PublishingPhase.SUCCESS
                }
            };
        case actionTypes.FINISHED:
            return null;
        default:
            return state;
    }
};

export const selectors = {};
