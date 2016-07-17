import {$get} from 'plow-js';
import {loadImageMetadata, createImageVariant, uploadAsset} from 'API/Endpoints/index';

export default ({getState}) => ({
    media: {
        asset: {
            upload(file) {
                if (!file) {
                    return Promise.reject('Received malformed file.');
                }

                const siteNodePath = $get('cr.nodes.siteNode', getState());
                const siteNodeName = siteNodePath.match(/\/sites\/([^/@]*)/)[1];

                return uploadAsset(file, siteNodeName);
            }
        },
        image: {
            loadMetaData(image) {
                if (!image || !image.__identity) {
                    return Promise.reject('Received malformed image.');
                }

                return loadImageMetadata(image.__identity);
            },

            createVariant(originalImageUuid, adjustments) {
                if (!originalImageUuid) {
                    return Promise.reject('Received malformed originalImageUuid.');
                }

                if (!adjustments) {
                    return Promise.reject('Received malformed adjustments.');
                }

                return createImageVariant(originalImageUuid, adjustments);
            }
        }
    }
});
