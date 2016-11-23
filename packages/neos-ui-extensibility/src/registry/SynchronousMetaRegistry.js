import SynchronousRegistry from './SynchronousRegistry';

export default class SynchronousMetaRegistry extends SynchronousRegistry {
    add(key, value) {
        if (value.SERIAL_VERSION_UID !== 'd8a5aa78-978e-11e6-ae22-56b6b6499611') {
            throw new Error(`You can only add registries to a meta registry`);
        }

        return super.add(key, value);
    }
}
