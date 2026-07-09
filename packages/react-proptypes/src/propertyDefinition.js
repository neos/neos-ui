import PropTypes from 'prop-types';
import {PropertyScope} from '@neos-project/neos-ui-contentrepository-model';

export default PropTypes.shape({
    type: PropTypes.string.isRequired,
    scope: PropTypes.oneOf([PropertyScope.NODE, PropertyScope.NODE_AGGREGATE, PropertyScope.SPECIALIZATIONS]),
    ui: PropTypes.shape({
        label: PropTypes.string,
        help: PropTypes.shape({
            message: PropTypes.string.isRequired
        }),
        reloadIfChanged: PropTypes.bool,
        reloadPageIfChanged: PropTypes.bool,
        inlineEditable: PropTypes.bool,
        inspector: PropTypes.shape({
            group: PropTypes.string,
            position: PropTypes.number,
            editor: PropTypes.string,
            editorOptions: PropTypes.object,
            editorListeners: PropTypes.shape({
                property: PropTypes.string.isRequired,
                handler: PropTypes.string.isRequired,
                handlerOptions: PropTypes.object
            })
        })
    })
});
