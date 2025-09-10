import React from 'react';
import {render} from 'react-dom';
import {createObservable, createState, Observable} from "@neos-project/framework-observable";
import {useLatestValueFrom} from "./useLatestValueFrom";
import {act} from 'react-dom/test-utils'

function TestObservableComponent<T>(props: {observable$: Observable<T>, defaultValue?: T}) {
    const value = useLatestValueFrom(props.observable$, props.defaultValue);
    return <>{JSON.stringify(value)}</>;
}

describe('useLatestValueFrom', () => {
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

    it('empty observable.', () => {
        const observable$ = createObservable(() => {});

        act(() => {
            render(<TestObservableComponent observable$={observable$} />, container);
        });

        expect(container.innerHTML).toBe('null');
    });

    it('empty observable with defaultValue.', () => {
        const observable$ = createObservable(() => {});

        act(() => {
            render(<TestObservableComponent observable$={observable$} defaultValue={"default"} />, container);
        });

        expect(container.innerHTML).toBe('"default"');
    });

    it('initial state from state observe-able.', () => {
        const observable$ = createState(0);

        act(() => {
            render(<TestObservableComponent observable$={observable$} />, container);
        });

        expect(container.innerHTML).toBe('0');
    });

    it('update state.', () => {
        const observable$ = createState(0);

        act(() => {
            render(<TestObservableComponent observable$={observable$} />, container);
        });

        expect(container.innerHTML).toBe('0');

        act(() => {
            observable$.update(() => 1);
        })

        expect(container.innerHTML).toBe('1');
    });

    it('update state back to defaultValue.', () => {
        const observable$ = createState(0);

        act(() => {
            render(<TestObservableComponent observable$={observable$} defaultValue={0} />, container);
        });

        expect(container.innerHTML).toBe('0');

        act(() => {
            observable$.update(() => 1);
        })

        expect(container.innerHTML).toBe('1');


        act(() => {
            observable$.update(() => 0);
        })

        expect(container.innerHTML).toBe('0');
    });

    it('update complex state.', () => {
        const observable$ = createState({
            isOpen: false
        });

        act(() => {
            render(<TestObservableComponent observable$={observable$} />, container);
        });

        expect(container.innerHTML).toBe('{"isOpen":false}');

        act(() => {
            observable$.update(() => ({
                isOpen: true
            }));
        })

        expect(container.innerHTML).toBe('{"isOpen":true}');

        act(() => {
            observable$.update(() => ({
                isOpen: false
            }));
        })

        expect(container.innerHTML).toBe('{"isOpen":false}');
    });

    it('update multiple hooks.', () => {
        const observable$ = createState(0);

        act(() => {
            render(<>
                first:<TestObservableComponent observable$={observable$} />;
                second:<TestObservableComponent observable$={observable$} />;
            </>, container);
        });

        expect(container.innerHTML).toBe('first:0; second:0;');

        act(() => {
            observable$.update(() => 1);
        })

        expect(container.innerHTML).toBe('first:1; second:1;');

        act(() => {
            observable$.update(() => 0);
        })

        expect(container.innerHTML).toBe('first:0; second:0;');
    });
});
