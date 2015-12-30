import React, {Component, PropTypes} from 'react';
import mergeClassNames from 'classnames';
import style from './style.css';

export default class Bar extends Component {
    static propTypes = {
        position: PropTypes.oneOf(['top', 'bottom']).isRequired,
        className: PropTypes.string,
        children: PropTypes.node,
        onDrop: PropTypes.func
    }

    render() {
        const {position, className} = this.props;
        const classNames = mergeClassNames({
            [className]: className && className.length,
            [style.bar]: true,
            [style['bar--top']]: position === 'top',
            [style['bar--bottom']]: position === 'bottom'
        });

        return (
            <div className={classNames} onDragOver={e => e.preventDefault()} onDrop={e => this.onDrop(e)}>
              {this.props.children}
            </div>
        );
    }

    onDrop(e) {
        const {onDrop} = this.props;

        if (onDrop) {
            onDrop(e);

            e.stopPropagation();
        }
    }
}
