import React from 'react';
import {defaultMemoize} from 'reselect';

// We need to memoize configuration and global registry; otherwise a new object is created at every render; leading to
// LOADS of unnecessary re-draws.
const buildConfigurationAndGlobalRegistry = defaultMemoize((configuration, globalRegistry, routes) => ({configuration, globalRegistry, routes}));

export const NeosContext = React.createContext(null);

export const neos = (mapRegistriesToProps) => (WrappedComponent) => {
    const Decorator = class NeosDecorator extends React.PureComponent {
        static Original = WrappedComponent;

        static contextType = NeosContext;

        static displayName = `Neos(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

        render() {
            return (
                <NeosContext.Consumer>
                    {context => {
                        if (!context) {
                            console.error('Context missing!', this.props);
                            return null;
                        }
                        const registriesToPropsMap = mapRegistriesToProps ? mapRegistriesToProps(context.globalRegistry) : {};
                        return (
                            <WrappedComponent
                                neos={buildConfigurationAndGlobalRegistry(context.configuration, context.globalRegistry, context.routes)}
                                {...this.props}
                                {...registriesToPropsMap}
                            />
                        );
                    }}
                </NeosContext.Consumer>
            );
        }
    };
    return Decorator;
};
