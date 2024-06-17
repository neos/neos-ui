/*
 * This file is part of the Neos.Neos.Ui package.
 *
 * (c) Contributors of the Neos Project - www.neos.io
 *
 * This package is Open Source Software. For the full copyright and license
 * information, please view the LICENSE file which was distributed with this
 * source code.
 */
import type {TranslationUnitDTO} from './TranslationUnit';

export const getPluralForm = (translation: TranslationUnitDTO, quantity = 0): string => {
    const translationHasPlurals = translation instanceof Object;

    // no defined quantity or less than one returns singular
    if (translationHasPlurals && (!quantity || quantity <= 1)) {
        return translation[0];
    }

    if (translationHasPlurals && quantity > 1) {
        return translation[1] ? translation[1] : translation[0];
    }

    return translation as string;
};
