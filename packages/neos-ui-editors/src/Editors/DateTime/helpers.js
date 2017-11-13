//
// Convert from our custom PHP-like date format to momentjs date format
// See: https://neos.readthedocs.io/en/stable/References/PropertyEditorReference.html#property-type-datetime-datetimeeditor-date-time-selection-editor
//
// ToDo: Move into re-usable fn - Maybe into `util-helpers`?
export default function (format) {
    const formatMap = {
        d: 'DD',
        D: 'ddd',
        j: 'D',
        l: 'dddd',
        N: 'E',
        w: 'd',
        W: 'W',
        F: 'MMMM',
        m: 'MM',
        M: 'MMM',
        n: 'M',
        o: 'GGGG',
        Y: 'YYYY',
        y: 'YY',
        a: 'a',
        A: 'A',
        g: 'h',
        G: 'H',
        h: 'hh',
        H: 'HH',
        i: 'mm',
        s: 'ss',
        O: 'ZZ',
        P: 'Z',
        U: 'X'
    };
    return format.replace(
        /[dDjlNwWFmMnoYyaAgGhHisOPU]/g,
        phpStr => formatMap[phpStr]
    );
}

//
// Check if given format has a date formatting
//
export const hasDateFormat = format => /[yYFmMntdDjlNSw]/.test(format);

//
// Check if given format has a time formatting
//
export const hasTimeFormat = format => /[gGhHis]/.test(format);
