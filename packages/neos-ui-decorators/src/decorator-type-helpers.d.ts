// Type definitions extracted from react-redux 7.1
// https://github.com/DefinitelyTyped/DefinitelyTyped/blob/59c89cc048de1e795eb3c88108fcb982ee4674ae/types/react-redux/index.d.ts
// bundled via rollup https://github.com/Swatinem/rollup-plugin-dts/tree/master to extract only the { ConnectedProps, InferableComponentEnhancerWithProps }

import {JSXElementConstructor, ComponentClass, ClassAttributes, NamedExoticComponent} from 'react';
import {NonReactStatics} from 'hoist-non-react-statics';

type DistributiveOmit<T, K extends keyof T> = T extends
unknown ? Omit<T, K> : never;

/**
 * A property P will be present if:
 * - it is present in DecorationTargetProps
 *
 * Its value will be dependent on the following conditions
 * - if property P is present in InjectedProps and its definition extends the definition
 *   in DecorationTargetProps, then its definition will be that of DecorationTargetProps[P]
 * - if property P is not present in InjectedProps then its definition will be that of
 *   DecorationTargetProps[P]
 * - if property P is present in InjectedProps but does not extend the
 *   DecorationTargetProps[P] definition, its definition will be that of InjectedProps[P]
 */
type Matching<InjectedProps, DecorationTargetProps> = {
    [P in keyof DecorationTargetProps]: P extends keyof InjectedProps
        ? InjectedProps[P] extends DecorationTargetProps[P]
            ? DecorationTargetProps[P]
            : InjectedProps[P]
        : DecorationTargetProps[P];
};

/**
 * a property P will be present if :
 * - it is present in both DecorationTargetProps and InjectedProps
 * - InjectedProps[P] can satisfy DecorationTargetProps[P]
 * ie: decorated component can accept more types than decorator is injecting
 *
 * For decoration, inject props or ownProps are all optionally
 * required by the decorated (right hand side) component.
 * But any property required by the decorated component must be satisfied by the injected property.
 */
type Shared<
    InjectedProps,
    DecorationTargetProps
    > = {
        [P in Extract<keyof InjectedProps, keyof DecorationTargetProps>]?: InjectedProps[P] extends DecorationTargetProps[P] ? DecorationTargetProps[P] : never;
    };

// Infers prop type from component C
type GetProps<C> = C extends JSXElementConstructor<infer P>
    ? C extends ComponentClass<P> ? ClassAttributes<InstanceType<C>> & P : P
    : never;

// Applies LibraryManagedAttributes (proper handling of defaultProps
// and propTypes).
type GetLibraryManagedProps<C> = JSX.LibraryManagedAttributes<C, GetProps<C>>;

// Defines WrappedComponent and derives non-react statics.
type ConnectedComponent<
    C extends JSXElementConstructor<any>,
    P
> = NamedExoticComponent<P> & NonReactStatics<C> & {
    WrappedComponent: C;
};

// Injects props and removes them from the prop requirements.
// Will not pass through the injected props if they are passed in during
// render. Also adds new prop requirements from TNeedsProps.
// Uses distributive omit to preserve discriminated unions part of original prop type
type InferableComponentEnhancerWithProps<TInjectedProps, TNeedsProps> =
    <C extends JSXElementConstructor<Matching<TInjectedProps, GetProps<C>>>>(
        component: C
    ) => ConnectedComponent<C, DistributiveOmit<GetLibraryManagedProps<C>, keyof Shared<TInjectedProps, GetLibraryManagedProps<C>>> & TNeedsProps>;

// Injects props and removes them from the prop requirements.
// Will not pass through the injected props if they are passed in during
// render.
type InferableComponentEnhancer<TInjectedProps> =
    InferableComponentEnhancerWithProps<TInjectedProps, {}>;

/**
 * Infers the type of props that a connector will inject into a component.
 */
type ConnectedProps<TConnector> =
    TConnector extends InferableComponentEnhancerWithProps<infer TInjectedProps, any>
        ? unknown extends TInjectedProps
            ? TConnector extends InferableComponentEnhancer<infer TInjectedProps>
                ? TInjectedProps
                : never
            : TInjectedProps
        : never;

export {ConnectedProps as HighOrderComponentProps, InferableComponentEnhancerWithProps};
