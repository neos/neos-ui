import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import Icon from '@neos-project/react-ui-components/src/Icon/';
import {connect} from 'react-redux';
import mergeClassNames from 'classnames';
import {$transform, $get} from 'plow-js';
import style from './style.css';
import {neos} from '@neos-project/neos-ui-decorators';

@neos(globalRegistry => ({
    i18nRegistry: globalRegistry.get('i18n')
}))

@connect($transform({
    previewUrl: $get('ui.contentCanvas.previewUrl')
}))
export default class PreviewButton extends PureComponent {
    static propTypes = {
        previewUrl: PropTypes.string,
        i18nRegistry: PropTypes.object.isRequired
    };

    render() {
        const {previewUrl, i18nRegistry} = this.props;

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
                    aria-label={i18nRegistry.translate('Neos.Neos:Main:showPreview', 'Show Preview')}
                    title={i18nRegistry.translate('Neos.Neos:Main:showPreview', 'Show Preview')}
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
                aria-label={i18nRegistry.translate('Neos.Neos:Main:showPreview', 'Show Preview')}
                >
                <Icon icon="external-link-alt"/>
            </button>
        );
    }
}
