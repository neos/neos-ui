import React from 'react';
import {neos} from '@neos-project/neos-ui-decorators';
import {GlobalRegistry} from '@neos-project/neos-ts-interfaces';
import {NeosInjectedProps} from '@neos-project/neos-ui-decorators/src/neos';

const regsToProps = (globalRegistry: GlobalRegistry) => ({
    i18nRegistry: globalRegistry.get('i18n')
});
type InjectedProps = NeosInjectedProps<typeof regsToProps>;

interface I18nProps {
    // Fallback key which gets rendered once the i18n service doesn't return a translation.
    fallback?: string;

    // The target id which the i18n service accepts.
    id?: string;

    // The destination paths for the package and source of the translation.
    packageKey?: string;
    sourceName?: string;

    // Additional parameters which are passed to the i18n service.
    params?: object;

    // Optional className which gets added to the translation span.
    className?: string;
}

class I18n extends React.PureComponent<I18nProps & InjectedProps> {
    public render(): JSX.Element {
        const {i18nRegistry, packageKey, sourceName, params, id, fallback} = this.props;

        return (
            <span className={this.props.className}>{i18nRegistry.translate(id, fallback, params, packageKey, sourceName)}</span>
        );
    }
}

export default neos<I18nProps, InjectedProps>(regsToProps)(I18n);
