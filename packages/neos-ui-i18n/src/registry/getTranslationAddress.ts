/*
 * This file is part of the Neos.Neos.Ui package.
 *
 * (c) Contributors of the Neos Project - www.neos.io
 *
 * This package is Open Source Software. For the full copyright and license
 * information, please view the LICENSE file which was distributed with this
 * source code.
 */
export function getTranslationAddress(
    fullyQualifiedTransUnitId: string
): [string, string, string];
export function getTranslationAddress(
    transUnitId: string,
    packageKey: string,
    sourceName: string
): [string, string, string];
export function getTranslationAddress(
    id: string,
    packageKey?: string,
    sourceName?: string
) {
    if (id && id.indexOf(':') !== -1) {
        return id.split(':');
    }

    return [packageKey, sourceName, id];
}
