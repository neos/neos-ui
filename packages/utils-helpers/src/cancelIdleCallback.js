const fallbackCancelIdleCallback = id => clearTimeout(id);
const getCancelIdleCallback = (ctx = window) => {
    return ctx.cancelIdleCallback || fallbackCancelIdleCallback;
};
const cancelIdleCallback = getCancelIdleCallback();

export {
    fallbackCancelIdleCallback,
    getCancelIdleCallback,
    cancelIdleCallback as default
};
