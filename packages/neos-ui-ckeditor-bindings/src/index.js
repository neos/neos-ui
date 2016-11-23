import guestFrameApi from './guestFrameApi';

Object.defineProperty(window, 'NeosCKEditorApi', {
    value: guestFrameApi,
    enumerable: false,
    writable: false,
    configurable: true
});
