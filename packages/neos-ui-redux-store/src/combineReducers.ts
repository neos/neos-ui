// This is a custom combineReducers implementation that also passes the original global state alongside

type FunctionReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

type CombinedState<T extends object> = { [K in keyof T]: FunctionReturnType<T[K]> };

type ActionFromReducer<T extends object> = T[keyof T] extends (
    state: any,
    action: infer A,
    ...args: any[]
) => any
    ? A
    : never;

interface Reducers {
    [ key: string]: any;
}

type ReducerReturnValueRoot<T extends object> = (
    state: CombinedState<T>,
    action: ActionFromReducer<T>,
    globalState: any
) => CombinedState<T>;

export function combineReducers<T extends Reducers>(reducers: T): ReducerReturnValueRoot<T> {
    type S = CombinedState<T>;
    const reducerProps = Object.keys(reducers);

    return (state: S = {} as S, action: any, globalState: any): S => {
        let hasChanged = false;
        const nextState: S = {} as S;
        for (const prop of reducerProps) {
            const reducer = reducers[prop];
            const previousStateForKey = state[prop];
            const nextStateForKey = reducer(previousStateForKey, action, globalState || state);
            (nextState as any)[prop] = nextStateForKey;
            hasChanged = hasChanged || nextStateForKey !== previousStateForKey;
        }
        return hasChanged ? nextState : state;
    };
}
