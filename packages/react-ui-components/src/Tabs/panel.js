import React from 'react';
import PropTypes from 'prop-types';

const Panel = ({theme, children}) => <div className={theme.panel}>{children}</div>;
Panel.displayName = 'Panel';
Panel.propTypes = {
    /**
     * The title to be rendered within the navigation item of this Panel.
     */
    title: PropTypes.string,

    /**
     * An optional icon identifier which will be rendered within the navigation item of this Panel.
     */
    icon: PropTypes.string,

    /**
     * The children to render within the div node.
     */
    children: PropTypes.any.isRequired,

    /**
     * An optional css theme to be injected.
     */
    theme: PropTypes.shape({/* eslint-disable quote-props */
        'panel': PropTypes.string
    }).isRequired/* eslint-enable quote-props */
};

export default Panel;
