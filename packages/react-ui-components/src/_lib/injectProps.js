import React from 'react';

//
// A higher order component to transfer dependencies or
// static props between the component files in a safe way for
// the test suite.
//
// Origin is that some components depend on each other, f.e.
// the `IconButton` imports the `Icon` and the `Button` component.
//
// Normally this would not be a problem, but we use css modules,
// and since the test suite should not care about this, we need
// a way to inject these in the `index.js` as well as the `*.spec.js`
// files in a declarative way.
//
// Users will not see any of this extra-work to be done, unless
// they want to access the component files itself and inject
// their own styles.
//
export default dependencies => WrappedComponent => {
    const ComponentWithDependencies = props => {
        return (
            <WrappedComponent
                {...dependencies}
                {...props}
                />
        );
    };
    ComponentWithDependencies.displayName = WrappedComponent.displayName || WrappedComponent.name;
    return ComponentWithDependencies;
};
