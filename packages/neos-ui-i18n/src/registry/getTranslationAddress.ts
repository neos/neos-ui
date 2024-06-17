/*
 * This file is part of the Neos.Neos.Ui package.
 *
 * (c) Contributors of the Neos Project - www.neos.io
 *
 * This package is Open Source Software. For the full copyright and license
 * information, please view the LICENSE file which was distributed with this
 * source code.
 */
import {TranslationAddress} from './TranslationAddress';

export function getTranslationAddress(
    fullyQualifiedTransUnitId: string
): TranslationAddress;
export function getTranslationAddress(
    transUnitId: string,
    packageKey: string,
    sourceName: string
): TranslationAddress;
export function getTranslationAddress(
    id: string,
    packageKey?: string,
    sourceName?: string
) {
    if (id && id.indexOf(':') !== -1) {
        return TranslationAddress.fromString(id);
    }

    if (packageKey === undefined) {
        throw new Error(`${id} is not a fully qualified trans-unit id. A package key must be provided.`);
    }

    if (sourceName === undefined) {
        throw new Error(`${id} is not a fully qualified trans-unit id. A source name must be provided.`);
    }

    return TranslationAddress.create({packageKey, sourceName, id});
}
