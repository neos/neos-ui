import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';

const DisplayName = ({children, name}) => {
    const Wrapper = ({children}) => children;
    Wrapper.displayName = name;
    return <Wrapper>{children}</Wrapper>;
};
DisplayName.propTypes = {
    name: PropTypes.string.isRequired,
    children: PropTypes.any.isRequired
}

export default DisplayName;
