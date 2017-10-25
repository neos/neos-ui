import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import Icon from '@neos-project/react-ui-components/src/Icon/';
import {connect} from 'react-redux';
import mergeClassNames from 'classnames';
import {$transform, $get} from 'plow-js';
import style from './style.css';

@connect($transform({
    previewUrl: $get('ui.contentCanvas.previewUrl')
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

        return (
            <a
                href={previewUrl ? previewUrl : ''}
                target="neosPreview"
                rel="noopener noreferrer"
                className={previewButtonClassNames}
                >
                <Icon icon="external-link"/>
            </a>
        );
    }
}
