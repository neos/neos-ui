import {getElementInnerText, getElementAttributeValue, getContextString} from './Helpers';
import {urlWithParams, encodeAsQueryString} from '@neos-project/utils-helpers/src/urlWithParams';

import fetchWithErrorHandling from '../FetchWithErrorHandling/index';
import {Change, NodeContextPath, WorkspaceName, DimensionCombination, DimensionPresetCombination, DimensionName} from '@neos-project/neos-ts-interfaces';

export interface Routes {
    ui: {
        service: {
            change: string;
            publish: string;
            discard: string;
            changeBaseWorkspace: string;
            copyNodes: string;
            cutNodes: string;
            clearClipboard: string;
            loadTree: string;
            flowQuery: string;
            getWorkspaceInfo: string;
            getAdditionalNodeMetadata: string;
        };
    };
    core: {
        content: {
            imageWithMetadata: string;
            createImageVariant: string;
            loadMasterPlugins: string;
            loadPluginViews: string;
            uploadAsset: string;
        };
        service: {
            assetProxies: string;
            assets: string;
            nodes: string;
            userPreferences: string;
            dataSource: string;
            contentDimensions: string;
        };
        modules: {
            workspaces: string;
            userSettings: string;
            mediaBrowser: string;
        };
        login: string;
        logout: string;
    };
}

