/*
 * This file is part of the Neos.Neos.Ui package.
 *
 * (c) Contributors of the Neos Project - www.neos.io
 *
 * This package is Open Source Software. For the full copyright and license
 * information, please view the LICENSE file which was distributed with this
 * source code.
 */
import React from 'react';

import {LegacyParameters, i18nRegistry} from '../registry';

interface I18nProps {
    // Fallback key which gets rendered once the i18n service doesn't return a translation.
    fallback?: string;

    // The target id which the i18n service accepts.
    id?: string;

    // The destination paths for the package and source of the translation.
    packageKey?: string;
    sourceName?: string;

    // Additional parameters which are passed to the i18n service.
    params?: LegacyParameters;

    // Optional className which gets added to the translation span.
    className?: string;
}

/**
 * @deprecated Use `import {tranlsate} from '@neos-project/neos-ui-i18n'` instead
 */
export class I18n extends React.PureComponent<I18nProps> {
    public render(): JSX.Element {
        const {packageKey, sourceName, params, id, fallback} = this.props;

        return (
            <span className={this.props.className}>{i18nRegistry.translate(id ?? '', fallback, params, packageKey ?? 'Neos.Neos', sourceName ?? 'Main')}</span>
        );
    }
}
