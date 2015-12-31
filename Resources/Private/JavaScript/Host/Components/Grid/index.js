import React, {Component, PropTypes} from 'react';
import mergeClassNames from 'classnames';
import style from './style.css';

export default class Grid extends Component {
    static propTypes = {
        className: PropTypes.string,
        children: PropTypes.node
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
