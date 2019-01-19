// https://github.com/Microsoft/TypeScript/issues/21309#issuecomment-376338415
type RequestIdleCallbackHandle = any;
interface RequestIdleCallbackOptions {
    timeout: number;
}
interface RequestIdleCallbackDeadline {
    readonly didTimeout: boolean;
    timeRemaining: (() => number);
}

declare global {
    interface Window {
        requestIdleCallback: ((
            callback: ((deadline: RequestIdleCallbackDeadline) => void),
            opts?: RequestIdleCallbackOptions,
        ) => RequestIdleCallbackHandle);
        cancelIdleCallback: ((handle: RequestIdleCallbackHandle) => void);
    }
}

const fallbackCancelIdleCallback = (id: number) => clearTimeout(id);
const getCancelIdleCallback = (ctx = window) => {
    return ctx.cancelIdleCallback || fallbackCancelIdleCallback;
};
const cancelIdleCallback = getCancelIdleCallback();

export {
    fallbackCancelIdleCallback,
    getCancelIdleCallback,
    cancelIdleCallback as default
};
