import {readFromConsumerApi} from './consumerApi';

export const manifests = readFromConsumerApi('manifests', () => []);

export default function manifest(identifier, callback) {
    manifests.push(callback);
}
