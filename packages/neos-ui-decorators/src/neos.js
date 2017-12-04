import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {defaultMemoize} from 'reselect';

// We need to memoize configuration and global registry; otherwise a new object is created at every render; leading to
// LOADS of unnecessary re-draws.
const buildConfigurationAndGlobalRegistry = defaultMemoize((configuration, globalRegistry, routes) => ({configuration, globalRegistry, routes}));

//
// A higher order component to easily spread global
// configuration
//
export default mapRegistriesToProps => WrappedComponent => {
    const Decorator = class NeosDecorator extends PureComponent {
        static Original = WrappedComponent;

        static contextTypes = {
            globalRegistry: PropTypes.object.isRequired,
            configuration: PropTypes.object.isRequired,
            routes: PropTypes.object.isRequired
        };

        static displayName = `Neos(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

        render() {
            const {configuration, globalRegistry, routes} = this.context;
            // ToDo: Add a warning for the developer if he tries to return the whole `globalRegistry` into the component.
            const registriesToPropsMap = mapRegistriesToProps ? mapRegistriesToProps(globalRegistry) : {};

            return (
                <WrappedComponent
                    neos={buildConfigurationAndGlobalRegistry(configuration, globalRegistry, routes)}
                    {...this.props}
                    {...registriesToPropsMap}
                    />
            );
        }
    };

    Decorator.WrappedComponent = WrappedComponent;
    return Decorator;
};
