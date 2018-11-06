declare module '@neos-project/utils-redux' {
    export function handleActions<S>(handlers: Object): (state: S, action: string) => S;
}
