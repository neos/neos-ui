import {SynchronousRegistry} from './registry';

export const globalRegistry = new SynchronousRegistry(`
    # A registry to contain other registries to be added at runtime
`);

export default function register (name, registry) {
    globalRegistry.add(name, registry);
};
