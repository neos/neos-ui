import guestFrameApi from './guestFrameApi';

Object.defineProperty(window, '@Neos.Neos.Ui:CKEditorApi', {
    value: guestFrameApi,
    enumerable: false,
    writable: false,
    configurable: true
});
