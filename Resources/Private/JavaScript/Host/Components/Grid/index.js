import React, {Component, PropTypes} from 'react';
import mergeClassNames from 'classnames';
import style from './style.css';

export default class Grid extends Component {
    static propTypes = {
        children: PropTypes.node.isRequired,
        className: PropTypes.string
    }

    render() {
        const {className, children} = this.props;
        const classNames = mergeClassNames({
            [style.grid]: true,
            [className]: className && className.length
        });

        return (
            <div className={classNames}>
                {children}
            </div>
        );
    }
}
