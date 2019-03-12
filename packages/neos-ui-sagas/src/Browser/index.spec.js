import {testSaga, expectSaga} from 'redux-saga-test-plan';
import {watchContentURIChange, reflectChangeInAddressBar} from './index.js';

describe('watchContentURIChange()', () => {
    it('should be a generator function.', () => {
        expect(typeof watchContentURIChange).toBe('function');
        expect(typeof watchContentURIChange().next).toBe('function');
    });

    it('should not throw an error when running the saga.', () => {
        // ToDo: Currently snapshot testing with takeEvery / takeLatest does not seem to work, investigate.
        expect(() => testSaga(watchContentURIChange).next().next().isDone()).not.toThrow();
    });
});

describe('reflectChangeInAddressBar()', () => {
    let replaceState;

    beforeEach(() => {
        replaceState = jest.spyOn(history, 'replaceState').mockImplementation(jest.fn(() => Promise.resolve()));
    });

    afterEach(() => {
        replaceState.mockRestore();
    });

    it('should be a generator function.', () => {
        expect(typeof reflectChangeInAddressBar).toBe('function');
        expect(typeof reflectChangeInAddressBar().next).toBe('function');
    });

    it('should call the history.replaceState method with the actions payload "contextPath" property.', async () => {
        const result = await expectSaga(reflectChangeInAddressBar, {type: 'DATA', payload: {documentNode: 'fooContextPath'}}).run();

        expect(result.toJSON()).toMatchSnapshot();
    });
});
