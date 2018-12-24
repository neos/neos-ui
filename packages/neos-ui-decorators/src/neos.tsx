import React from 'react';
import {defaultMemoize} from 'reselect';
import {GlobalRegistry} from '@neos-project/neos-ts-interfaces';

// We need to memoize configuration and global registry; otherwise a new object is created at every render; leading to
// LOADS of unnecessary re-draws.
const buildConfigurationAndGlobalRegistry = defaultMemoize((configuration: {}, globalRegistry: GlobalRegistry, routes: {}) => ({configuration, globalRegistry, routes}));

export interface NeosContextInterface {
    globalRegistry: GlobalRegistry;
    configuration: {};
    routes: {};
}

export type NeosInjectedProps<R extends (...args: any[]) => any> = ReturnType<R> & {neos: NeosContextInterface};

export const NeosContext = React.createContext<NeosContextInterface | null>(null);

//
// A higher order component to easily spread global
// configuration
export default <OwnProps extends {}, InjectedProps extends {}> (mapRegistriesToProps: (globalRegistry: GlobalRegistry) => any) => (WrappedComponent: React.ComponentType<OwnProps & InjectedProps>) => {
    const Decorator = class NeosDecorator extends React.PureComponent<OwnProps> {

        public static readonly Original = WrappedComponent;

        public static readonly contextType = NeosContext;

        public static readonly displayName = `Neos(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

        public render(): JSX.Element {
            return (
                <NeosContext.Consumer>
                    {context => {
                        if (!context) {
                            console.error('Context missing! Are you using `unstable_renderSubtreeIntoContainer` by any chance?', this.props); // tslint:disable-line
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
