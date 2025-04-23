import * as React from "react";
import {ReactReduxContext} from 'react-redux';
export interface IState {
    cr?: {
        nodes?: {
            siteNode?: string;
            documentNode?: string;
        };
        workspaces?: {
            personalWorkspace?: {
                name: string;
            };
        };
        contentDimensions?: {
            active: null | Record<string, string[]>;
        };
    };
    ui?: {
        pageTree?: {
            query?: string;
            filterNodeType?: string;
        };
    };
    system?: {
        authenticationTimeout?: boolean;
    };
}

export interface IStore {
    getState(): IState;
    subscribe(listener: () => void): () => void;
}

export function useSelector<R>(selector: (state: IState) => R): R {
    const redux = React.useContext(ReactReduxContext);

    const [result, setResult] = React.useState<R>(
        selector(redux.store.getState())
    );

    React.useEffect(
        () =>
            redux.store.subscribe(() => {
                const state = redux.store.getState();
                const result = selector(state);

                setResult(result);
            }),
        []
    );

    return result;
}
