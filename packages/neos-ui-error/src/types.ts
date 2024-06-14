/*
 * This file is part of the Neos.Neos.Ui package.
 *
 * (c) Contributors of the Neos Project - www.neos.io
 *
 * This package is Open Source Software. For the full copyright and license
 * information, please view the LICENSE file which was distributed with this
 * source code.
 */

export type ECMAScriptError = Error;
export type ServerSideError = {
    class: string;
    code: number;
    message: string;
    trace: string;
};
export type StringError = string;
export type AnyError = ECMAScriptError | ServerSideError | StringError;

export function isECMAScriptError(candidate: unknown): candidate is ECMAScriptError {
    return candidate instanceof Error;
}

export function isServerSideError(candidate: unknown): candidate is ServerSideError {
    if (candidate === null) {
        return false;
    }

    if (candidate === undefined) {
        return false;
    }

    if (typeof candidate === 'object') {
        return (
            'class' in candidate
            && typeof (candidate as any).class === 'string'
            && 'code' in candidate
            && typeof (candidate as any).code === 'number'
            && 'message' in candidate
            && typeof (candidate as any).message === 'string'
            && 'trace' in candidate
            && typeof (candidate as any).trace === 'string'
        );
    }

    return false;
}

export function isStringError(candidate: unknown): candidate is StringError {
    return typeof candidate === 'string';
}
