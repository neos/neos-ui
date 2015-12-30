import React, {Component, PropTypes} from 'react';
import mergeClassNames from 'classnames';

export default class Button extends Component {
    static propTypes = {
        enabled: PropTypes.bool,
        highlighted: PropTypes.bool,
        cavity: PropTypes.bool,
        label: PropTypes.string,
        indicator: PropTypes.number,
        style: PropTypes.object,

        children: PropTypes.node,

        onClick: PropTypes.func.isRequired
    };

    render() {
        const {
            enabled,
            highlighted,
            cavity,
            indicator,
            style
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
