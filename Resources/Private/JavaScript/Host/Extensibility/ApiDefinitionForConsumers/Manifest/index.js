export const manifests = [];

export default function manifest(identifier, callback) {
    manifests.push(callback);
};
