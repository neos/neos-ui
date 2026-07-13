import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import Icon from '@neos-project/react-ui-components/src/Icon/';
import {connect} from 'react-redux';
import mergeClassNames from 'classnames';

import style from './style.module.css';
import {translate} from '@neos-project/neos-ui-i18n';

@connect(state => ({
    previewUrl: state?.ui?.contentCanvas?.previewUrl
}))
export default class PreviewButton extends PureComponent {
    static propTypes = {
        previewUrl: PropTypes.string
    };

    render() {
        const {previewUrl} = this.props;

        const previewButtonClassNames = mergeClassNames({
            [style.secondaryToolbar__buttonLink]: true,
            [style['secondaryToolbar__buttonLink--isDisabled']]: !previewUrl
        });

        if (previewUrl) {
            return (
                <a
                    id="neos-PreviewButton"
                    href={previewUrl ? previewUrl : ''}
                    target="neosPreview"
                    className={previewButtonClassNames}
                    aria-label={translate('Neos.Neos.Ui:Main:showPreview', 'Show Preview')}
                    title={translate('Neos.Neos.Ui:Main:showPreview', 'Show Preview')}
                    >
                    <Icon icon="external-link-alt"/>
                </a>
            );
        }

        return (
            <button
                id="neos-PreviewButton"
                className={previewButtonClassNames}
                disabled
                aria-label={translate('Neos.Neos.Ui:Main:showPreview', 'Show Preview')}
                >
                <Icon icon="external-link-alt"/>
            </button>
        );
    }
}
