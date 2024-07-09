
export const isResourceProtocol = (value: string): boolean => {
    return value.startsWith('resource://');
}

export const getRedirectForPublicPackageResourceUriByPath = (resourcePath: string): string => {
    // todo make route dynamic
    return '/neos/ui-services/redirect-resource-uri?resourcePath=' + encodeURIComponent(resourcePath);
};

/**
 * Handles legacy syntax not including the "Public" segment and appends it.
 *
 * see https://github.com/neos/neos-ui/issues/2092#issuecomment-1606055787
 */
export const normaliseLegacyResourcePath = (possiblyMalformedResourcePath: string): string => {
    const regex = /^resource:\/\/([^\\/]+)\/(.*)/;

    const matches = possiblyMalformedResourcePath?.match(regex);

    if (!matches) {
        return possiblyMalformedResourcePath;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_, packageName, rawPath] = matches;

    let publicPath = rawPath;
    if (!rawPath.startsWith('Public/')) {
        publicPath = `Public/${rawPath}`;
    }

    return `resource://${packageName}/${publicPath}`;
}
