// Polyfil for window.requestIdleCallback
// https://developer.mozilla.org/en-US/docs/Web/API/Background_Tasks_API#Falling_back_to_setTimeout
//
// ToDo: Check if we could switch to using https://github.com/aFarkas/requestIdleCallback
const polyfil = (handler: any) => {
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
const requestIdleCallback = window.requestIdleCallback || polyfil;
export default requestIdleCallback;
