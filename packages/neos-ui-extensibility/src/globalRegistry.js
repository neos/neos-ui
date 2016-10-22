import {SynchronousMetaRegistry} from './registry';
import readFromConsumerApi from './readFromConsumerApi';

export default readFromConsumerApi('globalRegistry',
    () => new SynchronousMetaRegistry(`
        # A registry containing other registries that are added at runtime
    `)
);
