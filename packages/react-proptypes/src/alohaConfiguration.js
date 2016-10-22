import {PropTypes} from 'react';

export default PropTypes.shape({
    format: PropTypes.shape({
        strong: PropTypes.bool,
        b: PropTypes.bool,
        em: PropTypes.bool,
        i: PropTypes.bool,
        u: PropTypes.bool,
        del: PropTypes.bool,
        sub: PropTypes.bool,
        sup: PropTypes.bool,
        p: PropTypes.bool,
        h1: PropTypes.bool,
        h2: PropTypes.bool,
        h3: PropTypes.bool,
        h4: PropTypes.bool,
        h5: PropTypes.bool,
        h6: PropTypes.bool,
        pre: PropTypes.bool,
        removeFormat: PropTypes.bool
    }),
    table: PropTypes.shape({
        table: PropTypes.bool
    }),
    link: PropTypes.shape({
        a: PropTypes.bool
    }),
    list: PropTypes.shape({
        ol: PropTypes.bool,
        ul: PropTypes.bool
    }),
    alignment: PropTypes.shape({
        right: PropTypes.bool,
        left: PropTypes.bool,
        center: PropTypes.bool,
        justify: PropTypes.bool,
        top: PropTypes.bool,
        middle: PropTypes.bool,
        bottom: PropTypes.bool
    }),
    formatlesspaste: PropTypes.shape({
        button: PropTypes.bool,
        formatlessPasteOption: PropTypes.bool,
        strippedElements: PropTypes.arrayOf(
            PropTypes.string
        )
    }),
    autoparagraph: PropTypes.bool,
    placeholder: PropTypes.string
});
