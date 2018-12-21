import SynchronousRegistry from './SynchronousRegistry';

export default class SynchronousMetaRegistry<T> extends SynchronousRegistry<T> {
    public set(key: string, value: any): any {
        if (value.SERIAL_VERSION_UID !== 'd8a5aa78-978e-11e6-ae22-56b6b6499611') {
            throw new Error('You can only add registries to a meta registry');
        }

        return super.set(key, value);
    }
}
