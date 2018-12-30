import createConsumerApi from './createConsumerApi';
import readFromConsumerApi from './readFromConsumerApi';
import {
    SynchronousRegistry,
    SynchronousMetaRegistry
} from './registry/index';

export default readFromConsumerApi('manifest');

export {
    createConsumerApi,
    SynchronousRegistry,
    SynchronousMetaRegistry
};
