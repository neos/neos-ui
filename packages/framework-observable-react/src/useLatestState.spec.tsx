import React from 'react';
import {render} from 'react-dom';
import {createState, State} from '@neos-project/framework-observable';
import {act} from 'react-dom/test-utils'
import {useLatestState} from './useLatestState';

function TestStateComponent<T>(props: {state$: State<T>}) {
    const value = useLatestState(props.state$);
    return <>{JSON.stringify(value)}</>;
}

describe('useLatestState', () => {
    let container: HTMLDivElement;

    beforeEach(() => {
        container = document.createElement('div');
        document.body.appendChild(container);
    });

    afterEach(() => {
        document.body.removeChild(container);
        // @ts-ignore
        container = null;
    });

    it('initial state, update, set to initial', () => {
        const state$ = createState(0);

        act(() => {
            render(<TestStateComponent state$={state$} />, container);
        });

        expect(container.innerHTML).toBe('0');

        act(() => {
            state$.update(() => 1);
        })

        expect(container.innerHTML).toBe('1');

        act(() => {
            state$.update(() => 0);
        })

        expect(container.innerHTML).toBe('0');
    });
});
