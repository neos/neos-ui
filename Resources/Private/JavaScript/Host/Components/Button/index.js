import React, {Component, PropTypes} from 'react';
import mergeClassNames from 'classnames';
import {executeCallback} from '../../Abstracts/';
import style from './style.css';

export default class Button extends Component {
    static propTypes = {
        className: PropTypes.string,
        style: PropTypes.string,
        hoverStyle: PropTypes.string,
        onClick: PropTypes.func.isRequired,
        children: PropTypes.node.isRequired
    }

    render() {
        const {className, children} = this.props;
        const classNames = mergeClassNames({
            [style.btn]: true,
            [style['btn--clean']]: this.props.style === 'clean',
            [style['btn--transparent']]: this.props.style === 'transparent',
            [style['btn--cleanHover']]: this.props.hoverStyle === 'clean',
            [className]: true
        });

        return (
            <button className={classNames} onClick={e => executeCallback(e, this.props.onClick)}>
                {children}
            </button>
        );
    }
}
