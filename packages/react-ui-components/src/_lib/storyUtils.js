import React from 'react';
import PropTypes from 'prop-types';

/**
 * The StoryWrapper is a simple component which can be used to wrap stories
 * of the react-storybook lib.
 */
export const StoryWrapper = ({children, ...rest}) => (
    <div
        style={{background: '#000', padding: '1rem', position: 'relative'}}
        {...rest}
        >
        {children}
    </div>
);
StoryWrapper.propTypes = {
    children: PropTypes.node.isRequired
};
