import React, {Component, PropTypes} from 'react';
import mergeClassNames from 'classnames';
import style from './style.css';

export default class Button extends Component {
    static propTypes = {
        enabled: PropTypes.bool,
        highlighted: PropTypes.bool,
        cavity: PropTypes.bool,
        label: PropTypes.string,
        indicator: PropTypes.number,
        children: PropTypes.node.isRequired,
        onClick: PropTypes.func.isRequired
    };

    render() {
        const {
            enabled,
            highlighted,
            cavity,
            indicator
        } = this.props;
        const btnClassName = mergeClassNames({
            [style.btn]: true,
            [style['btn--disabled']]: !enabled,
            [style['btn--notAllowed']]: !enabled,
            [style['btn--highlighted']]: highlighted,
            [style['btn--cavity']]: cavity
        });
        const btnAttributes = {
            disabled: !enabled
        };

        return (
            <button className={btnClassName} onClick={() => this.onClick()} {...btnAttributes}>
                {this.props.children} {indicator > 0 ? `(${indicator})` : ''}
            </button>
        );
    }

    onClick() {
        const {onClick} = this.props;

        onClick();
    }
}
