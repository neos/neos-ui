import React, {PropTypes} from 'react';

/**
 * The StoryWrapper is a simple component which can be used to wrap stories
 * of the react-storybook lib.
 */
export const StoryWrapper = ({title, children, ...rest}) => (
    <div
        style={{background: '#000', color: '#FFF', padding: '1rem'}}
        {...rest}
        >
        <h1 style={{fontFamily: 'sans-serif', margin: '0 0 0.5rem'}}>{title}</h1>
        <div style={{position: 'relative', height: '90vh'}}>{children}</div>
    </div>
);
StoryWrapper.propTypes = {
    title: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired
};
