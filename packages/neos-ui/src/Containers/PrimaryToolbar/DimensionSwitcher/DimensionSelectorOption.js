import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import style from './style.module.css';
// eslint-disable-next-line camelcase
import SelectBox_Option_SingleLine from '@neos-project/react-ui-components/src/SelectBox_Option_SingleLine/index';
import mergeClassNames from 'classnames';
import {neos} from '@neos-project/neos-ui-decorators';

@neos(globalRegistry => ({
    i18nRegistry: globalRegistry.get('i18n')
}))

export default class DimensionSelectorOption extends PureComponent {
    static propTypes = {
        option: PropTypes.shape({
            label: PropTypes.string.isRequired,
            disallowed: PropTypes.bool,
            existing: PropTypes.bool,
            url: PropTypes.string
        }),
        i18nRegistry: PropTypes.object.isRequired
    };

    render() {
        const {option, i18nRegistry} = this.props;
        const className = mergeClassNames({
            [style.disallowed]: option.disallowed,
            [style.nonExistent]: !option.existing
        });

        if (!option.disallowed && option.existing && option.url) {
            const linkOptions = {
                href: option.url,
                target: '_blank',
                rel: 'noopener noreferrer',
                onClick: (event) => event.preventDefault()
            }
            return (

                // eslint-disable-next-line camelcase
                <SelectBox_Option_SingleLine
                    {...this.props}
                    className={className}
                    linkOptions={linkOptions}
                />
            );
        }
        option.title = option.disallowed ?
            i18nRegistry.translate('Neos.Neos.Ui:Main:dimensions.combinationNotAllowed') :
            i18nRegistry.translate('Neos.Neos.Ui:Main:dimensions.doesNotExistsInDimension')

        return (
            // eslint-disable-next-line camelcase
            <SelectBox_Option_SingleLine
                {...this.props}
                className={className}
            />
        );
    }
}
