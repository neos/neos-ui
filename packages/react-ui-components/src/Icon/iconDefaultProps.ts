import {IconProps} from './icon';
import {PickDefaultProps} from '../../types';

type DefaultProps = PickDefaultProps<IconProps, 'color' | 'padded' | 'size'>;

// extracted because of resulting in a circular dependency in jest
// internal - use `import {defaultProps} from "./icon"` instead
export const defaultProps: DefaultProps = {
    color: 'default',
    padded: 'none',
    size: 'sm'
};
