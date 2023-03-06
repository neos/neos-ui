/**
 * Pick properties from Props to use in DefaultProps
 *
 * Instead of:
 *  Readonly<Required<Pick<Props, 'key1' | 'key2' | 'keyX'>>>
 *
 * Usage:
 *   type DefaultProps = PickDefaultProps<Props, 'key1' | 'key2' | 'keyX'>
 *   const defaultProps: DefaultProps = {
 *     key1: ...,
 *     key2: ...,
 *     keyX: ...,
 *   };
 */
export type PickDefaultProps<Props, defaultPropsKeys extends keyof Props>
    = Readonly<Required<Pick<Props, defaultPropsKeys>>>
