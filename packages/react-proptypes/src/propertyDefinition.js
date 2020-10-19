import PropTypes from 'prop-types';

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
