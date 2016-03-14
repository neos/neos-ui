import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import mergeClassNames from 'classnames';
import {$transform, $get} from 'plow-js';

import {Bar} from 'Host/Components/index';

import style from './style.css';

@connect($transform({
    isHidden: $get('ui.fullScreen.isFullScreen'),
    isActive: $get('ui.debugMode'),
    hoveredNodeContextPath: $get('cr.nodes.hovered.contextPath'),
    focusedNodeContextPath: $get('cr.nodes.focused.contextPath')
}))
export default class FooterBar extends Component {
    static propTypes = {
        isHidden: PropTypes.bool.isRequired,
        isActive: PropTypes.bool.isRequired,
        hoveredNodeContextPath: PropTypes.string,
        focusedNodeContextPath: PropTypes.string
    };

    render() {
        const {isHidden, isActive, hoveredNodeContextPath, focusedNodeContextPath} = this.props;
        const classNames = mergeClassNames({
            [style.footerBar]: true,
            [style['footerBar--isHidden']]: isHidden || !isActive
        });

        return (
            <Bar className={classNames} position="bottom">
                <small>{hoveredNodeContextPath || focusedNodeContextPath || null}</small>
            </Bar>
        );
    }
}
