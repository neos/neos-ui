const cancelIdleCallback = window.cancelIdleCallback || function (id) {
    clearTimeout(id);
};
export default cancelIdleCallback;
