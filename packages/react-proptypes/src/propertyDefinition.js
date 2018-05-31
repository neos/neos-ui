import PropTypes from 'prop-types';

import alohaConfiguration from './alohaConfiguration';
import editorOptions from './editorOptions';

export default PropTypes.shape({
    type: PropTypes.string.isRequired,
    ui: PropTypes.shape({
        label: PropTypes.string,
        help: PropTypes.shape({
            message: PropTypes.string.isRequired
        }),
        reloadIfChanged: PropTypes.bool,
        reloadPageIfChanged: PropTypes.bool,
        inlineEditable: PropTypes.bool,
        aloha: alohaConfiguration,
        inline: PropTypes.shape({
            editor: PropTypes.string,
            editorOptions: editorOptions
        }),
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
