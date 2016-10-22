import readFromConsumerApi from './readFromConsumerApi';

export const manifests = readFromConsumerApi('manifests', () => []);

export default function manifest(identifier, callback) {
    manifests.push(callback);
}
