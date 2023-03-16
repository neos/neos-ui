import {
    InferableComponentEnhancerWithProps,
    HighOrderComponentProps
} from './decorator-type-helpers';
import {GlobalRegistry} from '@neos-project/neos-ts-interfaces';

export interface NeosContextInterface {
    globalRegistry: GlobalRegistry;
    configuration: {};
    routes: {};
}

/**
 * Infers the type of props that a neosifier will inject into a component.
 *
 * @example
 *  const neosifier = neos((globalRegistry: GlobalRegistry) => ({
 *      i18nRegistry: globalRegistry.get('i18n')
 *  }));
 *  type NeosProps = NeosifiedProps<typeof neosifier>;
 *
 *  const MyPlainComponent = (props: NeosProps & OwnProps) => "huhu";
 *
 *  export const MyComponent = neosifier(MyPlainComponent);
 *
 */
export type NeosifiedProps<TNeosifier> = HighOrderComponentProps<TNeosifier>;

export const NeosContext: React.Context<NeosContextInterface | null>;

type MapRegistryToPropsParam<TStateProps> = (
    globalRegistry: GlobalRegistry
) => TStateProps;

interface Neos {
    <TStateProps = {}, TOwnProps = {}>(
        mapRegistryToProps: MapRegistryToPropsParam<TStateProps>
    ): InferableComponentEnhancerWithProps<
        TStateProps & { neos: NeosContextInterface },
        TOwnProps
    >;
}

/**
 * Creates an higher order component to easily spread global configuration
 * {@link NeosifiedProps}
 */
export const neos: Neos;
