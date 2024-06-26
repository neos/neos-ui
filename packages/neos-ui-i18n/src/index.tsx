import React from 'react';
import {Parameters, i18nRegistry} from './registry';

export {registerLocale} from './model';

export type {I18nRegistry} from './registry';
export {registerTranslations} from './registry';

export {translate} from './translate';

interface I18nProps {
    // Fallback key which gets rendered once the i18n service doesn't return a translation.
    fallback?: string;

    // The target id which the i18n service accepts.
    id?: string;

    // The destination paths for the package and source of the translation.
    packageKey?: string;
    sourceName?: string;

    // Additional parameters which are passed to the i18n service.
    params?: Parameters;

    // Optional className which gets added to the translation span.
    className?: string;
}

export default class I18n extends React.PureComponent<I18nProps> {
    public render(): JSX.Element {
        const {packageKey, sourceName, params, id, fallback} = this.props;

        return (
            <span className={this.props.className}>{i18nRegistry.translate(id ?? '', fallback, params, packageKey ?? 'Neos.Neos', sourceName ?? 'Main')}</span>
        );
    }
}
