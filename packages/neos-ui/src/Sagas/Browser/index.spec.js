import {expectSaga} from 'redux-saga-test-plan';
import {watchContentURIChange, reflectChangeInAddressBar} from './index.js';

describe('watchContentURIChange()', () => {
    it('should be a generator function.', () => {
        expect(typeof watchContentURIChange).toBe('function');
        expect(typeof watchContentURIChange().next).toBe('function');
    });

    it('should takeEvery SET_CONTEXT_PATH actionType and execute the reflectChangeInAddressBar generator.', async function() {
        const result = await expectSaga(watchContentURIChange).run();

        expect(result.toJSON()).toMatchSnapshot();
    });
});

describe('reflectChangeInAddressBar()', () => {
    let replaceState;

    beforeEach(() => {
        replaceState = jest.spyOn(history, 'replaceState').mockImplementation(jest.fn());
    });

    afterEach(() => {
        replaceState.mockRestore();
    });

    it('should be a generator function.', () => {
        expect(typeof reflectChangeInAddressBar).toBe('function');
        expect(typeof reflectChangeInAddressBar().next).toBe('function');
    });

    it('should call the history.replaceState method with the actions payload "contextPath" property.', async function() {
        const result = await expectSaga(reflectChangeInAddressBar, {type: 'DATA', payload: {contextPath: 'fooContextPath'}}).run();

        expect(result.toJSON()).toMatchSnapshot();
    });
});
