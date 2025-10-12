import React from 'react';
import {render} from 'react-dom';
import {act} from 'react-dom/test-utils'
import {usePromise} from './usePromise';

function TestPromiseComponent<T>(props: {promise: Promise<T>}) {
    const value = usePromise(() => props.promise, []);
    return <>{JSON.stringify({value: value.value, error: value.error ? {name: value.error.name, message: value.error.message} : null, isLoading: value.isLoading})}</>;
}

function wrapCallbackInAct(callback: (...args: any[]) => any) {
    return (...args: any[]) => {
        let value = null;
        act(() => {
            value = callback(...args);
        })
        return value;
    }
}

// there is probably a better way to invoke act() around any registered promise listener - or we just need to write tests with "@testing-library/react-hooks" instead
function createPromiseWithAct<T>(promise: Promise<T>): Promise<T> {
    return {
        // @ts-ignore
        then(onfulfilled, onrejected) {
            return createPromiseWithAct(promise.then(onfulfilled ? wrapCallbackInAct(onfulfilled) : undefined, onrejected ? wrapCallbackInAct(onrejected) : undefined))
        },
        // @ts-ignore
        catch(onrejected) {
            return createPromiseWithAct(promise.catch(onrejected ? wrapCallbackInAct(onrejected) : undefined))
        },
        finally(onfinally) {
            return createPromiseWithAct(promise.finally(onfinally ? wrapCallbackInAct(onfinally) : undefined))
        }
    };
}

describe('usePromise', () => {
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

    it('promise resolve', (done) => {
        const promise = new Promise(r => {
            process.nextTick(done);
            r('Hello');
        });

        act(() => {
            render(<TestPromiseComponent promise={createPromiseWithAct(promise)} />, container);
        });

        expect(container.innerHTML).toBe(JSON.stringify({value: null, error: null, isLoading: true}));

        process.nextTick(() => {
            expect(container.innerHTML).toBe(JSON.stringify({value: 'Hello', error: null, isLoading: false}));
        });
    });

    it('promise reject', (done) => {
        const promise = new Promise((_, reject) => {
            process.nextTick(done);
            reject('An error string');
        });

        act(() => {
            render(<TestPromiseComponent promise={createPromiseWithAct(promise)} />, container);
        });

        expect(container.innerHTML).toBe(JSON.stringify({value: null, error: null, isLoading: true}));

        process.nextTick(() => {
            expect(container.innerHTML).toBe(JSON.stringify({value: null, error: {name: 'Error', message: 'An error string'}, isLoading: false}));
        });
    });

    // todo test when promise factory is dependency and when there are other dependencies.
});
