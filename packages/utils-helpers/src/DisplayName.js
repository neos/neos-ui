import React from 'react';
import PropTypes from 'prop-types';

// Wraps children with a dummy component with a given DisplayName
// Useful for finding components in E2E tests
const DisplayName = ({children, name}) => {
    const Wrapper = ({children}) => children;
    Wrapper.displayName = name;
    return <Wrapper>{children}</Wrapper>;
};
DisplayName.propTypes = {
    name: PropTypes.string.isRequired,
    children: PropTypes.any.isRequired
};

export default DisplayName;
