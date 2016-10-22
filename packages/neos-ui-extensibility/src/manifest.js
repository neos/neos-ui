import readFromConsumerApi from './readFromConsumerApi';

export const manifests = readFromConsumerApi('manifests', () => []);

export default function manifest(identifier, options, bootstrap) {
    manifests.push({
        [identifier]: {
            options,
            bootstrap
        }
    });
}
