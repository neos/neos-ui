import { AsyncState } from 'react-use/lib/useAsync';

export type IProcess<R> =
    | {busy: true, error: null, result: null}
    | {busy: false, error: Error, result: null}
    | {busy: false, error: null, result: R}
;

const BUSY: IProcess<any> = {busy: true, error: null, result: null};

export function busy(): IProcess<any> {
    return BUSY;
}

export function error(error: Error): IProcess<any> {
    return {busy: false, error, result: null};
}

export function success<R>(result: R): IProcess<R> {
    return {busy: false, error: null, result};
}

export function fromAsyncState<R>(asyncState: AsyncState<R>): IProcess<R> {
    return {
        busy: asyncState.loading,
        error: asyncState.error ?? null,
        result: asyncState.value ?? null
    } as IProcess<R>;
}