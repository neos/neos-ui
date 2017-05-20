import React, {PureComponent, PropTypes} from 'react';
import {defaultMemoize} from 'reselect';

// We need to memoize configuration and global registry; otherwise a new object is created at every render; leading to
// LOADS of unnecessary re-draws.
const buildConfigurationAndGlobalRegistry = defaultMemoize((configuration, globalRegistry) => ({configuration, globalRegistry}));

//
// A higher order component to easily spread global
// configuration
//
export default mapRegistriesToProps => WrappedComponent => {
    return class NeosDecorator extends PureComponent {
        static Original = WrappedComponent;

        static contextTypes = {
            globalRegistry: PropTypes.object.isRequired,
            configuration: PropTypes.object.isRequired
        };

        static displayName = `Neos(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

        render() {
            const {configuration, globalRegistry} = this.context;
            const registriesToPropsMap = mapRegistriesToProps ? mapRegistriesToProps(globalRegistry, this.props) : {};

            return (
                <WrappedComponent
                    neos={buildConfigurationAndGlobalRegistry(configuration, globalRegistry)}
                    {...this.props}
                    {...registriesToPropsMap}
                    />
            );
        }
    };
};
