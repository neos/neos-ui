
export type IPromiseState<R> =
    | {isLoading: true, error: null, value: null}
    | {isLoading: false, error: Error, value: null}
    | {isLoading: false, error: null, value: R}
    ;

const LOADING: IPromiseState<any> = {isLoading: true, error: null, value: null};

export function forLoading(): IPromiseState<any> {
    return LOADING;
}

export function forError(error: Error): IPromiseState<any> {
    return {isLoading: false, error, value: null};
}

export function forValue<R>(value: R): IPromiseState<R> {
    return {isLoading: false, error: null, value};
}
