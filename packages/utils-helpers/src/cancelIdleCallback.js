window.cancelIdleCallback = window.cancelIdleCallback || function (id) {
    clearTimeout(id);
};

export default function cancelIdleCallback(id) {
    window.cancelIdleCallback(id);
}
