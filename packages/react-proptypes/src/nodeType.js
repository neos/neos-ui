import PropTypes from 'prop-types';

import propertyDefinition from './propertyDefinition';

export default PropTypes.shape({
    constraints: PropTypes.shape({
        nodeTypes: PropTypes.object.isRequired
    }),
    label: PropTypes.string.isRequired,
    properties: PropTypes.objectOf(propertyDefinition).isRequired,
    superTypes: PropTypes.objectOf(PropTypes.bool),
    ui: PropTypes.shape({
        label: PropTypes.string,
        help: PropTypes.object,
        icon: PropTypes.string,
        group: PropTypes.string,
        position: PropTypes.number,
        inspector: PropTypes.shape({
            tabs: PropTypes.shape({
                label: PropTypes.string,
                icon: PropTypes.string,
                position: PropTypes.number
            }),
            groups: PropTypes.shape({
                label: PropTypes.string,
                tab: PropTypes.string,
                position: PropTypes.number,
                collapsed: PropTypes.bool
            }),
            views: PropTypes.shape({
                label: PropTypes.string,
                group: PropTypes.string,
                view: PropTypes.string,
                position: PropTypes.number
            })
        }),
        search: PropTypes.shape({
            searchCategory: PropTypes.string
        })
    })
});
