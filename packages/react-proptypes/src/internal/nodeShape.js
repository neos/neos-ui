import PropTypes from 'prop-types';

export default {
    nodeType: PropTypes.string.isRequired,
    contextPath: PropTypes.string.isRequired,
    identifier: PropTypes.string.isRequired,
    isAutoCreated: PropTypes.bool.isRequired,
    label: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    properties: PropTypes.object.isRequired,
    uri: PropTypes.string
};