export default (routes: Routes) => {
    const change = (changes: Change[]) => fetchWithErrorHandling.withCsrfToken(csrfToken => ({
        url: routes.ui.service.change,

        method: 'POST',
        credentials: 'include',
        headers: {
            'X-Flow-Csrftoken': csrfToken,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            changes
        })
    })).then(response => fetchWithErrorHandling.parseJson(response))
    .catch(reason => fetchWithErrorHandling.generalErrorHandler(reason));

    const publish = (nodeContextPaths: NodeContextPath[], targetWorkspaceName: WorkspaceName) => fetchWithErrorHandling.withCsrfToken(csrfToken => ({
        url: routes.ui.service.publish,
        method: 'POST',
        credentials: 'include',
        headers: {
            'X-Flow-Csrftoken': csrfToken,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            nodeContextPaths,
            targetWorkspaceName
        })
    })).then(response => fetchWithErrorHandling.parseJson(response))
    .catch(reason => fetchWithErrorHandling.generalErrorHandler(reason));

    const discard = (nodeContextPaths: NodeContextPath[]) => fetchWithErrorHandling.withCsrfToken(csrfToken => ({
        url: routes.ui.service.discard,

        method: 'POST',
        credentials: 'include',
        headers: {
            'X-Flow-Csrftoken': csrfToken,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            nodeContextPaths
        })
    })).then(response => fetchWithErrorHandling.parseJson(response))
    .catch(reason => fetchWithErrorHandling.generalErrorHandler(reason));

    const changeBaseWorkspace = (targetWorkspaceName: WorkspaceName, documentNode: NodeContextPath) => fetchWithErrorHandling.withCsrfToken(csrfToken => ({
        url: routes.ui.service.changeBaseWorkspace,

        method: 'POST',
        credentials: 'include',
        headers: {
            'X-Flow-Csrftoken': csrfToken,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            targetWorkspaceName,
            documentNode
        })
    })).then(response => fetchWithErrorHandling.parseJson(response))
    .catch(reason => fetchWithErrorHandling.generalErrorHandler(reason));

    const copyNodes = (nodes: NodeContextPath[]) => fetchWithErrorHandling.withCsrfToken(csrfToken => ({
        url: routes.ui.service.copyNodes,

        method: 'POST',
        credentials: 'include',
        headers: {
            'X-Flow-Csrftoken': csrfToken,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            nodes
        })
    })).then(response => fetchWithErrorHandling.parseJson(response))
    .catch(reason => fetchWithErrorHandling.generalErrorHandler(reason));

    const cutNodes = (nodes: NodeContextPath[]) => fetchWithErrorHandling.withCsrfToken(csrfToken => ({
        url: routes.ui.service.cutNodes,

        method: 'POST',
        credentials: 'include',
        headers: {
            'X-Flow-Csrftoken': csrfToken,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            nodes
        })
    })).then(response => fetchWithErrorHandling.parseJson(response))
    .catch(reason => fetchWithErrorHandling.generalErrorHandler(reason));

    const clearClipboard = () => fetchWithErrorHandling.withCsrfToken(csrfToken => ({
        url: routes.ui.service.clearClipboard,

        method: 'POST',
        credentials: 'include',
        headers: {
            'X-Flow-Csrftoken': csrfToken,
            'Content-Type': 'application/json'
        }
    })).then(response => fetchWithErrorHandling.parseJson(response))
    .catch(reason => fetchWithErrorHandling.generalErrorHandler(reason));

    const loadImageMetadata = (imageVariantUuid: string) => fetchWithErrorHandling.withCsrfToken(() => ({
        url: `${routes.core.content.imageWithMetadata}?image=${imageVariantUuid}`,

        method: 'GET',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        }
    })).then(response => fetchWithErrorHandling.parseJson(response))
    .catch(reason => fetchWithErrorHandling.generalErrorHandler(reason));

    /**
     * asset[adjustments][Neos\Media\Domain\Model\Adjustment\CropImageAdjustment][height]:85
     * asset[adjustments][Neos\Media\Domain\Model\Adjustment\CropImageAdjustment][position]:10
     * asset[adjustments][Neos\Media\Domain\Model\Adjustment\CropImageAdjustment][width]:210
     * asset[adjustments][Neos\Media\Domain\Model\Adjustment\CropImageAdjustment][x]:0
     * asset[adjustments][Neos\Media\Domain\Model\Adjustment\CropImageAdjustment][y]:0
     * asset[originalAsset]:56d183f2-ee66-c845-7e2d-40661fb27571
     */
    const createImageVariant = (originalAssetUuid: string, adjustments: {[propName: string]: any}) => fetchWithErrorHandling.withCsrfToken(csrfToken => ({
        url: routes.core.content.createImageVariant,

        method: 'POST',
        credentials: 'include',
        headers: {
            'X-Flow-Csrftoken': csrfToken,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            asset: {
                originalAsset: originalAssetUuid,
                adjustments
            }
        })
    })).then(response => fetchWithErrorHandling.parseJson(response))
    .catch(reason => fetchWithErrorHandling.generalErrorHandler(reason));

    const loadMasterPlugins = (workspaceName: WorkspaceName, dimensions: DimensionCombination) => fetchWithErrorHandling.withCsrfToken(() => ({
        url: urlWithParams(routes.core.content.loadMasterPlugins, {workspaceName, dimensions}),
        method: 'GET',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        }
    })).then(response => fetchWithErrorHandling.parseJson(response))
    .catch(reason => fetchWithErrorHandling.generalErrorHandler(reason));

    const loadPluginViews = (identifier: string, workspaceName: WorkspaceName, dimensions: DimensionCombination) => fetchWithErrorHandling.withCsrfToken(() => ({
        url: urlWithParams(routes.core.content.loadPluginViews, {identifier, workspaceName, dimensions}),
        method: 'GET',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        }
    })).then(response => fetchWithErrorHandling.parseJson(response))
    .catch(reason => fetchWithErrorHandling.generalErrorHandler(reason));

    const contentDimensions = (dimensionName: DimensionName, chosenDimensionPresets: DimensionPresetCombination) => fetchWithErrorHandling.withCsrfToken(() => ({
        url: urlWithParams(`${routes.core.service.contentDimensions}/${dimensionName}.json`, {chosenDimensionPresets}),
        method: 'GET',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        }
    })).then(response => fetchWithErrorHandling.parseJson(response))
    .catch(reason => fetchWithErrorHandling.generalErrorHandler(reason));

    const uploadAsset = (file: File, propertyName: string, node: NodeContextPath, siteNodeName: string, metadata = 'Image') => fetchWithErrorHandling.withCsrfToken(csrfToken => {
        const data = new FormData();
        data.append('__siteNodeName', siteNodeName);
        data.append('asset[resource]', file);
        data.append('metadata', metadata);
        data.append('propertyName', propertyName);
        data.append('node', node);

        return {
            url: routes.core.content.uploadAsset,

            method: 'POST',
            credentials: 'include',
            headers: {
                'X-Flow-Csrftoken': csrfToken
            },
            body: data
        };
    }).then(response => fetchWithErrorHandling.parseJson(response))
    .catch(reason => fetchWithErrorHandling.generalErrorHandler(reason));

    const assetProxyImport = (identifier: string) => fetchWithErrorHandling.withCsrfToken(csrfToken => ({
        url: `${routes.core.service.assetProxies}/${identifier.substr(0, identifier.indexOf('/'))}/${identifier.substr(identifier.indexOf('/') + 1)}`,
        method: 'POST',
        credentials: 'include',
        headers: {
            'X-Flow-Csrftoken': csrfToken
        },
        body: ''
    }))
        .then(result => result.text())
        .then(result => {
            const assetProxyTable = document.createElement('table');
            assetProxyTable.innerHTML = result;
            const assetProxy = assetProxyTable.querySelector('.asset-proxy') as HTMLElement;
            if (!assetProxy) {
                throw new Error('No ".asset-proxy" element found in result.');
            }
            return getElementInnerText(assetProxy, '.local-asset-identifier');
        });

    const assetProxySearch = (searchTerm: string, assetSourceIdentifier: string, options: {assetsToExclude: string[], constraints: any} = {assetsToExclude: [], constraints: {}}) => fetchWithErrorHandling.withCsrfToken(() => {
        const constraints = options.constraints || {};
        if (assetSourceIdentifier && !constraints.assetSources) {
            constraints.assetSources = [assetSourceIdentifier];
        }
        return {
            url: urlWithParams(routes.core.service.assetProxies, {searchTerm, constraints}),
            method: 'GET',
            credentials: 'include'
        };
    })
        .then(result => result.text())
        .then(result => {
            const assetProxyTable = document.createElement('table');
            assetProxyTable.innerHTML = result;
            const assetProxies = Array.from(assetProxyTable.querySelectorAll('.asset-proxy')) as HTMLElement[];


            const mappedAssetProxies = assetProxies.map((assetProxy: HTMLElement) => {
                const assetSourceIdentifier = getElementInnerText(assetProxy, '.asset-source-identifier');
                const assetSourceLabel = getElementInnerText(assetProxy, '.asset-source-label');
                const assetProxyIdentifier = getElementInnerText(assetProxy, '.asset-proxy-identifier');
                return {
                    dataType: 'Neos.Media:Asset',
                    loaderUri: 'assetProxy://' + assetSourceIdentifier + '/' + assetProxyIdentifier,
                    label: getElementInnerText(assetProxy, '.asset-proxy-label'),
                    preview: getElementAttributeValue(assetProxy, '[rel=thumbnail]', 'href'),
                    identifier: getElementInnerText(assetProxy, '.local-asset-identifier') || (assetSourceIdentifier + '/' + assetProxyIdentifier),
                    assetSourceIdentifier,
                    assetSourceLabel,
                    assetProxyIdentifier
                };
            });
            return mappedAssetProxies.filter((assetProxy: {identifier?: string}) => assetProxy.identifier && options.assetsToExclude.indexOf(assetProxy.identifier) === -1);
        });

    const assetProxyDetail = (assetSourceIdentifier: string, assetProxyIdentifier: string) => fetchWithErrorHandling.withCsrfToken(() => ({
        url: `${routes.core.service.assetProxies}/${assetSourceIdentifier}/${assetProxyIdentifier}`,

        method: 'GET',
        credentials: 'include'
    }))
        .then(result => result.text())
        .then(result => {
            const assetProxyTable = document.createElement('table');
            assetProxyTable.innerHTML = result;

            const assetProxy = assetProxyTable.querySelector('.asset-proxy') as HTMLElement;
            if (!assetProxy) {
                throw new Error('An ".asset-proxy" element was not in the results');
            }

            const assetSourceIdentifier = getElementInnerText(assetProxy, '.asset-source-identifier');
            const assetProxyIdentifier = getElementInnerText(assetProxy, '.asset-proxy-identifier');

            return {
                dataType: 'Neos.Media:Asset',
                loaderUri: 'assetProxy://' + assetSourceIdentifier + '/' + assetProxyIdentifier,
                label: getElementInnerText(assetProxy, '.asset-proxy-label'),
                preview: getElementAttributeValue(assetProxy, '[rel=thumbnail]', 'href'),
                identifier: getElementInnerText(assetProxy, '.local-asset-identifier'),
                localAssetIdentifier: getElementInnerText(assetProxy, '.local-asset-identifier'),
                assetSourceIdentifier,
                assetSourceLabel: getElementInnerText(assetProxy, '.asset-source-label'),
                assetProxyIdentifier
            };
        });

    const assetSearch = (searchTerm = '') => fetchWithErrorHandling.withCsrfToken(() => ({
        url: urlWithParams(routes.core.service.assets, {searchTerm}),

        method: 'GET',
        credentials: 'include'
    }))
        .then(result => result.text())
        .then(result => {
            const d = document.createElement('div');
            d.innerHTML = result;
            const assetRoot = d.querySelector('.assets');
            if (!assetRoot) {
                throw new Error('Asset search failed, .assets missing in results');
            }

            const assets = Array.from(assetRoot.querySelectorAll('.asset')) as HTMLElement[];

            return assets.map(asset => {
                const assetIdentifierElement = asset.querySelector('.asset-identifier') as HTMLElement;
                if (!assetIdentifierElement) {
                    throw new Error('.asset-identifier not found in the asset search result');
                }
                const assetLabelElement = asset.querySelector('.asset-label') as HTMLElement;
                if (!assetLabelElement) {
                    throw new Error('.asset-label not found in the asset search result');
                }
                const previewElement = asset.querySelector('[rel=thumbnail]') as HTMLElement;
                if (!previewElement) {
                    throw new Error('[rel=thumbnail] not found in the asset search result');
                }

                return ({
                    dataType: 'Neos.Media:Asset',
                    loaderUri: 'asset://' + assetIdentifierElement.innerText,
                    label: assetLabelElement.innerText,
                    preview: previewElement.getAttribute('href'),
                    identifier: assetIdentifierElement.innerText
                });
            });
        });

    const assetDetail = (identifier: string) => fetchWithErrorHandling.withCsrfToken(() => ({
        url: `${routes.core.service.assets}/${identifier}`,

        method: 'GET',
        credentials: 'include'
    }))
        .then(result => result.text())
        .then(result => {
            const d = document.createElement('div');
            d.innerHTML = result;
            const asset = d.querySelector('.asset');
            if (!asset) {
                throw new Error('.asset not found in the asset lookup result');
            }
            const assetIdentifierElement = asset.querySelector('.asset-identifier') as HTMLElement;
            if (!assetIdentifierElement) {
                throw new Error('.asset-identifier not found in the asset lookup result');
            }
            const assetLabelElement = asset.querySelector('.asset-label') as HTMLElement;
            if (!assetLabelElement) {
                throw new Error('.asset-label not found in the asset lookup result');
            }
            const previewElement = asset.querySelector('[rel=preview]') as HTMLElement;
            if (!previewElement) {
                throw new Error('[rel=preview] not found in the asset lookup result');
            }

            return ({
                dataType: 'Neos.Media:Asset',
                loaderUri: 'asset://' + assetIdentifierElement.innerText,
                label: assetLabelElement.innerText,
                preview: previewElement.getAttribute('href'),
                identifier: assetIdentifierElement.innerText
            });
        });

    /**
     * searchTerm:se
     * nodeTypes[]:TYPO3.Neos.NodeTypes:Page
     * workspaceName:user-admin
     * dimensions[language][]:en_US
     * contextNode:/sites/neosdemo@user-admin;language=en_US
     *
     * !! for options, use selectors.UI.NodeLinking.contextForNodeLinking and start modifying it!
     *
     * returns an array of {label, value} objects
     */
    const searchNodes = (options: {}) => fetchWithErrorHandling.withCsrfToken(() => ({
        url: urlWithParams(routes.core.service.nodes, options),

        method: 'GET',
        credentials: 'include'
    }))
        .then(result => result.text())
        .then(result => {
            const d = document.createElement('div');
            d.innerHTML = result;
            const nodes = Array.from(d.querySelectorAll('.nodes .node'));

            return nodes.map(node => {
                const uriElement = node.querySelector('.node-frontend-uri') as HTMLElement | null;
                if (!uriElement) {
                    throw new Error('.node-frontend-uri not found in result');
                }
                const nodeIdentifier = node.querySelector('.node-identifier') as HTMLElement | null;
                if (!nodeIdentifier) {
                    throw new Error('.node-identifier not found in result');
                }
                const nodeLabel = node.querySelector('.node-label') as HTMLElement | null;
                if (!nodeLabel) {
                    throw new Error('.node-label not found in result');
                }
                const nodeType = node.querySelector('.node-type') as HTMLElement | null;
                if (!nodeType) {
                    throw new Error('.node-type not found in result');
                }
                return {
                    dataType: 'Neos.ContentRepository:Node',
                    loaderUri: 'node://' + nodeIdentifier.innerText,
                    label: nodeLabel.innerText,
                    identifier: nodeIdentifier.innerText,
                    nodeType: nodeType.innerText,
                    uri: uriElement.getAttribute('href'),
                    breadcrumb: uriElement.innerText.trim()
                };
            });
        })
        .catch(reason => fetchWithErrorHandling.generalErrorHandler(reason));

    const parseGetSingleNodeResult = (requestPromise: Promise<any>) => {
        return requestPromise.then(result =>
            result.text().then((bodyAsString: string) => ({bodyAsString, result}))
        ).then(({bodyAsString, result}: {bodyAsString: string, result: any}) => {
            if (result.status === 200) {
                const d = document.createElement('div');
                d.innerHTML = bodyAsString;
                const nodeFrontendUriElement = d.querySelector('.node-frontend-uri');
                if (!nodeFrontendUriElement) {
                    throw new Error('.node-frontend-uri is not found in the result');
                }
                const nodeFrontendUri = nodeFrontendUriElement.getAttribute('href');
                if (typeof nodeFrontendUri !== 'string') {
                    throw new Error('.node-frontend-uri does not contain a valid href attribut');
                }

                const nodePath = d.querySelector('.node-path');
                if (!nodePath) {
                    throw new Error('.node-path is not found in the result');
                }

                // Hackish way to get context string from uri
                const contextString = getContextString(nodeFrontendUri);
                // TODO: Temporary hack due to missing contextPath in the API response
                const nodeContextPath = `${nodePath.innerHTML}@${contextString}`;

                return {
                    nodeFound: true,
                    nodeFrontendUri,
                    nodeContextPath
                };
            }
            if (result.status === 404) {
                const nodeExistsInOtherDimensions = Boolean(result.headers.get('X-Neos-Node-Exists-In-Other-Dimensions'));
                const numberOfNodesMissingOnRootline = parseInt(result.headers.get('X-Neos-Nodes-Missing-On-Rootline'), 10) - 1;
                return {
                    nodeFound: false,
                    nodeExistsInOtherDimensions,
                    numberOfNodesMissingOnRootline
                };
            }

            if (result.status === 403) {
                throw new Error('You are not authorized to perform this action.');
            }

            throw new Error('Unexpected return code when trying to get the node data');
        });
    };

    /**
     * "params" is an object with:
     * - dimensions
     * - workspaceName
     *
     * !! for params, use selectors.UI.NodeLinking.contextForNodeLinking and start modifying it!
     */
    const getSingleNode = (nodeIdentifier: string, params = {}) => parseGetSingleNodeResult(fetchWithErrorHandling.withCsrfToken(() => ({
        url: urlWithParams(`${routes.core.service.nodes}/${nodeIdentifier}`, params),

        method: 'GET',
        credentials: 'include'
    }))).catch(reason => fetchWithErrorHandling.generalErrorHandler(reason));

    const adoptNodeToOtherDimension = (
        {identifier, targetDimensions, sourceDimensions, workspaceName, copyContent = false}:
        {identifier: string, targetDimensions: DimensionCombination, sourceDimensions: DimensionCombination, workspaceName: WorkspaceName, copyContent: boolean}
    ) => parseGetSingleNodeResult(fetchWithErrorHandling.withCsrfToken(csrfToken => ({
        url: routes.core.service.nodes,

        method: 'POST',
        credentials: 'include',
        body: encodeAsQueryString({
            identifier,
            dimensions: targetDimensions,
            sourceDimensions,
            workspaceName,
            mode: (copyContent ? 'adoptFromAnotherDimensionAndCopyContent' : 'adoptFromAnotherDimension'),
            __csrfToken: csrfToken
        })
    }))).catch(reason => fetchWithErrorHandling.generalErrorHandler(reason));

    const setUserPreferences = (key: string, value: any) => fetchWithErrorHandling.withCsrfToken(csrfToken => {
        const data = new URLSearchParams();
        data.set('__csrfToken', csrfToken);
        data.set('key', key);
        data.set('value', value);

        return {
            url: routes.core.service.userPreferences,

            method: 'PUT',
            credentials: 'include',
            body: data
        };
    }).catch(reason => fetchWithErrorHandling.generalErrorHandler(reason));

    const getWorkspaceInfo = () => fetchWithErrorHandling.withCsrfToken(() => ({
        url: routes.ui.service.getWorkspaceInfo,
        method: 'GET',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        }
    })).then(response => fetchWithErrorHandling.parseJson(response));

    const getAdditionalNodeMetadata = (nodeContextPaths: NodeContextPath) => fetchWithErrorHandling.withCsrfToken(csrfToken => {
        return {
            url: routes.ui.service.getAdditionalNodeMetadata,
            method: 'POST',
            credentials: 'include',
            body: JSON.stringify({nodes: nodeContextPaths}),
            headers: {
                'X-Flow-Csrftoken': csrfToken,
                'Content-Type': 'application/json'
            }
        };
    }).then(response => fetchWithErrorHandling.parseJson(response))
    .catch(reason => console.warn('Something went wrong with requesting additional node metadata:', reason)); // tslint:disable-line no-console

    const dataSource = (dataSourceIdentifier: string, dataSourceUri: string, params = {}) => fetchWithErrorHandling.withCsrfToken(() => ({
        url: urlWithParams(dataSourceUri || `${routes.core.service.dataSource}/${dataSourceIdentifier}`, params),

        method: 'GET',
        credentials: 'include'
    })).then(response => fetchWithErrorHandling.parseJson(response))
    .catch(reason => fetchWithErrorHandling.generalErrorHandler(reason));

    const getJsonResource = (resourceUri: string) => fetchWithErrorHandling.withCsrfToken(() => ({
        url: resourceUri,
        method: 'GET',
        credentials: 'include'
    })).then(response => fetchWithErrorHandling.parseJson(response))
    .catch(reason => fetchWithErrorHandling.generalErrorHandler(reason));

    const tryLogin = (username: string, password: string) => {
        const data = new URLSearchParams();
        data.set('__authentication[Neos][Flow][Security][Authentication][Token][UsernamePassword][username]', username);
        data.set('__authentication[Neos][Flow][Security][Authentication][Token][UsernamePassword][password]', password);
        // Here, we
        return fetch(routes.core.login, {
            method: 'POST',
            body: data,
            credentials: 'same-origin'
        })
        // Parse the JSON if possible ...
        .then(response => fetchWithErrorHandling.parseJson(response))
        // ... and if the JSON cannot be parsed, convert this to "false".
        .then(result => result, () => false)
        // Return the new CSRF Protection token
        .then(result => result && result.csrfToken);
    };

    return {
        loadImageMetadata,
        change,
        publish,
        discard,
        changeBaseWorkspace,
        copyNodes,
        cutNodes,
        clearClipboard,
        createImageVariant,
        loadMasterPlugins,
        loadPluginViews,
        uploadAsset,
        assetProxyImport,
        assetProxySearch,
        assetProxyDetail,
        assetSearch,
        assetDetail,
        searchNodes,
        getSingleNode,
        adoptNodeToOtherDimension,
        setUserPreferences,
        dataSource,
        getJsonResource,
        getWorkspaceInfo,
        getAdditionalNodeMetadata,
        tryLogin,
        contentDimensions
    };
};
