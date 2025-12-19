import backend from '@neos-project/neos-ui-backend-connector';
import {selectors} from '@neos-project/neos-ui-redux-store';

import {FileRepository} from '@ckeditor/ckeditor5-upload';
import {Plugin} from "@ckeditor/ckeditor5-core";

type AssetUploadResponse = {
    originalImageResourceUri: string;
    originalDimensions: {
        width: number;
        height: number;
        aspectRatio: number;
    };
    mediaType: string;
    previewImageResourceUri: string;
    previewDimensions: {
        width: number;
        height: number;
    }
    object: {
        __identity: string;
        __type: string;
    };
}

export class ImageUploadAdapter {
    loader;
    store;

    constructor(loader, store) {
        // The file loader instance to use during the upload.
        this.loader = loader;
        this.store = store;
    }

    // Starts the upload process.
    upload() {
        return this.loader.file
            .then(file => new Promise((resolve, reject) => {
                const {uploadAsset} = backend.get().endpoints;

                const state = this.store.getState();
                const siteNodePath = selectors.CR.Nodes.siteNodeContextPathSelector(state);
                const focusedNodePath = selectors.CR.Nodes.focusedNodePathSelector(state);
                const propertyName = 'text'; // This should be the property name where the image will be uploaded.

                return uploadAsset(
                    file,
                    propertyName,
                    focusedNodePath,
                    siteNodePath,
                    'Image'
                ).then((response: AssetUploadResponse) => {
                    resolve({
                        dataAssetId: response.object.__identity,
                        urls: {
                            default: response.originalImageResourceUri,
                        },
                    })
                }).catch((error) => {
                    reject();
                });
            }));
    }

    // Aborts the upload process.
    abort() {
        // TODO: Implement abort logic if necessary.
    }
}

export class ImageUploadAdapterPlugin extends Plugin {
    static get requires() {
        return [FileRepository];
    }

    static get pluginName() {
        return 'NeosImageUploadAdapter';
    }

    init() {
        const store = this.editor.neos.store;
        this.editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
            return new ImageUploadAdapter(loader, store);
        };
    }
}
