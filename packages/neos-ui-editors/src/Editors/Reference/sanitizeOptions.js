import memoize from 'lodash.memoize';

import {stripTags, decodeHtml} from '@neos-project/utils-helpers';

export const sanitizeOptions = memoize(
    options =>
        (Array.isArray(options) ? options : [])
            .map(
                option =>
                    typeof option === 'object' ? {
                        ...option,
                        label: decodeHtml(stripTags(option.label))
                    } : option
            )
);
