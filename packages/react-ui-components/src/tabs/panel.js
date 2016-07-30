import React, {PropTypes} from 'react';

const Panel = ({theme, children}) => <div className={theme.panel}>{children}</div>;
Panel.displayName = 'Panel';
Panel.propTypes = {
    // Props which are processed in the Parent Tabs Component.
    title: PropTypes.string,
    icon: PropTypes.string,

    // Contents of the Panel.
    children: PropTypes.any.isRequired,
    theme: PropTypes.shape({// eslint-disable-line quote-props
        'panel': PropTypes.string
    }).isRequired
};

export default Panel;
