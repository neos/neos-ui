import React, {Component, PropTypes} from 'react';

//
// A higher order component to easily spread global
// configuration
//
export default () => WrappedComponent => {
    return class NeosDecorator extends Component {
        static contextTypes = {
            configuration: PropTypes.object.isRequired,
            inspectorEditorRegistry: PropTypes.object.isRequired,
            translations: PropTypes.object.isRequired
        };

        static displayName = `Neos(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

        render() {
            const {configuration, inspectorEditorRegistry, translations} = this.context;

            return (
                <WrappedComponent
                    neos={{configuration}}
                    inspectorEditorRegistry={inspectorEditorRegistry}
                    translations={translations}
                    {...this.props}
                    />
            );
        }
    };
};
