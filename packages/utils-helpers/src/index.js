import delay from './delay';
import discover from './discover';
import isThenable from './isThenable';
import loadScript from './loadScript';
import {stripTags, stripTagsEncoded} from './stripTags';
import decodeHtml from './decodeHtml';
import requestIdleCallback from './requestIdleCallback';
import cancelIdleCallback from './cancelIdleCallback';
import getVersion from './getVersion';

export {
    delay,
    discover,
    decodeHtml,
    getVersion,
    isThenable,
    loadScript,
    stripTags,
    stripTagsEncoded,
    cancelIdleCallback,
    requestIdleCallback
};
