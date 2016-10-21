import SynchronousRegistry from './SynchronousRegistry';

export default class SynchronousMetaRegistry extends SynchronousRegistry {
    add(key, value) {
        if (value.SERIAL_VERSION_UID !== 'd8a5aa78-978e-11e6-ae22-56b6b6499611') {
            throw new `You can only add registries to a meta registry`;
        }

        super.add(key, value);
    }
}
