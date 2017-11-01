// Polyfil for window.requestIdleCallback
// https://developer.mozilla.org/en-US/docs/Web/API/Background_Tasks_API#Falling_back_to_setTimeout
const requestIdleCallback = window.requestIdleCallback || function (handler) {
    const startTime = Date.now();

    return setTimeout(() => {
        handler({
            didTimeout: false,
            timeRemaining: () => {
                return Math.max(0, 50.0 - (Date.now() - startTime));
            }
        });
    }, 1);
};
export default requestIdleCallback;
