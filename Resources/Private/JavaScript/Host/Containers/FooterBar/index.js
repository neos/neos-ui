import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import mergeClassNames from 'classnames';
import {$transform, $get} from 'plow-js';

import {actions} from 'Host/Redux/';
import {Bar} from 'Host/Components/';

import style from './style.css';

@connect($transform({
    isHidden: $get('ui.fullScreen.isFullScreen')
}))
export default class FooterBar extends Component {
    static propTypes = {
        isHidden: PropTypes.bool.isRequired
    };

    render() {
        const {isHidden} = this.props;
        const classNames = mergeClassNames({
            [style.footerBar]: true,
            [style['footerBar--isHidden']]: isHidden
        });

        return (
            <Bar className={classNames} position="bottom" />
        );
    }
}
