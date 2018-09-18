// Type definitions for React component's defaultProps
// TypeScript Version: 3.0.3

/**
 * Pick properties from Props to use in DefaultProps
 * The idea is similar to Pick from react:
 *   type SingleProps = Pick<Props, 'propertyKey'>
 * only with multiple propertyKeys.
 *   type MultipleProps = PickMultiple<Props, 'propKey1', 'propKey2' ...>
 * Sadly, as far as I know, this is not possible right now.
 *
 * There is a proposal for the variadic generics notation: https://github.com/Microsoft/TypeScript/issues/5453
 *
 * Usage:
 *   type DefaultProps = PickDefaultProps<Props, 'key1' | 'key2' | 'keyX'>
 *   const defaultProps: DefaultProps = {
 *     key1: ...,
 *     key2: ...,
 *     keyX: ...,
 *   };
 */
export type PickDefaultProps<Props, defaultPropsKeys extends keyof Props> = Readonly<Required<{
    [P in defaultPropsKeys]: Props[P]
}>>;


export type Diff<T, U> = T extends U ? never : T;

export type Omit<T, K extends keyof T> = Pick<T, Diff<keyof T, K>>;
