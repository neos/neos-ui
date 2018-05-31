import PropTypes from 'prop-types';

export default PropTypes.shape({
    autoparagraph: PropTypes.bool,
    placeholder: PropTypes.string,
    formatting: PropTypes.shape({
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
        removeFormat: PropTypes.bool,
        table: PropTypes.bool,
        a: PropTypes.bool,
        ol: PropTypes.bool,
        ul: PropTypes.bool,
        right: PropTypes.bool,
        left: PropTypes.bool,
        center: PropTypes.bool,
        justify: PropTypes.bool,
        top: PropTypes.bool,
        middle: PropTypes.bool,
        bottom: PropTypes.bool
    })
});
