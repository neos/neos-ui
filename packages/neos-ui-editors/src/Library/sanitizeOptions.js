import memoize from 'lodash.memoize';

import {stripTags, decodeHtml} from '@neos-project/utils-helpers';

export const sanitizeOption = memoize(
    option =>
        typeof option === 'object' ? {
            ...option,
            label: decodeHtml(stripTags(option.label)),
            breadcrumb: 'breadcrumb' in option ?
                decodeHtml(stripTags(option.breadcrumb)) : undefined
        } : option
);

export const sanitizeOptions = memoize(
    options =>
        (Array.isArray(options) ? options : [])
            .map(sanitizeOption)
);

